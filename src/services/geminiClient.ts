/**
 * Direct Client-Side Google Gemini REST API v1beta Client
 * Connects directly to generativelanguage.googleapis.com
 * Supports live model discovery, active model selection, and token estimation.
 */

export interface GeminiModelInfo {
  name: string;
  id: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  supportedGenerationMethods: string[];
}

const ACTIVE_MODEL_STORAGE_KEY = 'whitespace_active_gemini_model';

export const CURATED_FALLBACK_MODELS: GeminiModelInfo[] = [
  {
    name: 'models/gemini-3.1-flash-lite',
    id: 'gemini-3.1-flash-lite',
    displayName: 'Gemini 3.1 Flash Lite',
    description: 'Sub-second high-velocity multimodal reasoning optimized for workspace intelligence.',
    inputTokenLimit: 1048576,
    outputTokenLimit: 8192,
    supportedGenerationMethods: ['generateContent', 'countTokens']
  },
  {
    name: 'models/gemini-3.5-flash-lite',
    id: 'gemini-3.5-flash-lite',
    displayName: 'Gemini 3.5 Flash Lite',
    description: 'Ultra-fast next-gen lightweight Gemini model with enhanced accuracy and instant response.',
    inputTokenLimit: 1048576,
    outputTokenLimit: 8192,
    supportedGenerationMethods: ['generateContent', 'countTokens']
  },
  {
    name: 'models/gemini-3.8-flash',
    id: 'gemini-3.8-flash',
    displayName: 'Gemini 3.8 Flash',
    description: 'Next-generation reasoning model engineered for deep architectural synthesis.',
    inputTokenLimit: 2097152,
    outputTokenLimit: 8192,
    supportedGenerationMethods: ['generateContent', 'countTokens']
  },
  {
    name: 'models/gemini-flash-latest',
    id: 'gemini-flash-latest',
    displayName: 'Gemini Flash Latest',
    description: 'General-purpose high-throughput Gemini model for multi-space dispatching.',
    inputTokenLimit: 1048576,
    outputTokenLimit: 8192,
    supportedGenerationMethods: ['generateContent', 'countTokens']
  }
];

export class GeminiClient {
  private static instance: GeminiClient;

  private constructor() {}

  public static getInstance(): GeminiClient {
    if (!GeminiClient.instance) {
      GeminiClient.instance = new GeminiClient();
    }
    return GeminiClient.instance;
  }

  public getActiveModel(): string {
    try {
      const saved = localStorage.getItem(ACTIVE_MODEL_STORAGE_KEY);
      if (saved && saved !== 'gemini-2.5-flash' && saved !== 'gemini-2.5-pro') {
        return saved;
      }
      return 'gemini-3.1-flash-lite';
    } catch {
      return 'gemini-3.1-flash-lite';
    }
  }

  public setActiveModel(modelId: string): void {
    try {
      localStorage.setItem(ACTIVE_MODEL_STORAGE_KEY, modelId);
    } catch {
      // ignore
    }
  }

  /**
   * Discovers available models from the linked Gemini API key.
   */
  public async listModels(apiKey: string): Promise<GeminiModelInfo[]> {
    if (!apiKey || apiKey.trim().length < 6) {
      return CURATED_FALLBACK_MODELS;
    }

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`);
      if (!res.ok) {
        throw new Error(`Gemini API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      if (Array.isArray(data.models)) {
        const models: GeminiModelInfo[] = data.models
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => ({
            name: m.name,
            id: m.name.replace(/^models\//, ''),
            displayName: m.displayName || m.name,
            description: m.description || 'Google Gemini Foundation Model',
            inputTokenLimit: m.inputTokenLimit || 1048576,
            outputTokenLimit: m.outputTokenLimit || 8192,
            supportedGenerationMethods: m.supportedGenerationMethods || ['generateContent']
          }));

        if (models.length > 0) return models;
      }
    } catch (err) {
      console.warn('Live Gemini model discovery failed, using curated model directory:', err);
    }

    return CURATED_FALLBACK_MODELS;
  }

  /**
   * Executes a direct generateContent REST call with intelligent model fallback.
   */
  public async generateContent(
    apiKey: string,
    modelId: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    const candidateModels = [
      modelId.replace(/^models\//, ''),
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash'
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);

    let lastError: Error | null = null;

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

        const body = {
          contents: [
            {
              role: 'user',
              parts: [
                { text: `SYSTEM DIRECTIVES:\n${systemPrompt}\n\nUSER INSTRUCTION:\n${userPrompt}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048
          }
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return text;
          }
        } else {
          const errText = await res.text();
          lastError = new Error(`Gemini REST error (${res.status} on ${model}): ${errText}`);
          // If model is not found (404) or busy (503), try next fallback model
          if (res.status === 404 || res.status === 503) {
            continue;
          }
          throw lastError;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error('Failed to generate response across all models.');
  }

  /**
   * Heuristic token estimation (~4 characters per token).
   */
  public estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }
}

export const geminiClient = GeminiClient.getInstance();
