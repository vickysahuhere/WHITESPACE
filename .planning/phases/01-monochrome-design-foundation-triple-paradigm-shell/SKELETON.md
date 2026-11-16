# Walking Skeleton — White Collars (WHITESPACE) // Autonomous Workspace OS

**Phase:** 1
**Generated:** 2026-11-16

## Capability Proven End-to-End

A White Collar user can launch the workspace, view the strict monochrome Discord rail and Notion tree with zero emojis, input and link their Gemini API key directly from the top bar with persistent local storage verification, toggle the persistent Voice & User Pod, and instantaneously trigger navigation actions via the `CTRL+K` global command palette on both web and native desktop hosts.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Core Framework | React 19 + Vite 6 + TypeScript 5.7+ | Instant HMR (<100ms), robust component isolation for complex UI primitives, and clean dual-target web/desktop builds |
| Styling Engine | Tailwind CSS (Strict Monochrome) | Hard-enforced `#000000`, `#0A0A0A`–`#171717`, `#262626`–`#404040`, `#FFFFFF` color discipline with zero runtime overhead |
| Iconography | Lucide React (Monochrome SVGs) + Geometric Badges | Zero emojis across the entire UI; crisp alphanumeric badges (`WC`, `SB`, `MR`, `P0`) and inline geometric SVGs |
| State Management | React Context + Custom Hooks + LocalStorage | Sub-millisecond reactive state transitions without external state library bloat |
| Desktop Runtime | Electron 34+ (Frameless & CSP Stripped) | Windows portable `.exe` and installer, stripping `X-Frame-Options` and CSP headers for arbitrary website embedding |

## Stack Touched in Phase 1

- [x] Project scaffold (Vite + React 19 + TypeScript + Tailwind CSS + Lucide Icons + Prettier/ESLint configs)
- [x] Core layout & routing (Triple-paradigm Discord rail + Notion sidebar + Top bar + Command palette)
- [x] State persistence (LocalStorage read/write for active space, active member, Gemini key, and layout states)
- [x] UI interaction (Top-bar Gemini key wiring, Voice Pod toggle, Space switcher, and `CTRL+K` keyboard shortcut)
- [x] Local run command (`npm run dev` and `npm run build` validating zero type errors)

## Out of Scope (Deferred to Later Slices)

- Multi-space document CRUD & slash editor (Phase 2)
- In-memory Local RAG indexing (Phase 3)
- Member chat isolation & Three.js 3D assistant (Phase 4)
- Multi-tab browser & selective tab sharing (Phase 5)
- GitHub OSS, Sandbox, Vector Board & REST tester (Phase 6)
- 48 kHz 510 kbps Opus WebRTC stage & hardware audio controls (Phase 7)
- OpenClaw 3-column Kanban & Dispatch AI copilot drawer (Phase 8)
- Cloud Firestore sync & `wc_bridge.py` sync script (Phase 9)
- Electron `.exe` compilation & Windows installer packaging (Phase 10)

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2: Multi-Space Knowledge Base, `SOUL.MD` & Notion-style Live Document Editor
- Phase 3: Sub-Millisecond In-Memory Local RAG Engine
- Phase 4: User Personalization, Chat Isolation & 3D Assistant (`WHITE`)
- Phase 5: Multi-Tab OSS Browser & Selective Tab Sharing
- Phase 6: Built-in Developer Suite (GitHub OSS, Sandbox, Vector Board, REST Tester)
- Phase 7: Uncompressed Studio WebRTC Stage & Hardware Audio Pod
- Phase 8: OpenClaw Mission Control Kanban & Right-Docked AI Copilot
- Phase 9: Google Gemini Direct REST, Firebase Cloud Sync & Antigravity Bridge
- Phase 10: Electron Native Desktop Packaging & Cross-Platform Launchers
