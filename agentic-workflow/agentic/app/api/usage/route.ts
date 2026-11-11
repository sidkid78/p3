/**
 * Usage & Analytics API
 * Computes real usage stats from DB tasks and agents
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { MODEL_OPTIONS, normalizeModel } from '@/types';

export const runtime = 'nodejs';

const prisma = new PrismaClient();

function getModelInfo(model: string) {
    const opt = MODEL_OPTIONS[normalizeModel(model)];
    return { ...opt.pricing, label: opt.label, icon: opt.icon };
}

export async function GET() {
    try {
        // Fetch all tasks with agents
        const tasks = await prisma.task.findMany({
            include: {
                agents: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        // Aggregate totals
        let totalCostCents = 0;
        let totalElapsedMs = 0;
        let completedTasks = 0;
        let failedTasks = 0;

        // Model breakdown: model -> { costCents, agentCount, taskIds }
        const modelMap: Record<string, { costCents: number; agents: number; tasks: Set<string> }> = {};

        // Daily usage: date string -> { costCents, taskCount }
        const dailyMap: Record<string, { costCents: number; tasks: number }> = {};

        for (const task of tasks) {
            totalCostCents += task.estimatedCost;
            totalElapsedMs += task.elapsedTime;
            if (task.status === 'COMPLETED') completedTasks++;
            if (task.status === 'FAILED') failedTasks++;

            // Daily bucket
            const dateKey = task.createdAt.toISOString().slice(0, 10);
            if (!dailyMap[dateKey]) dailyMap[dateKey] = { costCents: 0, tasks: 0 };
            dailyMap[dateKey].costCents += task.estimatedCost;
            dailyMap[dateKey].tasks += 1;

            // Per-agent model breakdown (distribute task cost evenly among agents)
            const agentCount = task.agents.length || 1;
            const costPerAgent = task.estimatedCost / agentCount;

            for (const agent of task.agents) {
                const model = normalizeModel(agent.modelPreference);
                if (!modelMap[model]) modelMap[model] = { costCents: 0, agents: 0, tasks: new Set() };
                modelMap[model].costCents += costPerAgent;
                modelMap[model].agents += 1;
                modelMap[model].tasks.add(task.id);
            }
        }

        // Estimate tokens from cost using pricing (blended ~50% input / 50% output assumption)
        const estimateTokens = (costDollars: number, model: string) => {
            const info = getModelInfo(model);
            const blendedPricePerMToken = (info.input + info.output) / 2;
            if (blendedPricePerMToken === 0) return 0;
            return Math.round((costDollars / blendedPricePerMToken) * 1_000_000);
        };

        const totalCostDollars = totalCostCents / 100;

        // Model breakdown response
        const modelBreakdown = Object.entries(modelMap).map(([model, data]) => {
            const costDollars = data.costCents / 100;
            const info = getModelInfo(model);
            return {
                model,
                label: info.label,
                icon: info.icon,
                costDollars,
                estimatedTokens: estimateTokens(costDollars, model),
                agentCount: data.agents,
                taskCount: data.tasks.size,
                pricing: { input: info.input, output: info.output },
            };
        }).sort((a, b) => b.costDollars - a.costDollars);

        // Daily usage response (last 30 days)
        const last30Days = Object.entries(dailyMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-30)
            .map(([date, data]) => ({
                date,
                costDollars: data.costCents / 100,
                taskCount: data.tasks,
            }));

        return NextResponse.json({
            summary: {
                totalCostDollars,
                totalElapsedMs,
                totalTasks: tasks.length,
                completedTasks,
                failedTasks,
                avgCostPerTask: tasks.length ? totalCostDollars / tasks.length : 0,
            },
            modelBreakdown,
            dailyUsage: last30Days,
            currentMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        });
    } catch (error) {
        console.error('Usage API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to load usage data' },
            { status: 500 }
        );
    }
}
