# Stack Research

**Domain:** Autonomous AI Workspace OS & Native Desktop Application
**Researched:** 2026-11-16
**Confidence:** HIGH

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

```bash
# Core Application
npm install react react-dom lucide-react three firebase

# Type Definitions & Dev Tools
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/three tailwindcss postcss autoprefixer

# Desktop Runtime & Packaging
npm install -D electron electron-builder concurrently wait-on cross-env
```

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

---
*Stack research for: White Collars (WHITESPACE) // Autonomous Workspace OS*
*Researched: 2026-11-16*
