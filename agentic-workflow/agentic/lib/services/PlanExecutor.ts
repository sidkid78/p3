/**
 * Plan Executor Service
 * Executes plans by coordinating agents and managing task flow
 */

import { PrismaClient } from '@prisma/client';
import { agentOrchestrator } from './AgentOrchestrator';
import { eventLogger } from './EventLogger';
import { getFileContent, parseRepoUrl } from '../github';
import type { Task, ModelPreference } from '@/types';

const prisma = new PrismaClient();

// Type for AI-generated plan steps
export interface GeneratedPlanStep {
  step_description: string;
  agent_name: string;
  agent_specialization: string[];
  model_preference: ModelPreference;
  estimated_duration: number;
  dependencies: number[];
}

export interface ExecutionContext {
  repo_url: string;
  context_files: string[];
  additional_instructions?: string;
}

export class PlanExecutor {
  constructor() { }

  /**
   * Create a new task from a plan
   */
  async createTask(plan: GeneratedPlanStep[], context: ExecutionContext): Promise<Task> {
    const dbPlan = await prisma.plan.create({
      data: {
        title: `Plan for ${context.repo_url}`,
        description: context.additional_instructions || 'Agentic execution plan',
        steps: {
          create: plan.map((step, index) => ({
            order: index,
            instruction: step.step_description,
            agentName: step.agent_name,
            agentSpecialization: step.agent_specialization,
            modelPreference: step.model_preference || 'gemini-3.8-flash',
            contextFiles: context.context_files,
          })),
        },
      },
      include: {
        steps: true,
      },
    });

    const dbTask = await prisma.task.create({
      data: {
        planId: dbPlan.id,
        title: `Task for ${context.repo_url}`,
        description: context.additional_instructions,
        status: 'PENDING',
      },
    });

    await eventLogger.logEvent({
      agent_id: '',
      task_id: dbTask.id,
      event_type: 'STATUS_CHANGE',
      payload: {
        plan_steps: plan.length,
        repo_url: context.repo_url,
      },
    });

    return this.mapDbTaskToTask(dbTask);
  }

  /**
   * Load context files from repository
   */
  private async loadContextFiles(repoUrl: string, contextFiles: string[]): Promise<string> {
    const repoInfo = parseRepoUrl(repoUrl);
    if (!repoInfo) {
      throw new Error('Invalid repository URL');
    }

    const { owner, repo } = repoInfo;
    const contextContent: string[] = [];

    for (const filePath of contextFiles) {
      try {
        const content = await getFileContent(owner, repo, filePath);
        contextContent.push(`\n--- File: ${filePath} ---\n${content}\n`);
      } catch (error) {
        console.error(`Failed to load context file ${filePath}:`, error);
        contextContent.push(`\n--- File: ${filePath} (Error loading) ---\n`);
      }
    }

    return contextContent.join('\n');
  }

  /**
   * Execute a single plan step
   */
  private async executePlanStep(
    taskId: string,
    step: {
      instruction: string;
      agentName: string;
      agentSpecialization: string[];
      modelPreference: string;
    }, // dbPlanStep
    contextContent: string
  ): Promise<string> {
    const agent = await agentOrchestrator.createAgent({
      name: step.agentName,
      specialization: step.agentSpecialization,
      model_preference: (step.modelPreference as ModelPreference) || 'gemini-3.8-flash',
      task_id: taskId,
    });

    console.log(`[PlanExecutor] Created agent ${agent.name} for task ${taskId}`);

    await eventLogger.logEvent({
      agent_id: agent.agent_id,
      task_id: taskId,
      event_type: 'PLAN_UPDATE',
      payload: {
        step_description: step.instruction,
      },
    });

    // Build prompt with context
    const systemInstruction = `You are ${agent.name}, a specialized AI agent with access to powerful tools.
Your role: ${step.instruction}

Available Tools:
- read_file: Read files from the repository
- write_file: Create or modify files
- list_directory: Browse directory contents
- search_files: Find files by pattern
- execute_bash: Run shell commands

Repository Context:
${contextContent}

IMPORTANT: You MUST use the available tools to complete your task. For example:
- Use read_file to examine existing code
- Use write_file to make changes
- Use list_directory to explore the codebase structure
- Use execute_bash to run tests or other commands

Think step-by-step and use tools to accomplish your goal. Do not just describe what should be done - actually do it using the tools!`;

    const prompt = `Task: ${step.instruction}

Please use the available tools to complete this task. Start by examining the relevant files, then make necessary changes.

Steps to follow:
1. Use list_directory or search_files to find relevant files
2. Use read_file to examine the current code
3. Use write_file to make necessary modifications
4. Use execute_bash to test your changes if appropriate

Begin now and use tools to complete the task.`;

    try {
      // Execute agent
      const result = await agentOrchestrator.executeAgent(
        agent.agent_id,
        prompt,
        systemInstruction
      );

      console.log(`[PlanExecutor] Agent ${agent.agent_id} completed task ${taskId}`);

      await eventLogger.logEvent({
        agent_id: agent.agent_id,
        task_id: taskId,
        event_type: 'PLAN_UPDATE',
        payload: {
          step_description: step.instruction,
          result_preview: result.substring(0, 200),
        },
      });

      return result;
    } catch (error) {
      await eventLogger.logEvent({
        agent_id: agent.agent_id,
        task_id: taskId,
        event_type: 'ERROR',
        payload: {
          step_description: step.instruction,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Execute a complete plan
   */
  async executePlan(taskId: string): Promise<void> {
    const dbTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        plan: {
          include: {
            steps: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!dbTask || !dbTask.plan) {
      throw new Error(`Task ${taskId} not found or has no plan`);
    }

    await prisma.task.update({
      where: { id: taskId },
      data: { status: 'IN_PROGRESS' },
    });

    try {
      // For now, load default context files if available, otherwise just repo
      const contextContent = await this.loadContextFiles(dbTask.title.replace('Task for ', ''), []);

      const results: string[] = [];
      for (const step of dbTask.plan.steps) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const s = step as any;
        const result = await this.executePlanStep(
          taskId,
          {
            instruction: s.instruction,
            agentName: s.agentName,
            agentSpecialization: s.agentSpecialization,
            modelPreference: s.modelPreference,
          },
          contextContent
        );
        results.push(result);
      }

      await prisma.task.update({
        where: { id: taskId },
        data: { status: 'COMPLETED' },
      });

      await eventLogger.logEvent({
        agent_id: '',
        task_id: taskId,
        event_type: 'STATUS_CHANGE',
        payload: {
          steps_completed: results.length,
        },
      });
    } catch (error) {
      await prisma.task.update({
        where: { id: taskId },
        data: { status: 'FAILED' },
      });

      await eventLogger.logEvent({
        agent_id: '',
        task_id: taskId,
        event_type: 'ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Get task by ID
   */
  async getTask(taskId: string): Promise<Task | null> {
    const dbTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: { agents: true },
    });
    return dbTask ? this.mapDbTaskToTask(dbTask) : null;
  }

  /**
   * Get all tasks
   */
  async getAllTasks(): Promise<Task[]> {
    const dbTasks = await prisma.task.findMany({
      include: { agents: true },
      orderBy: { createdAt: 'desc' },
    });
    return dbTasks.map((t) => this.mapDbTaskToTask(t));
  }

  /**
   * Update task status
   */
  async updateTaskStatus(taskId: string, status: any) {
    await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  }

  /**
   * Map DB Task to API Task type
   */
  private mapDbTaskToTask(dbTask: any): Task {
    return {
      task_id: dbTask.id,
      plan_id: dbTask.planId || '',
      status: dbTask.status as any,
      agents: (dbTask.agents || []).map((a: any) => ({
        agent_id: a.id,
        task_id: a.taskId,
        status: a.status,
        name: a.name,
        model_preference: a.modelPreference as any,
        specialization: a.specialization,
        created_at: a.createdAt.toISOString(),
      })),
      created_at: dbTask.createdAt.toISOString(),
      updated_at: dbTask.updatedAt.toISOString(),
      metrics: {
        elapsed_time: dbTask.elapsedTime,
        estimated_cost: dbTask.estimatedCost,
        files_touched: dbTask.filesTouched,
        tests_passed: dbTask.testsPassed,
        tests_failed: dbTask.testsFailed,
      },
    };
  }

  /**
   * Clear all tasks (for testing)
   */
  async clear() {
    await prisma.eventLog.deleteMany();
    await prisma.agent.deleteMany();
    await prisma.task.deleteMany();
    await prisma.planStep.deleteMany();
    await prisma.plan.deleteMany();
  }
}

// Singleton instance
export const planExecutor = new PlanExecutor();


