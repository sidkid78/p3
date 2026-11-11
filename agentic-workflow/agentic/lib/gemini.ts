/**
 * Google Gemini API Integration
 * Uses the Interactions API (`client.interactions.create`) from @google/genai >= 2.x.
 */

import { GoogleGenAI, type Interactions } from '@google/genai';
import { DEFAULT_MODEL, MODEL_OPTIONS, normalizeModel, type ModelPreference } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY not found. AI features will be disabled.');
}

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

export type Interaction = Interactions.Interaction;
export type InteractionTool = Interactions.Tool;
export type GenerationConfig = Interactions.GenerationConfig;
export type InteractionInput = Interactions.InteractionCreateParamsNonStreaming['input'];

/**
 * Per-model generation config. Gemini 3.x models ignore temperature/top_p/top_k;
 * reasoning effort is controlled with thinking_level instead.
 */
export const MODEL_CONFIGS: Record<ModelPreference, GenerationConfig> = {
  'gemini-3.1-pro-preview': { max_output_tokens: 16384, thinking_level: 'high' },
  'gemini-3.8-flash': { max_output_tokens: 16384, thinking_level: 'medium' },
  'gemini-3.5-flash-lite': { max_output_tokens: 8192, thinking_level: 'minimal' },
};

/** Pricing per 1M tokens (USD), sourced from MODEL_OPTIONS. */
export const MODEL_PRICING_PER_1M: Record<string, { input: number; output: number }> = Object.fromEntries(
  Object.entries(MODEL_OPTIONS).map(([id, opt]) => [id, opt.pricing])
);

export function getPricing(model: string) {
  return MODEL_PRICING_PER_1M[normalizeModel(model)];
}

/**
 * Get the Gemini AI client
 */
export function getClient() {
  if (!ai) {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY environment variable.');
  }
  return ai;
}

export interface CreateInteractionOptions {
  systemInstruction?: string;
  tools?: InteractionTool[];
  previousInteractionId?: string;
  generationConfig?: GenerationConfig;
  responseFormat?: Interactions.InteractionCreateParamsNonStreaming['response_format'];
}

function buildParams(model: string, input: InteractionInput, opts: CreateInteractionOptions) {
  const resolved = normalizeModel(model);
  return {
    model: resolved,
    input,
    // system_instruction, tools and generation_config are interaction-scoped: send them every turn.
    ...(opts.systemInstruction ? { system_instruction: opts.systemInstruction } : {}),
    ...(opts.tools?.length ? { tools: opts.tools } : {}),
    ...(opts.previousInteractionId ? { previous_interaction_id: opts.previousInteractionId } : {}),
    ...(opts.responseFormat ? { response_format: opts.responseFormat } : {}),
    generation_config: { ...MODEL_CONFIGS[resolved], ...(opts.generationConfig || {}) },
  };
}

/**
 * Create a single (non-streaming) interaction.
 */
export async function createInteraction(
  model: string,
  input: InteractionInput,
  opts: CreateInteractionOptions = {}
): Promise<Interaction> {
  try {
    return await getClient().interactions.create(buildParams(model, input, opts));
  } catch (error) {
    console.error('Gemini interaction error:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate plain text (convenience wrapper).
 */
export async function generateText(
  model: ModelPreference,
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const interaction = await createInteraction(model, prompt, { systemInstruction });
  return interaction.output_text ?? '';
}

/**
 * Stream text deltas from an interaction.
 */
export async function* generateContentStream(
  model: ModelPreference,
  prompt: InteractionInput,
  systemInstruction?: string,
  opts: Omit<CreateInteractionOptions, 'systemInstruction'> = {}
): AsyncGenerator<string> {
  try {
    const stream = await getClient().interactions.create({
      ...buildParams(model, prompt, { ...opts, systemInstruction }),
      stream: true,
    });
    for await (const event of stream) {
      if (event.event_type === 'step.delta' && event.delta.type === 'text') {
        yield event.delta.text;
      } else if (event.event_type === 'error') {
        throw new Error(event.error?.message || 'Stream error');
      }
    }
  } catch (error) {
    console.error('Gemini streaming error:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Token usage + USD cost of an interaction.
 */
export function usageAndCost(model: string, interaction: Pick<Interaction, 'usage'>) {
  const inputTokens = interaction.usage?.total_input_tokens ?? 0;
  const outputTokens =
    (interaction.usage?.total_output_tokens ?? 0) + (interaction.usage?.total_thought_tokens ?? 0);
  const pricing = getPricing(model);
  const costUsd = (inputTokens / 1_000_000) * pricing.input + (outputTokens / 1_000_000) * pricing.output;
  return { inputTokens, outputTokens, costUsd };
}

/**
 * Estimate token usage and cost for a prompt (input-side only).
 */
export async function estimateInputTokensAndCost(
  model: ModelPreference,
  prompt: string,
  systemInstruction?: string
): Promise<{ inputTokens: number; estimatedInputCostUsd: number }> {
  const mergedText = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;
  try {
    const resp = await getClient().models.countTokens({ model: normalizeModel(model), contents: mergedText });
    const inputTokens = resp.totalTokens ?? 0;
    return { inputTokens, estimatedInputCostUsd: (inputTokens / 1_000_000) * getPricing(model).input };
  } catch {
    return { inputTokens: 0, estimatedInputCostUsd: 0 };
  }
}

/**
 * Validate API key by making a minimal request.
 */
export async function validateApiKey(): Promise<boolean> {
  if (!ai) return false;
  try {
    // Any successful response (even one truncated by max_output_tokens) proves the key works.
    await ai.interactions.create({
      model: 'gemini-3.5-flash-lite',
      input: 'Hello',
      store: false,
      generation_config: { max_output_tokens: 16 },
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if Gemini is configured
 */
export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY;
}

export { DEFAULT_MODEL };
