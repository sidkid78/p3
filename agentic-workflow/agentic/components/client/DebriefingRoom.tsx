'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDuration } from '@/lib/utils';
import {
  ArrowLeft,
  CheckCircle,
  Trophy,
  BarChart3,
  FileText,
  Clock,
  Bot,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { Agent, EventLog } from '@/types';

interface DebriefingRoomProps {
  taskId: string;
}

interface TaskSummary {
  task_id: string;
  title?: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
  agents: Agent[];
}

type Payload = Record<string, unknown>;
const str = (v: unknown) => (typeof v === 'string' ? v : '');

/** Agents finish as SUCCESS (AgentStatus enum); COMPLETED is kept for older data. */
const isDone = (status?: string) => status === 'SUCCESS' || status === 'COMPLETED';

const statusVariant = (status?: string) =>
  isDone(status) ? 'success' : status === 'FAILED' ? 'destructive' : status === 'RUNNING' ? 'default' : 'secondary';

/** Final answer for an agent: full `output` on its completion event, else the 200-char preview older runs saved. */
function agentOutput(events: EventLog[]): { text: string; truncated: boolean } {
  for (let i = events.length - 1; i >= 0; i--) {
    const out = str((events[i].payload as Payload).output);
    if (events[i].event_type === 'STATUS_CHANGE' && out) return { text: out, truncated: false };
  }
  for (let i = events.length - 1; i >= 0; i--) {
    const preview = str((events[i].payload as Payload).result_preview);
    if (preview) return { text: preview, truncated: true };
  }
  return { text: '', truncated: false };
}

/** One-line summary of an event for the log. */
function eventSummary(e: EventLog): string {
  const p = e.payload as Payload;
  const args = (p.args ?? {}) as Payload;
  if (e.event_type === 'TOOL_CALL') return [str(p.tool_name), str(args.path) || str(args.pattern)].filter(Boolean).join(' → ');
  if (e.event_type === 'ERROR') return str(p.error) || str(p.message);
  if (p.tool_name && p.tool_result !== undefined) {
    const r = p.tool_result as Payload;
    return `${str(p.tool_name)} result${r && typeof r === 'object' && 'success' in r ? (r.success ? ' ✓' : ' ✗') : ''}`;
  }
  if (typeof p.cost_usd === 'number') return `${p.input_tokens ?? 0} in / ${p.output_tokens ?? 0} out tokens · $${p.cost_usd.toFixed(4)}`;
  if (p.new_status) return `→ ${str(p.new_status)}`;
  return str(p.message) || str(p.step_description);
}

export function DebriefingRoom({ taskId }: DebriefingRoomProps) {
  const [task, setTask] = useState<TaskSummary | null>(null);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}/status?events=all`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load task: ${res.statusText}`);
        const data = await res.json();
        setTask(data.task);
        setEvents(data.events ?? []);
        // Auto-select first agent
        if (data.task?.agents?.length > 0) {
          setSelectedAgentId(data.task.agents[0].agent_id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading task results…</span>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="h-full flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-destructive" />
        <span className="ml-2 text-destructive">{error || 'Task not found'}</span>
      </div>
    );
  }

  const completedAgents = task.agents.filter(a => isDone(a.status));
  const failedAgents = task.agents.filter(a => a.status === 'FAILED');
  const selectedAgent = task.agents.find(a => a.agent_id === selectedAgentId) ?? task.agents[0];

  // Compute elapsed time from created_at to updated_at
  const elapsedMs = new Date(task.updated_at).getTime() - new Date(task.created_at).getTime();
  const elapsedSec = Math.round(elapsedMs / 1000);

  // Events for selected agent (oldest first)
  const agentEvents = events
    .filter(e => e.agent_id === selectedAgent?.agent_id)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const output = agentOutput(agentEvents);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/tasks/${taskId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Monitor
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Debriefing Room
            </h1>
            <div className="text-muted-foreground prose prose-invert prose-sm max-w-none">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {task.description || task.title || `Task ${taskId.slice(0, 8)}`}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={task.status === 'COMPLETED' ? 'success' : task.status === 'FAILED' ? 'destructive' : 'secondary'}>
            {task.status}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Bot className="w-3 h-3" />
            {task.agents.length} agents
          </Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mission Summary</CardTitle>
          <CardDescription>Aggregate results across all agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium">{formatDuration(elapsedSec)}</div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium">{task.agents.length}</div>
                <div className="text-sm text-muted-foreground">Agents Deployed</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium">{completedAgents.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              <div>
                <div className="font-medium">{events.length}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </div>
            </div>
          </div>

          {failedAgents.length > 0 && (
            <div className="mt-4 p-3 bg-destructive/10 rounded-lg text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {failedAgents.length} agent(s) failed: {failedAgents.map(a => a.name).join(', ')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Results */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List */}
        <div className="space-y-3 overflow-y-auto">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Agents</h2>
          {task.agents.map((agent, idx) => (
            <Card
              key={agent.agent_id}
              className={`cursor-pointer transition-colors ${selectedAgentId === agent.agent_id ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'
                }`}
              onClick={() => setSelectedAgentId(agent.agent_id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{agent.name || `Agent ${idx + 1}`}</span>
                  </div>
                  <Badge variant={statusVariant(agent.status)} className="text-xs">
                    {agent.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {agent.model_preference}
                </div>
                {agent.specialization && agent.specialization.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {agent.specialization.slice(0, 3).map(s => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {task.agents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No agents ran for this task</p>
            </div>
          )}
        </div>

        {/* Selected Agent Detail */}
        <div className="lg:col-span-2 overflow-y-auto">
          {selectedAgent ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    {selectedAgent.name}
                  </CardTitle>
                  <Badge variant={statusVariant(selectedAgent.status)}>
                    {selectedAgent.status}
                  </Badge>
                </div>
                <CardDescription>
                  Model: <span className="font-mono">{selectedAgent.model_preference}</span>
                  {selectedAgent.specialization?.length ? ` • ${selectedAgent.specialization.join(', ')}` : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Started</div>
                    <div className="font-mono">{selectedAgent.created_at ? new Date(selectedAgent.created_at).toLocaleTimeString() : '—'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Completed</div>
                    <div className="font-mono">{selectedAgent.finished_at ? new Date(selectedAgent.finished_at).toLocaleTimeString() : '—'}</div>
                  </div>
                </div>

                {/* Result */}
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Result
                    {output.truncated && (
                      <Badge variant="outline" className="text-xs">preview only (run predates full-output logging)</Badge>
                    )}
                  </h3>
                  {output.text ? (
                    <div className="p-4 rounded-lg bg-muted/30 border border-muted/20 prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                        {output.truncated ? `${output.text}…` : output.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No output recorded for this agent</div>
                  )}
                </div>

                {/* Event Log */}
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Event Log
                    <Badge variant="outline" className="text-xs">{agentEvents.length} events</Badge>
                  </h3>
                  <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {agentEvents.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No events recorded for this agent
                      </div>
                    ) : (
                      agentEvents.map((e, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/30 text-xs border border-muted/20">
                          <span className="text-muted-foreground font-mono shrink-0">
                            {new Date(e.timestamp).toLocaleTimeString()}
                          </span>
                          <Badge
                            variant={e.event_type === 'ERROR' ? 'destructive' : 'outline'}
                            className="text-[10px] uppercase font-bold py-0 h-4 shrink-0"
                          >
                            {e.event_type.replace(/_/g, ' ')}
                          </Badge>
                          <span className="font-mono text-[11px] truncate" title={eventSummary(e)}>
                            {eventSummary(e)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Select an agent to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
