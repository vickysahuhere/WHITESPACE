# Project Research Summary

**Project:** White Collars (WHITESPACE) // Autonomous Workspace OS
**Domain:** Autonomous AI Workspace OS & Native Desktop Application
**Researched:** 2026-11-16
**Confidence:** HIGH

## Executive Summary

White Collars (WHITESPACE) is a high-speed, dual-target (Web & Windows Desktop) operating workspace designed specifically for autonomous development teams (WHITERs). It fuses the spatial communication patterns of Discord (space rails, persistent audio pod, stage channels), the flexible documentation power of Notion 3.0 (live slash-command markdown editing, page tree), and the automated pipeline velocity of OpenClaw (3-column Kanban with one-click AI dispatch).

The application is architected around a strict black-and-white monochrome aesthetic (`#000000`, `#0A0A0A`–`#171717`, `#262626`–`#404040`, `#FFFFFF`) with zero emojis anywhere in the system. Performance is paramount: local RAG achieves sub-millisecond retrieval via an incremental in-memory token index; WebRTC audio bypasses compression caps at 510 kbps stereo Opus; and screen sharing operates at 60fps up to 4K resolution.

The recommended delivery path combines Vite + React 19 + TypeScript + Tailwind CSS as the core application layer, packaged with Electron 34+ for Windows native capabilities (stripping external iframe restrictions and providing frameless window rendering), and backed by Google Gemini API REST for intelligence and Firebase Spark tier for collaborative synchronization.

## Key Findings

### Recommended Stack

Vite + React 19 and Tailwind CSS provide the rapid UI reactivity, component isolation, and strict monochrome styling required for high-density tools. Web Audio API and WebRTC enable uncompressed studio sound with live FFT frequency analysis on HTML5 Canvas. Three.js renders the audio-reactive geometric assistant (`WHITE`). Electron 34+ serves as the native wrapper, removing `X-Frame-Options` and CSP headers to allow arbitrary developer documentation to load directly in embedded browser tabs.

**Core technologies:**
- **React 19 + TypeScript + Vite 6**: High-speed component rendering, zero-lag tab switches, and clean dual-target web/desktop builds.
- **Tailwind CSS (Monochrome)**: Enforces `#000000`, `#0A0A0A`, `#171717`, `#262626`, `#FFFFFF` color discipline with crisp typographic and SVG badges.
- **Web Audio API & WebRTC (510 kbps Opus)**: Studio-grade audio pipeline with GainNode boost (0–200%), loopback monitoring, FFT canvas visualizer, and 4K60 screen sharing.
- **Google Gemini REST & Local In-Memory RAG**: Direct client-side intelligence with model discovery and `< 1 ms` similarity search.
- **Electron 34+ & electron-builder**: Frameless desktop window, CSP/XFO header stripping, and one-click `.exe` installer.

### Expected Features

**Must have (table stakes):**
- Strict black-and-white monochrome palette with zero emojis.
- Top-bar Gemini API Key input with instant wiring and model discovery.
- Multi-Space manager with persistent `SOUL.MD` and live Notion-style document editor.
- Multi-member session switcher (`Vicky Sahu`, `Arnav Suryavanshi`, `Lakshay Arora`, `Shiwant Goyal` + add member) with strictly isolated chat logs.
- Multi-tab browser with selective `PRIVATE` vs. `SHARED WITH TEAM` toggles.
- OpenClaw 3-column Kanban pipeline (`01 // QUEUED SPECS`, `02 // ACTIVE AGENT LOOP`, `03 // VERIFIED & SHIPPED`).
- Uncompressed WebRTC Stage (48 kHz 510 kbps Opus, 60fps screen share, BroadcastChannel & SDP signaling).
- Native Windows launchers (`LAUNCH_WINDOWS_APP.bat`, `BUILD_EXE_INSTALLER.bat`, `launch_fedora.sh`).

**Should have (competitive differentiators):**
- Sub-millisecond in-memory Local RAG across active space or all spaces.
- One-click Kanban `DISPATCH AI` into right-docked AI Copilot drawer with RAG context.
- Built-in developer suite: GitHub OSS explorer, Code Sandbox, Vector Board, REST tester, Web Viewport with `INDEX TO SPACE`.
- Reactive 3D geometric assistant (`WHITE`) with Three.js audio responsiveness.
- Google Antigravity & PC Bridge (`context.md` bundle exporter and auto-generated `wc_bridge.py`).

**Defer (v2+):**
- Native mobile builds (iOS/Android) — focus strictly on PC Web & Windows Desktop (.exe).
- Centralized SFU/MCU media servers — peer WebRTC mesh with BroadcastChannel and SDP/Firestore signaling covers core team needs without server costs.

### Architecture Approach

A clean four-tier modular architecture isolates the presentation layer (Discord Rail, Notion Workspace, OpenClaw Kanban, Stage Pod, Copilot) from the state engines (In-Memory RAG, User Partitioning, Web Audio/RTC, Gemini REST). Firebase Spark serves as an asynchronous sync layer with debounced writes to avoid quota exhaustion. Electron intercepts network headers at the session level to unlock external site embedding.

**Major components:**
1. **Monochrome Shell & Navigation**: Discord-style space rail, Notion page tree, bottom-left audio pod, top-bar Gemini key input, and `CTRL+K` palette.
2. **Knowledge Base & In-Memory RAG**: Incremental token index chunking `SOUL.MD`, documents, tasks, and shared tabs for `< 1 ms` retrieval.
3. **Studio WebRTC & Audio Pod**: AudioContext with GainNode boost, compressor limiting, FFT canvas visualizer, and Opus 510 kbps SDP overrides.
4. **Developer Browser Suite**: Multi-tab manager with GitHub OSS search, live code sandbox, vector architecture board, REST client, and web viewport.
5. **OpenClaw Kanban & AI Copilot**: Autonomous task pipeline with one-click dispatch into right-docked Gemini chat drawer.
6. **Desktop Runtime & Local PC Bridge**: Electron wrapper with CSP stripper and auto-generated `wc_bridge.py` for Antigravity integration.

### Critical Pitfalls

1. **External Iframe Framing Rejection (`X-Frame-Options` & CSP)**: Mitigate by stripping response headers in Electron's `session.webRequest.onHeadersReceived`, and providing reader snapshots in browser mode.
2. **WebRTC Opus Stereo Downmixing**: Mitigate by explicitly modifying SDP lines on offer/answer to force `stereo=1;maxaveragebitrate=510000;cbr=1;useinbandfec=1`.
3. **Web Audio Autoplay Suspension & 200% Distortion**: Mitigate by resuming AudioContext on user gesture and inserting a `DynamicsCompressorNode` after the GainNode.
4. **Three.js Background Render Loops**: Mitigate by halting animation frames when the 3D assistant is hidden and calling `.dispose()` on geometries and materials.
5. **RAG Main Thread Blocking**: Mitigate by pre-indexing tokens during ingestion and running sparse vector cosine queries in `< 1 ms`.
6. **Firebase Free Tier Write Exhaustion**: Mitigate by debouncing Firestore writes (1500ms) and using localStorage as primary fast persistence.

## Implications for Roadmap

The user selected **Fine Granularity (8-12 phases)** and **YOLO mode**. To ensure each phase is independently verifiable, robustly tested, and fully functional, we structure the roadmap into 10 cohesive, fine-grained phases:

### Phase 1: Monochrome Design Foundation & Triple-Paradigm Shell
Establish the strict black-and-white theme tokens, Discord space rail, Notion navigation tree, top-bar Gemini key bar, and `CTRL+K` global command palette.

### Phase 2: Multi-Space Knowledge Base, SOUL.MD & Live Document Editor
Implement multi-space CRUD (*White Collars Core*, *SignBridge*, *Mai-Reads*), persistent `SOUL.MD`, multi-format file ingestion, and Notion-style live slash-command markdown editor.

### Phase 3: Sub-Millisecond In-Memory Local RAG Engine
Build the incremental in-memory tokenizer, inverted index, and BM25/cosine similarity retrieval engine operating in `< 1 ms` across active space or all spaces.

### Phase 4: User Personalization, Chat Isolation & 3D Assistant (WHITE)
Implement the 4-member session switcher (`Vicky Sahu`, `Arnav Suryavanshi`, `Lakshay Arora`, `Shiwant Goyal` + add member), strict chat history isolation (`chatsByUser[userId][spaceId]`), personal AI profiles, and the reactive Three.js geometric 3D assistant.

### Phase 5: Multi-Tab OSS Browser & Selective Tab Sharing
Build the personal multi-tab browser with `PRIVATE` vs. `SHARED WITH TEAM` privacy toggles, Team Shared Tabs strip, and embedded web viewport with `INDEX TO SPACE`.

### Phase 6: Built-in Developer Suite (GitHub OSS, Sandbox, Vector Board, REST Tester)
Deliver the 4 integrated developer tools: GitHub repository search with jsDelivr links, monochrome live HTML/CSS/JS sandbox, interactive draggable vector architecture board, and Hoppscotch-lite REST API client.

### Phase 7: Uncompressed Studio WebRTC Stage & Hardware Audio Pod
Build the WebRTC audio/video stage with 48 kHz 510 kbps stereo Opus SDP override, 0–200% GainNode boost with dynamics compressor, loopback monitor, live FFT spectrum canvas, 60fps screen share (1080p, 1440p, 4K), and BroadcastChannel/SDP peer signaling.

### Phase 8: OpenClaw Mission Control Kanban & Right-Docked AI Copilot
Implement the 3-column task pipeline (`01 // QUEUED SPECS`, `02 // ACTIVE AGENT LOOP`, `03 // VERIFIED & SHIPPED`), one-click **DISPATCH AI** execution, and the right-docked AI Copilot drawer with Space RAG grounding.

### Phase 9: Google Gemini Direct REST, Firebase Cloud Sync & Antigravity Bridge
Wire direct client-side Gemini REST with live model discovery, Firebase Spark Firestore sync with invite-only auth, workspace export (`context.md` bundle, JSON backup/restore), and auto-generated `wc_bridge.py`.

### Phase 10: Electron Native Desktop Packaging & Cross-Platform Launchers
Assemble Electron main/preload runtime with GPU flags and `X-Frame-Options`/CSP header stripper, create `LAUNCH_WINDOWS_APP.bat`, `BUILD_EXE_INSTALLER.bat` (portable `.exe`), and `launch_fedora.sh`, followed by full visual verification.

## Sources

- W3C Web Audio API Specification & Web Audio Autoplay Policy
- RFC 7587: RTP Payload Format for the Opus Audio Codec
- Electron WebRequest API documentation & Session Security Guidelines
- Google Gemini API REST v1beta Reference Documentation

---
*Research summary for: White Collars (WHITESPACE) // Autonomous Workspace OS*
*Researched: 2026-11-16*
