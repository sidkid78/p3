'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MODEL_OPTIONS } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  DollarSign,
  Clock,
  Activity,
  TrendingUp,
  Calendar,
  Zap,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface ModelBreakdown {
  model: string;
  label: string;
  icon: string;
  costDollars: number;
  estimatedTokens: number;
  agentCount: number;
  taskCount: number;
  pricing: { input: number; output: number };
}

interface DailyUsage {
  date: string;
  costDollars: number;
  taskCount: number;
}

interface UsageData {
  summary: {
    totalCostDollars: number;
    totalElapsedMs: number;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    avgCostPerTask: number;
  };
  modelBreakdown: ModelBreakdown[];
  dailyUsage: DailyUsage[];
  currentMonth: string;
}

const fmt$ = (n: number) => `$${n.toFixed(4)}`;
const fmtBig$ = (n: number) => n < 0.01 ? `$${n.toFixed(4)}` : `$${n.toFixed(2)}`;
const fmtTokens = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;
const fmtDuration = (ms: number) => {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m ${s % 60}s`;
};

export default function UsagePage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/usage')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground mr-2" />
        <span className="text-muted-foreground">Loading usage data…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-6 h-6 text-destructive mr-2" />
        <span className="text-destructive">{error || 'Failed to load usage data'}</span>
      </div>
    );
  }

  const { summary, modelBreakdown, dailyUsage, currentMonth } = data;

  // Max cost for bar chart scaling
  const maxDailyCost = Math.max(...dailyUsage.map(d => d.costDollars), 0.01);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-500" />
            Usage &amp; Analytics
          </h1>
          <p className="text-muted-foreground">Real costs and performance from your DB</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {currentMonth}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fmtBig$(summary.totalCostDollars)}</div>
            <div className="text-xs text-muted-foreground mt-1">{summary.totalTasks} tasks total</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost / Task</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{fmtBig$(summary.avgCostPerTask)}</div>
            <div className="text-xs text-muted-foreground mt-1">across all runs</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{summary.totalTasks}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />{summary.completedTasks}
              </span>
              <span className="flex items-center gap-1 text-red-500">
                <XCircle className="w-3 h-3" />{summary.failedTasks}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compute Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{fmtDuration(summary.totalElapsedMs)}</div>
            <div className="text-xs text-muted-foreground mt-1">total wall time</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="models">Model Breakdown</TabsTrigger>
          <TabsTrigger value="daily">Daily Usage</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Reference</TabsTrigger>
        </TabsList>

        {/* Model Breakdown */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage by Model</CardTitle>
              <CardDescription>Cost breakdown by AI model (estimated from task cost allocation)</CardDescription>
            </CardHeader>
            <CardContent>
              {modelBreakdown.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No model usage recorded yet</p>
                  <p className="text-xs">Run some tasks to see cost breakdown here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {modelBreakdown.map(({ model, label, icon, costDollars, estimatedTokens, agentCount, taskCount }) => (
                    <div key={model} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{icon}</div>
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-xs text-muted-foreground font-mono">{model}</div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">{agentCount} agents</Badge>
                            <Badge variant="outline" className="text-xs">{taskCount} tasks</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-lg font-bold">{fmtBig$(costDollars)}</div>
                        <div className="text-sm text-muted-foreground">~{fmtTokens(estimatedTokens)} tokens est.</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Usage */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Usage</CardTitle>
              <CardDescription>Cost and task volume (last 30 days with activity)</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyUsage.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No daily data yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dailyUsage.map(day => {
                    const pct = Math.max(4, Math.round((day.costDollars / maxDailyCost) * 100));
                    return (
                      <div key={day.date} className="flex items-center gap-3 p-3 border rounded">
                        <div className={`w-2 bg-blue-500 rounded ${pct > 75 ? 'h-10' : pct > 50 ? 'h-7' : pct > 25 ? 'h-5' : 'h-3'}`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-xs text-muted-foreground">{day.taskCount} task{day.taskCount !== 1 ? 's' : ''}</div>
                        </div>
                        <div className="text-base font-bold">{fmtBig$(day.costDollars)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Reference */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gemini API Pricing Reference</CardTitle>
              <CardDescription>Current pricing used for cost estimation (USD per 1M tokens)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(MODEL_OPTIONS).map(([model, { label, icon, pricing: { input, output } }]) => (
                  <div key={model} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{icon}</span>
                      <div>
                        <div className="font-medium text-sm">{label}</div>
                        <div className="text-xs text-muted-foreground font-mono">{model}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div><span className="text-muted-foreground">In: </span>{fmt$(input)}/MTok</div>
                      <div><span className="text-muted-foreground">Out: </span>{fmt$(output)}/MTok</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                * Token estimates are approximated from task cost using a blended input/output ratio.
                Actual token counts are not stored in the DB.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
