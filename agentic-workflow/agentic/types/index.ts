// Core data models for the agentic workflow platform
export interface Agent {
  agent_id: string;
  parent_agent_id?: string;
  task_id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'RUNNING' | 'SUCCESS';
  model_preference: ModelPreference;
  name: string;
  specialization: string[];
  created_at: string;
  updated_at?: string;
  finished_at?: string;
}

export interface AgentConfig {
  name: string;
  model: ModelPreference;
  specialization: string[];
  system_prompt: string;
}

export interface Plan {
  plan_id: string;
  user_id: string;
  title: string;
  description: string;
  steps: PlanStep[];
  created_at: string;
}

export interface PlanStep {
  step_id: string;
  instruction: string;
  assigned_agents: string[];
  context_files: string[];
  order: number;
}

export interface Task {
  task_id: string;
  plan_id: string;
  title?: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  execution_environment_id?: string;
  agents: Agent[];
  created_at: string;
  updated_at: string;
  metrics?: TaskMetrics;
}

export interface TaskMetrics {
  elapsed_time: number;
  estimated_cost: number;
  files_touched: number;
  tests_passed?: number;
  tests_failed?: number;
}

export interface Context {
  context_id: string;
  agent_id: string;
  turn_index: number;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  created_at: string;
}

export interface EventLog {
  event_id: string;
  agent_id: string;
  task_id: string;
  timestamp: string;
  event_type: 'MODEL_CALL' | 'TOOL_CALL' | 'AGENT_SPAWN' | 'PLAN_UPDATE' | 'STATUS_CHANGE' | 'ERROR';
  payload: Record<string, unknown>;
}

export interface AIDoc {
  doc_id: string;
  title: string;
  content: string;
  file_type: 'markdown' | 'pdf' | 'text' | 'image';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface PlanTemplate {
  template_id: string;
  title: string;
  description: string;
  steps: Omit<PlanStep, 'step_id'>[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ReusablePrompt {
  prompt_id: string;
  title: string;
  content: string;
  variables: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

// UI State types
export interface MissionControlState {
  goal: string;
  plan: PlanStep[];
  agents: Partial<Agent>[];
  selectedContext: string[];
  runMode: 'single' | 'best-of-n';
  variantCount: number;
}

export interface LiveOpsState {
  task: Task;
  eventStream: EventLog[];
  selectedAgent?: string;
  isPaused: boolean;
}

export interface DebriefingState {
  variants: TaskVariant[];
  selectedVariant?: string;
}

export interface TaskVariant {
  task_id: string;
  summary: string;
  metrics: TaskMetrics;
  files_changed: FileChange[];
  approach_description: string;
}

export interface FileChange {
  file_path: string;
  change_type: 'created' | 'modified' | 'deleted';
  additions: number;
  deletions: number;
  diff: string;
}

// API Response types
export interface CreateTaskResponse {
  task_id: string;
  status: string;
  observability_stream_url: string;
}

export interface StreamEvent {
  event_id: string;
  agent_id: string;
  timestamp: string;
  event_type: string;
  payload: Record<string, unknown>;
}

// Model preferences with display info
export const MODEL_OPTIONS = {
  'gemini-3.1-pro-preview': {
    label: 'Gemini 3.1 Pro',
    description: 'Complex reasoning, architecture decisions, critical refactoring',
    icon: '🧠',
    cost_tier: 'high',
    pricing: { input: 2.0, output: 12.0 },
  },
  'gemini-3.8-flash': {
    label: 'Gemini 3.8 Flash',
    description: 'Latest Flash: strong coding and multi-step agentic work',
    icon: '🚀',
    cost_tier: 'medium',
    // Standard rate from Jan 1, 2027 (introductory $0.75/$3.75 through Dec 31, 2026).
    pricing: { input: 1.5, output: 7.5 },
  },
  'gemini-3.5-flash-lite': {
    label: 'Gemini 3.5 Flash-Lite',
    description: 'Fastest and cheapest, for simple, high-volume tasks',
    icon: '💡',
    cost_tier: 'low',
    pricing: { input: 0.3, output: 2.5 },
  },
} as const;

export type ModelPreference = keyof typeof MODEL_OPTIONS;

export const DEFAULT_MODEL: ModelPreference = 'gemini-3.8-flash';

/** Legacy model ids (possibly still stored in the DB) mapped to current tiers. */
const LEGACY_MODEL_MAP: Record<string, ModelPreference> = {
  'gemini-2.0-flash': 'gemini-3.8-flash',
  'gemini-2.0-pro': 'gemini-3.1-pro-preview',
  'gemini-2.5-pro': 'gemini-3.1-pro-preview',
  'gemini-2.5-flash': 'gemini-3.8-flash',
  'gemini-3-flash-preview': 'gemini-3.8-flash',
  'gemini-3.5-flash': 'gemini-3.8-flash',
  'gemini-3.6-flash': 'gemini-3.8-flash',
  'gemini-3.7-flash': 'gemini-3.8-flash',
  'gemini-2.5-flash-lite': 'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite': 'gemini-3.5-flash-lite',
};

/** Coerce any stored/legacy model string to a supported ModelPreference. */
export function normalizeModel(model?: string | null): ModelPreference {
  if (model && model in MODEL_OPTIONS) return model as ModelPreference;
  if (model && LEGACY_MODEL_MAP[model]) return LEGACY_MODEL_MAP[model];
  return DEFAULT_MODEL;
}

export interface PlanEntity {
  plan_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  author: string;
  tags: string[];
  steps: PlanStep[];
  context_files: string[];
  ai_docs: AIDoc[];
  estimated_cost: number;
  estimated_duration: number;
  success_criteria: string[];
}