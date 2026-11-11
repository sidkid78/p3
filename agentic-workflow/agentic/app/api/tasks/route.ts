import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, TaskStatus } from '@prisma/client';
import { planExecutor } from '@/lib/services';
import type { GeneratedPlanStep } from '@/lib/services/PlanExecutor';

const prisma = new PrismaClient();

// GET /api/tasks - List all tasks from DB
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const take = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('offset') || '0');

    const where = statusFilter && statusFilter !== 'all' && Object.values(TaskStatus).includes(statusFilter as TaskStatus)
      ? { status: statusFilter as TaskStatus }
      : {};

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take,
        skip,
        include: {
          plan: {
            include: { steps: { orderBy: { order: 'asc' } } },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    const agents = await prisma.agent.findMany({
      where: { taskId: { in: tasks.map(t => t.id) } },
    });

    const agentsByTask = agents.reduce<Record<string, typeof agents>>((acc, a) => {
      if (!acc[a.taskId]) acc[a.taskId] = [];
      acc[a.taskId].push(a);
      return acc;
    }, {});

    const apiTasks = tasks.map((t) => ({
      task_id: t.id,
      plan_id: t.planId,
      title: t.title,
      description: t.description || '',
      status: t.status,
      created_at: t.createdAt.toISOString(),
      updated_at: t.updatedAt.toISOString(),
      agents: (agentsByTask[t.id] ?? []).map((a) => ({
        agent_id: a.id,
        name: a.name,
        status: a.status,
        model_preference: a.modelPreference,
        specialization: a.specialization,
        created_at: a.createdAt.toISOString(),
      })),
      metrics: {
        elapsed_time: Math.round(t.elapsedTime / 1000), // ms → seconds
        estimated_cost: t.estimatedCost, // cents
        files_touched: t.filesTouched,
        tests_passed: t.testsPassed,
        tests_failed: t.testsFailed,
      },
    }));

    return NextResponse.json({ tasks: apiTasks, total, limit: take, offset: skip });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST /api/tasks - Create and execute a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, repo_url, agents: agentConfigs } = body;

    if (!title) {
      return NextResponse.json({ error: 'Missing required field: title' }, { status: 400 });
    }

    const simplePlan: GeneratedPlanStep[] = [{
      step_description: description || title,
      agent_name: agentConfigs?.[0]?.name || 'Task-Agent',
      agent_specialization: agentConfigs?.[0]?.specialization || ['general'],
      model_preference: agentConfigs?.[0]?.model_preference || 'gemini-3.8-flash',
      estimated_duration: 5,
      dependencies: [],
    }];

    const task = await planExecutor.createTask(simplePlan, {
      repo_url: repo_url || 'https://github.com/sidkid78/diverse',
      context_files: [],
      additional_instructions: description,
    });

    // Execute plan asynchronously
    planExecutor.executePlan(task.task_id).catch((err) => {
      console.error('Task execution error:', err);
    });

    const dbTask = await prisma.task.findUnique({
      where: { id: task.task_id },
      include: { plan: true },
    });

    const taskAgents = await prisma.agent.findMany({ where: { taskId: task.task_id } });

    return NextResponse.json({
      task: {
        task_id: task.task_id,
        plan_id: dbTask?.planId,
        title,
        description: description || '',
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
        agents: taskAgents.map((a) => ({
          agent_id: a.id,
          name: a.name,
          status: a.status,
          model_preference: a.modelPreference,
          specialization: a.specialization,
          created_at: a.createdAt.toISOString(),
        })),
        metrics: { elapsed_time: 0, estimated_cost: 0, files_touched: 0, tests_passed: 0, tests_failed: 0 },
      },
      message: 'Task created and execution started',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
