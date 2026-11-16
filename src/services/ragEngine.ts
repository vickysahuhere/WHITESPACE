import { RAGChunk, RAGSearchResult, RAGMatch, Document, Task, BrowserTab, Space } from '../types';

// Standard English stop words to filter out for cleaner inverted index
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with',
  'you', 'your', 'yours', 'yourself', 'yourselves'
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_\-\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

export function chunkText(text: string, chunkSizeWords = 180, overlapWords = 30): string[] {
  const clean = text.trim();
  if (!clean) return [];

  // Split into paragraphs first to respect semantic structure
  const paragraphs = clean.split(/\n\s*\n/);
  const words: string[] = [];

  for (const para of paragraphs) {
    const paraWords = para.trim().split(/\s+/).filter(Boolean);
    if (paraWords.length > 0) {
      words.push(...paraWords);
      words.push('\n\n'); // paragraph separator marker
    }
  }

  if (words.length <= chunkSizeWords) {
    return [clean];
  }

  const chunks: string[] = [];
  let i = 0;
  const step = Math.max(1, chunkSizeWords - overlapWords);

  while (i < words.length) {
    const chunkWords = words.slice(i, i + chunkSizeWords);
    const chunkStr = chunkWords.join(' ').replace(/\s*\n\n\s*/g, '\n\n').trim();
    if (chunkStr.length > 0) {
      chunks.push(chunkStr);
    }
    i += step;
  }

  return chunks;
}

export class InMemoryRAGEngine {
  private chunks: Map<string, RAGChunk> = new Map();
  // term -> Map<chunkId, termFrequency>
  private invertedIndex: Map<string, Map<string, number>> = new Map();
  // chunkId -> tokenCount
  private docLengths: Map<string, number> = new Map();
  private totalDocLength = 0;

  // BM25 tuning constants
  private readonly k1 = 1.2;
  private readonly b = 0.75;

  public clear(): void {
    this.chunks.clear();
    this.invertedIndex.clear();
    this.docLengths.clear();
    this.totalDocLength = 0;
  }

  public get totalChunks(): number {
    return this.chunks.size;
  }

  public get totalTerms(): number {
    return this.invertedIndex.size;
  }

  public removeSource(sourceId: string): void {
    const chunkIdsToRemove: string[] = [];
    for (const [id, chunk] of this.chunks.entries()) {
      if (chunk.sourceId === sourceId) {
        chunkIdsToRemove.push(id);
      }
    }

    for (const chunkId of chunkIdsToRemove) {
      const length = this.docLengths.get(chunkId) || 0;
      this.totalDocLength -= length;
      this.docLengths.delete(chunkId);
      this.chunks.delete(chunkId);

      // Clean from inverted index
      for (const [term, posting] of this.invertedIndex.entries()) {
        if (posting.has(chunkId)) {
          posting.delete(chunkId);
          if (posting.size === 0) {
            this.invertedIndex.delete(term);
          }
        }
      }
    }
  }

  public indexChunk(chunk: RAGChunk): void {
    // Remove if exists
    if (this.chunks.has(chunk.id)) {
      this.removeChunk(chunk.id);
    }

    const tokens = tokenize(chunk.text);
    const tokenCount = tokens.length;

    this.chunks.set(chunk.id, chunk);
    this.docLengths.set(chunk.id, tokenCount);
    this.totalDocLength += tokenCount;

    // Calculate term frequencies
    const tfMap = new Map<string, number>();
    for (const token of tokens) {
      tfMap.set(token, (tfMap.get(token) || 0) + 1);
    }

    // Populate inverted index
    for (const [token, count] of tfMap.entries()) {
      let postings = this.invertedIndex.get(token);
      if (!postings) {
        postings = new Map();
        this.invertedIndex.set(token, postings);
      }
      postings.set(chunk.id, count);
    }
  }

  private removeChunk(chunkId: string): void {
    const length = this.docLengths.get(chunkId) || 0;
    this.totalDocLength -= length;
    this.docLengths.delete(chunkId);
    this.chunks.delete(chunkId);

    for (const [, postings] of this.invertedIndex.entries()) {
      postings.delete(chunkId);
    }
  }

  public indexDocument(doc: Document): void {
    this.removeSource(doc.id);
    const textPieces = [doc.title, doc.content].filter(Boolean).join('\n\n');
    const chunks = chunkText(textPieces);

    chunks.forEach((chunkText, idx) => {
      const chunk: RAGChunk = {
        id: `chunk-doc-${doc.id}-${idx}`,
        spaceId: doc.spaceId,
        sourceId: doc.id,
        sourceType: 'doc',
        sourceTitle: doc.title,
        text: chunkText,
        tokenCount: tokenize(chunkText).length,
        createdAt: doc.updatedAt || doc.createdAt
      };
      this.indexChunk(chunk);
    });
  }

  public indexSoul(space: Space): void {
    const sourceId = `soul-${space.id}`;
    this.removeSource(sourceId);
    if (!space.soulMd || !space.soulMd.trim()) return;

    const chunks = chunkText(space.soulMd);
    chunks.forEach((chunkText, idx) => {
      const chunk: RAGChunk = {
        id: `chunk-soul-${space.id}-${idx}`,
        spaceId: space.id,
        sourceId,
        sourceType: 'soul',
        sourceTitle: `${space.name} (SOUL.MD)`,
        text: chunkText,
        tokenCount: tokenize(chunkText).length,
        createdAt: space.updatedAt || space.createdAt
      };
      this.indexChunk(chunk);
    });
  }

  public indexTask(task: Task): void {
    this.removeSource(task.id);
    const content = `${task.title}\nPRIORITY: ${task.priority}\nSTATUS: ${task.column}\nSPECIFICATION:\n${task.spec}`;
    const chunks = chunkText(content);

    chunks.forEach((chunkText, idx) => {
      const chunk: RAGChunk = {
        id: `chunk-task-${task.id}-${idx}`,
        spaceId: task.spaceId,
        sourceId: task.id,
        sourceType: 'task',
        sourceTitle: `TASK // ${task.title}`,
        text: chunkText,
        tokenCount: tokenize(chunkText).length,
        createdAt: task.updatedAt || task.createdAt
      };
      this.indexChunk(chunk);
    });
  }

  public indexTab(tab: BrowserTab): void {
    this.removeSource(tab.id);
    if (!tab.isShared) return; // Only shared tabs indexed into space knowledge

    const payload = typeof tab.data === 'string' ? tab.data : JSON.stringify(tab.data || '');
    const content = `SHARED DEV TAB: ${tab.title}\nURL: ${tab.url}\nTYPE: ${tab.type}\nDATA:\n${payload}`;
    const chunks = chunkText(content);

    chunks.forEach((chunkText, idx) => {
      const chunk: RAGChunk = {
        id: `chunk-tab-${tab.id}-${idx}`,
        spaceId: tab.spaceId,
        sourceId: tab.id,
        sourceType: 'tab',
        sourceTitle: `TAB // ${tab.title}`,
        text: chunkText,
        tokenCount: tokenize(chunkText).length,
        createdAt: tab.createdAt
      };
      this.indexChunk(chunk);
    });
  }

  public search(
    queryText: string,
    options: {
      spaceId?: string;
      scope?: 'active' | 'all';
      topK?: number;
      minScore?: number;
    } = {}
  ): RAGSearchResult {
    const startTime = performance.now();
    const { spaceId, scope = 'active', topK = 5, minScore = 0.05 } = options;

    const queryTokens = tokenize(queryText);
    const totalDocs = this.chunks.size;

    if (queryTokens.length === 0 || totalDocs === 0) {
      return {
        query: queryText,
        durationMs: Number((performance.now() - startTime).toFixed(3)),
        totalChunksIndexed: totalDocs,
        scope,
        matches: []
      };
    }

    const avgdl = this.totalDocLength / totalDocs;
    const scores = new Map<string, { score: number; matchedTerms: Set<string> }>();

    for (const term of queryTokens) {
      const postings = this.invertedIndex.get(term);
      if (!postings) continue;

      const docFreq = postings.size;
      // Robertson-Sparck Jones IDF formula with add-1 smoothing
      const idf = Math.log(1 + (totalDocs - docFreq + 0.5) / (docFreq + 0.5));

      for (const [chunkId, tf] of postings.entries()) {
        const chunk = this.chunks.get(chunkId);
        if (!chunk) continue;

        // Apply space filter if scope is 'active'
        if (scope === 'active' && spaceId && chunk.spaceId !== spaceId) {
          continue;
        }

        const docLen = this.docLengths.get(chunkId) || avgdl;
        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / avgdl));
        const termScore = idf * (numerator / denominator);

        let current = scores.get(chunkId);
        if (!current) {
          current = { score: 0, matchedTerms: new Set() };
          scores.set(chunkId, current);
        }
        current.score += termScore;
        current.matchedTerms.add(term);
      }
    }

    // Rank candidate matches
    const candidates = Array.from(scores.entries())
      .map(([chunkId, data]) => ({
        chunk: this.chunks.get(chunkId)!,
        rawScore: data.score,
        matchedTerms: Array.from(data.matchedTerms)
      }))
      .filter(item => item.chunk && item.rawScore > 0);

    candidates.sort((a, b) => b.rawScore - a.rawScore);

    // Normalize top scores to 0.0 - 1.0 range based on max score
    const maxScore = candidates[0]?.rawScore || 1;
    const matches: RAGMatch[] = candidates
      .slice(0, topK)
      .map(item => ({
        chunk: item.chunk,
        score: Math.min(1, Number((item.rawScore / maxScore).toFixed(3))),
        matchedTerms: item.matchedTerms
      }))
      .filter(item => item.score >= minScore);

    const durationMs = Number((performance.now() - startTime).toFixed(3));

    return {
      query: queryText,
      durationMs,
      totalChunksIndexed: totalDocs,
      scope,
      matches
    };
  }
}

// Global Singleton for the in-memory RAG service
export const ragEngine = new InMemoryRAGEngine();
