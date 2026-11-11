/**
 * Gemini File API + multimodal generation via the Interactions API.
 * Upload files (images, video, audio, PDFs, documents), then reference them
 * as typed content parts in `client.interactions.create({ input: [...] })`.
 */

import { FileState, type File as GeminiFile } from '@google/genai';
import path from 'path';
import {
  createInteraction,
  generateContentStream,
  getClient,
  type CreateInteractionOptions,
  type Interaction,
  type InteractionInput,
} from '@/lib/gemini';
import type { ModelPreference } from '@/types';

/**
 * Upload a file to Gemini's File API and wait until it is ACTIVE.
 */
export async function uploadFile(filePath: string, displayName?: string): Promise<GeminiFile> {
  const client = getClient();
  try {
    const uploaded = await client.files.upload({
      file: filePath,
      config: { displayName: displayName || path.basename(filePath), mimeType: getMimeType(filePath) },
    });
    if (!uploaded.name) throw new Error('Upload returned no file name');

    let file = await client.files.get({ name: uploaded.name });
    while (file.state === FileState.PROCESSING) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      file = await client.files.get({ name: uploaded.name });
    }
    if (file.state === FileState.FAILED) {
      throw new Error(`File processing failed: ${file.name}`);
    }
    return file;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/** Upload multiple files in parallel. */
export async function uploadFiles(filePaths: string[]): Promise<GeminiFile[]> {
  return Promise.all(filePaths.map((filePath) => uploadFile(filePath)));
}

/** Delete an uploaded file (files auto-expire after 48 hours otherwise). */
export async function deleteFile(fileName: string): Promise<void> {
  try {
    await getClient().files.delete({ name: fileName });
  } catch (error) {
    console.error('File deletion error:', error);
  }
}

/** List all uploaded files. */
export async function listUploadedFiles(): Promise<GeminiFile[]> {
  try {
    const files: GeminiFile[] = [];
    for await (const file of await getClient().files.list()) {
      files.push(file);
    }
    return files;
  } catch (error) {
    console.error('List files error:', error);
    return [];
  }
}

/**
 * Build Interactions API input: one typed content part per file, then the text prompt.
 */
export function buildFileInput(prompt: string, files: GeminiFile[]): InteractionInput {
  const parts = files.map((file) => {
    const mime = file.mimeType || 'application/octet-stream';
    const type = mime.startsWith('image/')
      ? 'image'
      : mime.startsWith('audio/')
        ? 'audio'
        : mime.startsWith('video/')
          ? 'video'
          : 'document';
    return { type, uri: file.uri, mime_type: mime };
  });
  return [...parts, { type: 'text', text: prompt }] as InteractionInput;
}

/**
 * Generate a response grounded in uploaded files.
 */
export async function generateContentWithFiles(
  model: ModelPreference,
  prompt: string,
  files: GeminiFile[],
  systemInstruction?: string,
  opts: Omit<CreateInteractionOptions, 'systemInstruction'> = {}
): Promise<Interaction> {
  return createInteraction(model, buildFileInput(prompt, files), { ...opts, systemInstruction });
}

/**
 * Streaming version: yields text deltas.
 */
export async function* generateContentStreamWithFiles(
  model: ModelPreference,
  prompt: string,
  files: GeminiFile[],
  systemInstruction?: string,
  opts: Omit<CreateInteractionOptions, 'systemInstruction'> = {}
): AsyncGenerator<string> {
  yield* generateContentStream(model, buildFileInput(prompt, files), systemInstruction, opts);
}

/**
 * Convenience: upload files, generate, then (optionally) delete the uploads.
 */
export async function generateContentFromFilePaths(
  model: ModelPreference,
  prompt: string,
  filePaths: string[],
  systemInstruction?: string,
  opts: Omit<CreateInteractionOptions, 'systemInstruction'> = {},
  cleanupAfter = true
): Promise<Interaction> {
  const uploadedFiles = await uploadFiles(filePaths);
  try {
    return await generateContentWithFiles(model, prompt, uploadedFiles, systemInstruction, opts);
  } finally {
    if (cleanupAfter) {
      await Promise.all(uploadedFiles.map((file) => (file.name ? deleteFile(file.name) : undefined)));
    }
  }
}

/** Check if a file extension is supported by Gemini. */
export function isSupportedFileType(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  const supportedExtensions = [
    // Images
    '.png', '.jpg', '.jpeg', '.webp', '.heic', '.heif',
    // Video
    '.mp4', '.mpeg', '.mov', '.avi', '.flv', '.mpg', '.webm', '.wmv', '.3gp',
    // Audio
    '.mp3', '.wav', '.aiff', '.aac', '.ogg', '.flac',
    // Documents
    '.pdf', '.txt', '.html', '.css', '.js', '.ts', '.py', '.java', '.c', '.cpp',
    '.md', '.csv', '.xml', '.rtf',
  ];
  return supportedExtensions.includes(ext);
}

/** Get MIME type from file path. */
export function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    // Images
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.heic': 'image/heic',
    '.heif': 'image/heif',
    // Video
    '.mp4': 'video/mp4',
    '.mpeg': 'video/mpeg',
    '.mov': 'video/mov',
    '.avi': 'video/avi',
    '.webm': 'video/webm',
    // Audio
    '.mp3': 'audio/mp3',
    '.wav': 'audio/wav',
    '.aac': 'audio/aac',
    '.ogg': 'audio/ogg',
    // Documents
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.ts': 'application/typescript',
    '.py': 'text/x-python',
    '.md': 'text/markdown',
    '.csv': 'text/csv',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}
