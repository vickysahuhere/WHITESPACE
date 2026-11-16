// White Collars (WHITESPACE) // Strict Monochrome Theme Tokens & Initial Defaults
import { Member, Space } from '../types';

export const THEME = {
  colors: {
    pureBlack: '#000000',
    surfaceDark: '#0A0A0A',
    surfacePanel: '#121212',
    surfaceHover: '#171717',
    borderMuted: '#262626',
    borderBright: '#404040',
    textMuted: '#A3A3A3',
    textBright: '#FFFFFF',
  },
  typography: {
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }
} as const;

export const DEFAULT_MEMBERS: Member[] = [
  {
    id: 'user_vicky',
    name: 'Vicky Sahu',
    badge: 'VS',
    role: 'CORE // ARCHITECT & SYSTEMS LEAD',
    hardware: 'Windows 11 x64 / RTX 4090 / 64GB RAM',
    instructions: 'Focus on low-level performance, zero-latency architectures, and native desktop packaging.'
  },
  {
    id: 'user_arnav',
    name: 'Arnav Suryavanshi',
    badge: 'AS',
    role: 'CORE // AI RESEARCH & RAG INFRA',
    hardware: 'Linux Fedora / A100 Cluster / 128GB RAM',
    instructions: 'Focus on sparse cosine vector ranking, sub-millisecond in-memory indexes, and Gemini reasoning.'
  },
  {
    id: 'user_lakshay',
    name: 'Lakshay Arora',
    badge: 'LA',
    role: 'CORE // REALTIME WEBRTC & AUDIO ENG',
    hardware: 'macOS Sonoma / M3 Max / 64GB RAM',
    instructions: 'Maintain 510kbps Opus stereo fidelity, Web Audio API soft limiters, and 60fps screen streaming.'
  },
  {
    id: 'user_shiwant',
    name: 'Shiwant Goyal',
    badge: 'SG',
    role: 'CORE // FULLSTACK & OPENCLAW COPILOT',
    hardware: 'Windows 11 / i9-14900K / 64GB RAM',
    instructions: 'Streamline 3-column Kanban mission control, task dispatching, and developer tooling.'
  }
];

export const DEFAULT_SPACES: Space[] = [
  {
    id: 'space_wc_core',
    name: 'White Collars Core',
    slug: 'wc-core',
    badge: 'WC',
    description: 'Master autonomous operating system and core infrastructure specifications.',
    soulMd: `# SOUL.MD // WHITE COLLARS CORE
You are WHITE, the autonomous core intelligence for White Collars (WHITERs).
- Maintain strict black-and-white monochrome aesthetic discipline.
- Never use emojis in any responses or code generation.
- Produce production-grade, uncompressed, high-speed architectures with zero stubbed buttons.
- Ground all answers in Space knowledge and active OpenClaw tasks.`,
    createdAt: '2026-11-16T00:00:00.000Z',
    updatedAt: '2026-11-16T00:00:00.000Z'
  },
  {
    id: 'space_signbridge',
    name: 'SignBridge (Sanket)',
    slug: 'signbridge',
    badge: 'SB',
    description: 'Real-time computer vision and multimodal sign language translation engine.',
    soulMd: `# SOUL.MD // SIGNBRIDGE (SANKET)
Domain: Multimodal Vision, Gesture Recognition, and WebRTC streaming.
- Maintain high-frame-rate gesture classification standards.
- Zero emojis. Exact technical precision.`,
    createdAt: '2026-11-16T00:00:00.000Z',
    updatedAt: '2026-11-16T00:00:00.000Z'
  },
  {
    id: 'space_mai_reads',
    name: 'Mai-Reads',
    slug: 'mai-reads',
    badge: 'MR',
    description: 'High-speed technical paper synthesis, semantic book indexing, and document RAG.',
    soulMd: `# SOUL.MD // MAI-READS
Domain: Semantic Document Distillation and Local Knowledge Ingestion.
- Extract concise, dense mathematical and technical summaries.
- Zero emojis. Exact citations and structured markdown only.`,
    createdAt: '2026-11-16T00:00:00.000Z',
    updatedAt: '2026-11-16T00:00:00.000Z'
  }
];
