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
    name: 'models/gemini-2.5-flash',
    id: 'gemini-2.5-flash',
    displayName: 'Gemini 2.5 Flash',
    description: 'Next-generation multimodal reasoning optimized for high-speed agentic execution.',
    inputTokenLimit: 1048576,
    outputTokenLimit: 8192,
    supportedGenerationMethods: ['generateContent', 'countTokens']
  },
  {
    name: 'models/gemini-2.5-pro',
    id: 'gemini-2.5-pro',
    displayName: 'Gemini 2.5 Pro',
    description: 'Deep reasoning model engineered for complex architectural synthesis and code generation.',
    inputTokenLimit: 2097152,
    outputTokenLimit: 8192,
    supportedGenerationMethods: ['generateContent', 'countTokens']
  },
  {
    name: 'models/gemini-1.5-flash',
    id: 'gemini-1.5-flash',
    displayName: 'Gemini 1.5 Flash',
    description: 'High-velocity multimodal workhorse model for sub-second responses.',
    inputTokenLimit: 1048576,
    outputTokenLimit: 8192,
    supportedGenerationMethods: ['generateContent', 'countTokens']
  },
  {
    name: 'models/gemini-1.5-pro',
    id: 'gemini-1.5-pro',
    displayName: 'Gemini 1.5 Pro',
    description: 'Foundation model with 2M token context window for large repository ingestion.',
    inputTokenLimit: 2097152,
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
      return localStorage.getItem(ACTIVE_MODEL_STORAGE_KEY) || 'gemini-2.5-flash';
    } catch {
      return 'gemini-2.5-flash';
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
   * Executes a direct generateContent REST call.
   */
  public async generateContent(
    apiKey: string,
    modelId: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    const cleanModel = modelId.replace(/^models\//, '');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey.trim()}`;

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

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini REST error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
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
