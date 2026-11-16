<!-- GSD:project-start source:PROJECT.md -->

## Project

**White Collars (WHITESPACE) // Autonomous Workspace OS**

White Collars (WHITESPACE) is a high-speed, production-grade AI Workspace and Native Desktop Application engineered for White Collars (WHITERs). It combines structural paradigms from Discord (vertical space rail, stage/voice channels, persistent audio pod), Notion 3.0 (slash-command live Markdown document editor, space page tree), and OpenClaw (Kanban task pipeline with 1-click Dispatch AI copilot). It functions seamlessly both as a rich PC web application and as an uncompressed, frameless Electron native Windows application (.exe).

**Core Value:** An uncompromised, zero-latency unified workspace that gives every team member isolated personal AI chat sessions, sub-millisecond local RAG over space knowledge, an integrated multi-tab developer browser with selective team sharing, and studio-grade WebRTC audio/video calling—all styled in a strict black-and-white monochrome aesthetic with zero emojis.

### Constraints

- **Design**: Strict monochrome `#000000`, `#0A0A0A`–`#171717`, `#262626`–`#404040`, `#FFFFFF`. Zero emojis. Geometric typographic badges and clean inline SVGs only.
- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS with Lucide-style monochrome SVG icons.
- **Desktop Runtime**: Electron 34+ with Node integration / context isolation preload and security headers stripped for developer web viewing.
- **Web Audio/RTC**: Web Audio API `AudioContext` with `AnalyserNode`, `GainNode`, and Opus SDP manipulation.
- **Cloud Backend**: Firebase Spark free tier (Firestore + Firebase Auth + Hosting).

<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->

## Technology Stack

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React + TypeScript | 19.x / 5.7+ | Core UI & state layer | Robust component isolation for complex UI primitives (Kanban, Vector Board, Document Editor, WebRTC Pod) with type safety |
| Vite | 6.x | Bundler & Dev Server | Sub-100ms HMR, instant cold start, clean dual-target builds for both web deployment and Electron desktop bundling |
| Tailwind CSS | 4.x / 3.4+ | Styling engine | Atomic CSS ensuring strict monochrome color palette discipline (`#000000`, `#0A0A0A`, `#171717`, `#262626`, `#FFFFFF`) with zero runtime overhead |
| Web Audio API | Native Standard | Audio processing & FFT | Zero-latency 48 kHz hardware audio pipeline, 0–200% GainNode boost, live frequency spectrum visualization on HTML5 Canvas |
| WebRTC + BroadcastChannel | Native Standard | Voice/Video/Screen stage | Direct peer mesh with SDP Opus override (`510 kbps stereo`), 60fps screen share, and instant tab-to-tab BroadcastChannel signaling without server latency |
| Three.js | 0.170+ | 3D Reactive Assistant (`WHITE`) | Clean WebGL rendering of monochrome geometric wireframe sphere and sculpted "W" with live audio-reactive vertex displacement |
| Electron | 34.x | Windows Desktop Wrapper | Seamless framing, native `.exe` packaging, automatic audio/video permission granting, and session-level HTTP header stripping (`X-Frame-Options`, CSP) |
| Google Gemini API REST | v1beta | AI intelligence & reasoning | Direct client-side fetch calls to `generativelanguage.googleapis.com` supporting Gemini 2.5/3.x models, custom system prompts, and live model discovery |
| Cloud Firestore | 11.x (Firebase JS SDK) | Cloud state synchronization | Free Spark tier real-time listeners for Spaces, shared tabs, tasks, and isolated user chat rooms with offline cache |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Lucide React | 1.x / Latest | Geometric monochrome icons | Inline crisp SVG icons (zero emojis) across toolbar, navigation, and badges |
| Canvas / HTML5 2D Context | Native Standard | Vector Architecture Board & Audio Visualizer | High-frequency rendering (60fps) of draggable nodes, connecting paths, and FFT spectrum bars |
| Hoppscotch / Fetch Client | Native Standard | Built-in REST API tester | Testing developer endpoints with GET/POST and inspecting JSON payloads |
| Python 3 (Bridge Script) | 3.10+ | Local PC AI integration (`wc_bridge.py`) | Allows local agent tools (Google Antigravity, Cursor, CLI) to pull live workspace state into local folders |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| electron-builder | Desktop application packaging | Compiles standalone portable `WhiteCollarsOS.exe` and Windows installer with x64 optimizations |
| Concurrently / Cross-env | Multi-process development | Runs Vite dev server and Electron desktop window concurrently during development |

## Installation

# Core Application

# Type Definitions & Dev Tools

# Desktop Runtime & Packaging

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| WebRTC Mesh + BroadcastChannel | LiveKit / Janus Media Server | Use when voice stages scale past 50+ simultaneous active video speakers. Mesh is ideal for core collaborative teams (4–10 WHITERs) without server costs. |
| In-Memory Inverted Token Index | ChromaDB / Pinecone / pgvector | Use external vector DBs when document corpus exceeds 100,000 files. In-memory index yields `< 1 ms` retrieval with zero external dependencies. |
| Direct Gemini REST Client | LangChain / LlamaIndex | Use frameworks when chaining 10+ opaque multi-agent tools. Direct REST gives complete control over prompt injection, token budgeting, and system instructions. |
| Electron | Tauri (Rust) | Tauri has smaller binary sizes, but Electron is required for stripping `X-Frame-Options` and CSP headers to embed arbitrary external websites cleanly inside OSS Browser tabs. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Emojis in UI or AI responses | Violates strict White Collars monochrome aesthetic and professional discipline | Crisp geometric inline SVGs and alphanumeric badges (`WC`, `SB`, `MR`, `P0`, `P1`) |
| Heavy external CSS UI component libraries (MUI, AntD, Chakra) | Bloats bundle, brings conflicting light/colorful design systems, hurts sub-millisecond responsiveness | Clean Tailwind CSS monochrome design tokens and custom primitives |
| Server-dependent RAG backends | Adds deployment friction, network hops, and operational cost | Instant in-memory client-side tokenizer and cosine/BM25 ranker |
| Third-party analytics or tracker scripts | Violates privacy and slows down performance | Zero telemetry, client-side audit logs |

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| React@19.x | Vite@6.x | Compatible via `@vitejs/plugin-react` |
| Electron@34.x | Node@20+ | Requires `contextIsolation: true`, `preload.js` bridge for IPC |
| Three@0.170+ | React@19.x | Standard `useRef` lifecycle and requestAnimationFrame loops |

## Sources

- Google Gemini REST API v1beta Documentation
- WebRTC 1.0 Opus Audio Codec Specification (RFC 7587)
- Electron WebRequest API & Session Security Documentation
- W3C Web Audio API (AudioContext & AnalyserNode)

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.agents/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-fast` for a trivial task inline, with no subagents and no PLAN.md
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
