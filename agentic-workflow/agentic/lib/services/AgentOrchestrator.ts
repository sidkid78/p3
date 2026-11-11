/**
 * Agent Orchestrator Service
 * Manages agent lifecycle, spawning, and coordination
 */

import { PrismaClient, AgentStatus } from '@prisma/client';
import { createInteraction, generateContentStream, usageAndCost, type Interaction } from '../gemini';
import agentToolsManager from '@/lib/tools';
import { eventLogger } from './EventLogger';
import { normalizeModel, type Agent, type ModelPreference } from '@/types';

const prisma = new PrismaClient();

export interface AgentConfig {
  name: string;
  specialization: string[];
  model_preference: ModelPreference;
  parent_agent_id?: string;
  task_id: string;
}

export class AgentOrchestrator {
  constructor() { }

  /**
   * Create a new agent
   */
  async createAgent(config: AgentConfig): Promise<Agent> {
    const dbAgent = await prisma.agent.create({
      data: {
        taskId: config.task_id,
        parentAgentId: config.parent_agent_id ?? null,
        name: config.name,
        status: AgentStatus.PENDING,
        modelPreference: config.model_preference,
        specialization: config.specialization,
      } as any,
    });

    await eventLogger.logEvent({
      agent_id: dbAgent.id,
      task_id: dbAgent.taskId,
      event_type: 'AGENT_SPAWN',
      payload: {
        agent_name: dbAgent.name,
        specialization: dbAgent.specialization,
      },
    });

    return this.mapDbAgentToAgent(dbAgent);
  }

  /**
   * Spawn a child agent
   */
  async spawnChildAgent(
    parentAgentId: string,
    taskId: string,
    name: string,
    specialization: string[],
    modelPreference: ModelPreference
  ): Promise<Agent> {
    return this.createAgent({
      name,
      specialization,
      model_preference: modelPreference,
      parent_agent_id: parentAgentId,
      task_id: taskId,
    });
  }

  /**
   * Update agent status
   */
  async updateAgentStatus(agentId: string, status: AgentStatus, finishedAt?: string) {
    const dbAgent = await prisma.agent.update({
      where: { id: agentId },
      data: {
        status,
        finishedAt: finishedAt ? new Date(finishedAt) : undefined,
      },
    });

    await eventLogger.logEvent({
      agent_id: agentId,
      task_id: dbAgent.taskId,
      event_type: 'STATUS_CHANGE',
      payload: {
        new_status: status,
      },
    });
  }

  /**
   * Execute agent task
   */
  async executeAgent(
    agentId: string,
    prompt: string,
    systemInstruction?: string
  ): Promise<string> {
    const agent = await this.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    await this.updateAgentStatus(agentId, 'RUNNING');

    await eventLogger.logEvent({
      agent_id: agentId,
      task_id: agent.task_id,
      event_type: 'MODEL_CALL',
      payload: {
        prompt,
      },
    });

    try {
      // Multi-turn tool loop: the model calls functions, we run them and send
      // function_result steps back via previous_interaction_id until it answers.
      const tools = agentToolsManager.getToolDeclarations(false);
      const MAX_TOOL_TURNS = 25;

      let input: Parameters<typeof createInteraction>[1] = prompt;
      let previousInteractionId: string | undefined;
      let interaction: Interaction | undefined;
      let pendingResults = false; // true while tool results have not yet been answered
      let totalInput = 0;
      let totalOutput = 0;
      let totalCostUsd = 0;
      const toolLog: string[] = [];

      for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
        interaction = await createInteraction(agent.model_preference, input, {
          systemInstruction,
          tools,
          previousInteractionId,
        });
        pendingResults = false;

        const { inputTokens, outputTokens, costUsd } = usageAndCost(agent.model_preference, interaction);
        totalInput += inputTokens;
        totalOutput += outputTokens;
        totalCostUsd += costUsd;

        const calls = (interaction.steps ?? []).filter(
          (step): step is Extract<typeof step, { type: 'function_call' }> => step.type === 'function_call'
        );
        if (calls.length === 0) break;

        const functionResults = [];
        for (const call of calls) {
          const args = (call.arguments ?? {}) as Record<string, unknown>;

          await eventLogger.logEvent({
            agent_id: agentId,
            task_id: agent.task_id,
            event_type: 'TOOL_CALL',
            payload: { tool_name: call.name, args },
          });

          let resultText: string;
          let isError = false;
          try {
            const toolResult = await agentToolsManager.executeTool(call.name, args);
            resultText = JSON.stringify(toolResult);

            await eventLogger.logEvent({
              agent_id: agentId,
              task_id: agent.task_id,
              event_type: 'PLAN_UPDATE',
              payload: { tool_name: call.name, tool_result: toolResult },
            });
            toolLog.push(`[Tool ${call.name} Result]\n${JSON.stringify(toolResult, null, 2)}`);
          } catch (toolError) {
            isError = true;
            resultText = toolError instanceof Error ? toolError.message : String(toolError);

            await eventLogger.logEvent({
              agent_id: agentId,
              task_id: agent.task_id,
              event_type: 'ERROR',
              payload: { tool_name: call.name, error: resultText },
            });
            toolLog.push(`[Tool ${call.name} Error] ${resultText}`);
          }

          functionResults.push({
            type: 'function_result' as const,
            name: call.name,
            call_id: call.id,
            is_error: isError,
            result: [{ type: 'text' as const, text: resultText }],
          });
        }

        input = functionResults;
        previousInteractionId = interaction.id;
        pendingResults = true;
      }

      // Tool budget exhausted mid-investigation: hand back the last results with no tools
      // and an explicit instruction, so the model writes its final answer instead of the
      // run ending silently. (Verified: tool_choice 'none' alone still yields a function
      // call, and allowed_tools mode 'none' is rejected by the API.)
      if (pendingResults) {
        await eventLogger.logEvent({
          agent_id: agentId,
          task_id: agent.task_id,
          event_type: 'STATUS_CHANGE',
          payload: { message: `Tool budget (${MAX_TOOL_TURNS} turns) reached; requesting final answer` },
        });
        interaction = await createInteraction(agent.model_preference, input, {
          systemInstruction: [
            systemInstruction,
            'Tool budget exhausted. Do not call any more tools. Write your final answer now, based on what you have found so far, and note anything you could not verify.',
          ]
            .filter(Boolean)
            .join('\n\n'),
          previousInteractionId,
        });
        let usage = usageAndCost(agent.model_preference, interaction);
        totalInput += usage.inputTokens;
        totalOutput += usage.outputTokens;
        totalCostUsd += usage.costUsd;

        // Some models (verified with flash-lite) still emit a function call because the
        // conversation history contains one. Fall back to a fresh, tool-free conversation
        // that carries the task plus the gathered tool results as plain text.
        const stillCalling = (interaction.steps ?? []).some((step) => step.type === 'function_call');
        if (stillCalling || !interaction.output_text) {
          const MAX_CONTEXT_CHARS = 60_000;
          let findings = toolLog.join('\n\n');
          if (findings.length > MAX_CONTEXT_CHARS) {
            findings = `[earlier tool output truncated]\n${findings.slice(-MAX_CONTEXT_CHARS)}`;
          }
          interaction = await createInteraction(
            agent.model_preference,
            `${prompt}\n\n---\nYou already investigated this using tools. Their results:\n\n${findings}\n\n---\nThe tool budget is exhausted and no tools are available. Write your final answer now, based on these results, and note anything you could not verify.`,
            { systemInstruction }
          );
          usage = usageAndCost(agent.model_preference, interaction);
          totalInput += usage.inputTokens;
          totalOutput += usage.outputTokens;
          totalCostUsd += usage.costUsd;
        }
      }

      if (totalInput > 0 || totalOutput > 0) {
        await eventLogger.logEvent({
          agent_id: agentId,
          task_id: agent.task_id,
          event_type: 'PLAN_UPDATE',
          payload: {
            input_tokens: totalInput,
            output_tokens: totalOutput,
            cost_usd: Number(totalCostUsd.toFixed(6)),
          },
        });

        // Accumulate cost on the Task record
        await prisma.task.update({
          where: { id: agent.task_id },
          data: { estimatedCost: { increment: Math.round(totalCostUsd * 100) } },
        });
      }

      const finalText = interaction?.output_text ?? '';
      const result = [finalText, ...toolLog].filter(Boolean).join('\n\n');

      await this.updateAgentStatus(agentId, 'SUCCESS', new Date().toISOString());

      await eventLogger.logEvent({
        agent_id: agentId,
        task_id: agent.task_id,
        event_type: 'STATUS_CHANGE',
        payload: {
          result_length: result.length,
          tool_call_count: toolLog.length,
          // The model's final answer, shown in the Debriefing Room.
          output: finalText,
        },
      });

      return result;
    } catch (error) {
      await this.updateAgentStatus(agentId, 'FAILED', new Date().toISOString());

      await eventLogger.logEvent({
        agent_id: agentId,
        task_id: agent.task_id,
        event_type: 'ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Execute agent task with streaming
   */
  async *executeAgentStream(
    agentId: string,
    prompt: string,
    systemInstruction?: string
  ): AsyncGenerator<string> {
    const agent = await this.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    await this.updateAgentStatus(agentId, 'RUNNING');

    await eventLogger.logEvent({
      agent_id: agentId,
      task_id: agent.task_id,
      event_type: 'MODEL_CALL',
      payload: {
        prompt,
      },
    });

    try {
      for await (const chunk of generateContentStream(
        agent.model_preference,
        prompt,
        systemInstruction
      )) {
        yield chunk;
      }

      await this.updateAgentStatus(agentId, 'SUCCESS', new Date().toISOString());

      await eventLogger.logEvent({
        agent_id: agentId,
        task_id: agent.task_id,
        event_type: 'STATUS_CHANGE',
        payload: {},
      });
    } catch (error) {
      await this.updateAgentStatus(agentId, 'FAILED', new Date().toISOString());

      await eventLogger.logEvent({
        agent_id: agentId,
        task_id: agent.task_id,
        event_type: 'ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Get agent by ID
   */
  async getAgent(agentId: string): Promise<Agent | null> {
    const dbAgent = await prisma.agent.findUnique({
      where: { id: agentId },
    });
    return dbAgent ? this.mapDbAgentToAgent(dbAgent) : null;
  }

  /**
   * Get all agents for a task
   */
  async getAgentsByTask(taskId: string): Promise<Agent[]> {
    const dbAgents = await prisma.agent.findMany({
      where: { taskId },
    });
    return dbAgents.map(this.mapDbAgentToAgent);
  }

  /**
   * Map DB Agent to API Agent type
   */
  private mapDbAgentToAgent(dbAgent: any): Agent {
    return {
      agent_id: dbAgent.id,
      parent_agent_id: dbAgent.parentAgentId || undefined,
      task_id: dbAgent.taskId,
      status: dbAgent.status as any,
      model_preference: normalizeModel(dbAgent.modelPreference),
      name: dbAgent.name,
      specialization: dbAgent.specialization,
      created_at: dbAgent.createdAt.toISOString(),
      finished_at: dbAgent.finishedAt?.toISOString(),
    };
  }

  /**
   * Clear all agents (for testing)
   */
  async clear() {
    await prisma.agent.deleteMany();
  }
}

// Singleton instance
export const agentOrchestrator = new AgentOrchestrator();


