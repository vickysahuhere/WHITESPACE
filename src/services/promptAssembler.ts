import { Space, Member } from '../types';

export interface PromptSection {
  title: string;
  tokens: number;
  chars: number;
  content: string;
}

export interface PromptBreakdown {
  totalEstimatedTokens: number;
  totalChars: number;
  sections: PromptSection[];
  fullPrompt: string;
}

export function assembleSystemPrompt(options: {
  space: Space;
  member: Member;
  ragContext?: string;
}): string {
  const { space, member, ragContext } = options;

  const sections: string[] = [];

  // Section 1: Space Master Directives
  sections.push(
    `### 01 // SPACE MASTER DIRECTIVES: ${space.name.toUpperCase()} [${space.badge}]\n` +
    (space.soulMd && space.soulMd.trim() 
      ? space.soulMd.trim() 
      : 'No custom space soul prompt defined. Operate with standard autonomous workspace discipline.')
  );

  // Section 2: Active White Collar Persona & Environment
  sections.push(
    `### 02 // ACTIVE WHITE COLLAR PROFILE\n` +
    `- Name: ${member.name} [${member.badge}]\n` +
    `- Engineering Role: ${member.role}\n` +
    `- Hardware & Local Stack: ${member.hardware || 'Windows PC // Standard Runtime'}\n` +
    `- Personal System Instructions: ${member.instructions || 'Execute directives with precision.'}`
  );

  // Section 3: Grounded Space Knowledge (Local RAG)
  if (ragContext && ragContext.trim()) {
    sections.push(
      `### 03 // RETRIEVED WORKSPACE KNOWLEDGE (LOCAL RAG)\n` +
      ragContext.trim()
    );
  }

  // Section 4: Strict Behavioral Rules
  sections.push(
    `### 04 // OPERATIONAL CONSTRAINTS (STRICT MONOCHROME DISCIPLINE)\n` +
    `1. ZERO EMOJIS: Never use a single emoji anywhere in responses, code comments, or badges.\n` +
    `2. Code Output: Return clean, production-grade, end-to-end functional code without placeholders or stubbed handlers.\n` +
    `3. Style: Direct, concise, technical, and formatted in clean markdown.`
  );

  return sections.join('\n\n---\n\n');
}

export function inspectPromptBreakdown(options: {
  space: Space;
  member: Member;
  ragContext?: string;
}): PromptBreakdown {
  const fullPrompt = assembleSystemPrompt(options);

  const estimateTokens = (text: string) => Math.ceil(text.trim().split(/\s+/).filter(Boolean).length * 1.3);

  const sec1Text = options.space.soulMd || '';
  const sec2Text = `${options.member.name} ${options.member.role} ${options.member.hardware} ${options.member.instructions}`;
  const sec3Text = options.ragContext || 'No RAG chunks injected.';
  const sec4Text = 'Operational constraints and zero emoji enforcement.';

  const sections: PromptSection[] = [
    {
      title: `SPACE SOUL.MD // ${options.space.name}`,
      chars: sec1Text.length,
      tokens: estimateTokens(sec1Text),
      content: sec1Text
    },
    {
      title: `MEMBER PROFILE // ${options.member.name} (${options.member.badge})`,
      chars: sec2Text.length,
      tokens: estimateTokens(sec2Text),
      content: sec2Text
    },
    {
      title: `LOCAL RAG CONTEXT`,
      chars: sec3Text.length,
      tokens: estimateTokens(sec3Text),
      content: sec3Text
    },
    {
      title: `SYSTEM RULES & ZERO EMOJI DISCIPLINE`,
      chars: sec4Text.length,
      tokens: estimateTokens(sec4Text),
      content: sec4Text
    }
  ];

  return {
    totalEstimatedTokens: estimateTokens(fullPrompt),
    totalChars: fullPrompt.length,
    sections,
    fullPrompt
  };
}
