# Architecture Research

**Domain:** Autonomous AI Workspace OS & Native Desktop Application
**Researched:** 2026-11-16
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               Presentation Layer (Monochrome UI)                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌────────────────────────────────────────────────┐  ┌─────────────┐ │
│  │ Discord Rail │  │ Main Viewport Switcher                         │  │ OpenClaw    │ │
│  │ - Spaces     │  │ ├─ Notion 3.0 Doc Editor (/H2, /TODO, /CODE)   │  │ AI Copilot  │ │
│  │ - Voice Pod  │  │ ├─ OpenClaw 3-Col Kanban (DISPATCH AI)         │  │ & Task      │ │
│  │ - 3D White   │  │ ├─ Multi-Tab OSS Browser (Private / Shared)    │  │ Execution   │ │
│  │ - Member Pod │  │ ├─ GitHub OSS / Sandbox / Vector / REST Tester │  │ Drawer      │ │
│  │ - CTRL+K     │  │ └─ WebRTC Uncompressed Stage (4K60 / 510kbps)  │  │             │ │
│  └──────┬───────┘  └───────────────────────┬────────────────────────┘  └──────┬──────┘ │
│         │                                  │                                  │        │
├─────────┴──────────────────────────────────┴──────────────────────────────────┴────────┤
│                           Core Application & State Layer                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │ In-Memory RAG Engine    │  │ User Isolation Store    │  │ Web Audio & WebRTC Mesh │ │
│  │ - Sub-ms token index    │  │ - chatsByUser[userId]   │  │ - 48kHz GainNode Boost  │ │
│  │ - Space Docs + SOUL.MD  │  │ - Personal AI Profile   │  │ - FFT Spectrum Analyzer │ │
│  │ - Tasks + Shared Tabs   │  │ - 4 Core Team Slots     │  │ - 510kbps Opus Stereo   │ │
│  └────────────┬────────────┘  └────────────┬────────────┘  └────────────┬────────────┘ │
│               │                            │                            │              │
├───────────────┴────────────────────────────┴────────────────────────────┴──────────────┤
│                         Integration & Cloud Sync Layer                                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  ┌─────────────────────────────────────────┐ │
│  │ Google Gemini REST API Client        │  │ Firebase Spark Backend                  │ │
│  │ - Model Discovery & Live Test        │  │ - Cloud Firestore Realtime Sync         │ │
│  │ - System Prompt: SOUL.MD + Profile   │  │ - Invite-only Authentication            │ │
│  │ - Local RAG Context Injection        │  │ - JSON Backup / Restore                 │ │
│  └──────────────────────────────────────┘  └─────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                    Desktop Runtime & Local PC Bridge Layer                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  ┌─────────────────────────────────────────┐ │
│  │ Electron 34+ Desktop Shell           │  │ Antigravity & Local PC Bridge           │ │
│  │ - Frame Header Stripper (CSP / XFO)  │  │ - One-click context.md Exporter         │ │
│  │ - Zero-Copy GPU & 60fps Flags        │  │ - Auto-generated wc_bridge.py           │ │
│  │ - Portable Windows WhiteCollarsOS.exe│  │ - Local Folder Sync for AI Tools        │ │
│  └──────────────────────────────────────┘  └─────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Space Manager | Manages independent project spaces (*White Collars Core*, *SignBridge*, *Mai-Reads*), tracks metadata and active space | React state with localStorage persistence + optional Firestore sync |
| Notion Doc Editor | Multi-format file ingestion and distraction-free live editing with slash commands (`/H2`, `/TODO`, `/CODE`, `/TABLE`, `/AI-SYNTHESIZE`) | Custom block/line editor with Markdown shortcuts and syntax highlighting |
| In-Memory Local RAG | Ingests all active space documents, `SOUL.MD`, OpenClaw tasks, and shared browser tabs into tokenized chunks; performs similarity search in `< 1 ms` | Inverted index + TF-IDF/cosine similarity in Web Worker or memory cache |
| User Session Switcher | Switches between `Vicky Sahu`, `Arnav Suryavanshi`, `Lakshay Arora`, `Shiwant Goyal` and dynamically added members; enforces isolated chat logs | State keyed by `userId` and `spaceId` (`chatsByUser[userId][spaceId]`) |
| 3D Assistant (`WHITE`) | Renders monochrome audio-reactive geometric sphere / sculpted "W" wireframe | Three.js WebGL canvas reading FFT frequency data from `AnalyserNode` |
| OSS Multi-Tab Browser | Manages personal tabs with `PRIVATE` vs. `SHARED` privacy toggles; renders dev tools (GitHub, Sandbox, Vector Board, REST client, Web Viewport) | Tab manager state machine with iframe renderer, local storage, and BroadcastChannel sync |
| WebRTC Stage Engine | Direct uncompressed peer voice, video, and screen calling (48 kHz 510 kbps Opus, 4K60 video, hardware GainNode boost) | `RTCPeerConnection` with SDP mutator (`setLocalDescription`/`setRemoteDescription` rewrite) and `BroadcastChannel`/Firestore signaling |
| OpenClaw Mission Control | 3-column Kanban pipeline with drag-and-drop, priority tagging, and one-click `DISPATCH AI` into Copilot drawer | React state pipeline with card dispatch to Gemini API Copilot |
| Gemini REST Client | Communicates with Google Gemini API directly from client, discovers models, injects `SOUL.MD` + Personal Profile + RAG chunks | Native `fetch` with streaming response handler and fallback local engine |
| Electron Shell & Stripper | Strips `X-Frame-Options` and CSP headers, auto-grants media permissions, provides frameless native window | Electron `session.defaultSession.webRequest.onHeadersReceived` in `main.js` |
| Antigravity Bridge | Exports workspace state and generates `wc_bridge.py` script | Dynamic file generator producing valid Python 3 script connecting to Firestore REST |

## Recommended Project Structure

```
whitespace/
├── .planning/                  # GSD planning directory
│   ├── PROJECT.md
│   ├── config.json
│   ├── research/
│   ├── REQUIREMENTS.md
│   ├── ROADMAP.md
│   └── STATE.md
├── electron/                   # Electron desktop application runtime
│   ├── main.cjs                # Main process (frameless window, CSP stripper, IPC)
│   └── preload.cjs             # Preload script (safe desktop bridges)
├── public/                     # Static assets & web manifest
├── src/                        # Core application source
│   ├── components/             # UI components
│   │   ├── layout/             # DiscordRail, TopBar, NotionSidebar, AudioPod, WhiteSphere
│   │   ├── editor/             # NotionEditor, SlashMenu, MarkdownViewer
│   │   ├── kanban/             # OpenClawKanban, TaskCard, DispatchModal
│   │   ├── browser/            # BrowserStrip, GitHubExplorer, CodeSandbox, VectorBoard, RestTester, WebViewport
│   │   ├── webrtc/             # StageOverlay, VideoGrid, AudioVisualizerCanvas, HardwareSettings
│   │   ├── copilot/            # CopilotDrawer, ChatMessageList, RAGContextViewer
│   │   ├── spaces/             # SpaceSwitcherModal, SoulMdEditor
│   │   └── common/             # CommandPalette (CTRL+K), Badges, Buttons, MonochromeIcons
│   ├── hooks/                  # Custom React hooks (useAudioPod, useWebRTC, useLocalRAG, useGemini)
│   ├── services/               # Core services
│   │   ├── gemini.ts           # Direct Gemini REST client & model discovery
│   │   ├── rag.ts              # In-memory sub-millisecond RAG indexer & ranker
│   │   ├── audio.ts            # Web Audio API context, GainNode boost, AnalyserNode
│   │   ├── webrtc.ts           # RTCPeerConnection manager & Opus SDP mutator
│   │   ├── firebase.ts         # Optional Cloud Firestore sync & auth
│   │   └── bridge.ts           # context.md bundle exporter & wc_bridge.py generator
│   ├── types/                  # TypeScript interfaces (Space, Document, Task, Tab, User, Message)
│   ├── App.tsx                 # Root application component & layout wiring
│   ├── main.tsx                # React DOM entry point
│   └── index.css               # Monochrome Tailwind CSS tokens & styling
├── LAUNCH_WINDOWS_APP.bat      # Native Windows application launcher
├── BUILD_EXE_INSTALLER.bat     # Standalone .exe installer builder
├── launch_fedora.sh            # Fedora Linux launcher
├── package.json                # Project dependencies & build scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite bundler configuration
└── GEMINI.md                   # Project instruction file
```

### Structure Rationale

- **`electron/` isolated from `src/`:** Allows the web version to be built and hosted anywhere (e.g., Firebase Hosting or any static server) while Electron shares the exact same `dist/` bundle.
- **`services/` modularity:** Isolates hardware audio manipulation (`audio.ts`), WebRTC SDP overrides (`webrtc.ts`), and Gemini API calls (`gemini.ts`) for clean unit testing and easy maintenance.
- **`components/browser/` sub-tools:** Keeps developer tools (GitHub Explorer, Sandbox, Vector Board, REST Tester) self-contained as first-class browser tab viewports.

---
*Architecture research for: White Collars (WHITESPACE) // Autonomous Workspace OS*
*Researched: 2026-11-16*
