/**
 * Task Status API
 * Get detailed status information for a specific task
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { eventLogger } from '@/lib/services/EventLogger';
import { normalizeModel } from '@/types';

export const runtime = 'nodejs';

const prisma = new PrismaClient();

const TERMINAL_STATUSES = new Set(['COMPLETED', 'FAILED', 'CANCELLED']);
const FILE_WRITE_TOOLS = new Set(['create_file', 'update_file', 'delete_file']);

/**
 * GET /api/tasks/:taskId/status
 * Get task status with agents and events
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    // Load task + plan + agents from DB
    const dbTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        plan: {
          include: {
            steps: { orderBy: { order: 'asc' } },
          },
        },
        agents: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!dbTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Get recent events for this task from DB
    const events = await eventLogger.getEventsByTask(taskId);

    // Aggregate estimated costs from PLAN_UPDATE events
    const totals = events.reduce(
      (acc, ev) => {
        const p = (ev.payload || {}) as Record<string, unknown>;
        const inCost = typeof p.estimated_input_cost_usd === 'number' ? p.estimated_input_cost_usd : 0;
        const outCost =
          (typeof p.estimated_output_cost_usd === 'number' ? p.estimated_output_cost_usd : 0) +
          (typeof p.cost_usd === 'number' ? p.cost_usd : 0);
        return {
          estimated_input_cost_usd: acc.estimated_input_cost_usd + inCost,
          estimated_output_cost_usd: acc.estimated_output_cost_usd + outCost,
        };
      },
      { estimated_input_cost_usd: 0, estimated_output_cost_usd: 0 }
    );
    const estimated_total_cost_usd = Number(
      (totals.estimated_input_cost_usd + totals.estimated_output_cost_usd).toFixed(6)
    );

    const task = {
      task_id: dbTask.id,
      plan_id: dbTask.planId,
      title: dbTask.title,
      description: dbTask.description || '',
      status: dbTask.status,
      created_at: dbTask.createdAt.toISOString(),
      updated_at: dbTask.updatedAt.toISOString(),
      agents: dbTask.agents.map((a) => ({
        agent_id: a.id,
        name: a.name,
        status: a.status,
        model_preference: normalizeModel(a.modelPreference),
        specialization: a.specialization,
        created_at: a.createdAt.toISOString(),
        finished_at: a.finishedAt?.toISOString(),
      })),
      metrics: {
        // Task has no finishedAt column: for terminal states, updatedAt marks completion.
        elapsed_time: Math.round(
          ((TERMINAL_STATUSES.has(dbTask.status) ? dbTask.updatedAt.getTime() : Date.now()) -
            dbTask.createdAt.getTime()) / 1000
        ),
        estimated_cost: Math.round(estimated_total_cost_usd * 100),
        files_touched: events.filter(
          (e) =>
            e.event_type === 'TOOL_CALL' &&
            FILE_WRITE_TOOLS.has(String((e.payload as Record<string, unknown>)?.tool_name))
        ).length,
        tests_passed: 0,
        tests_failed: 0,
      },
    };

    return NextResponse.json({
      task,
      agents: task.agents,
      // ?events=all returns the full log (Debriefing Room); default is the 50 most recent.
      events: request.nextUrl.searchParams.get('events') === 'all' ? events : events.slice(-50),
      event_count: events.length,
      cost: {
        estimated_input_cost_usd: Number(totals.estimated_input_cost_usd.toFixed(6)),
        estimated_output_cost_usd: Number(totals.estimated_output_cost_usd.toFixed(6)),
        estimated_total_cost_usd,
      },
    });

  } catch (error) {
    console.error('Get task status error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get task status' },
      { status: 500 }
    );
  }
}
