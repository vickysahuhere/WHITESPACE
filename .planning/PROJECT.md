# White Collars (WHITESPACE) // Autonomous Workspace OS

## What This Is

White Collars (WHITESPACE) is a high-speed, production-grade AI Workspace and Native Desktop Application engineered for White Collars (WHITERs). It combines structural paradigms from Discord (vertical space rail, stage/voice channels, persistent audio pod), Notion 3.0 (slash-command live Markdown document editor, space page tree), and OpenClaw (Kanban task pipeline with 1-click Dispatch AI copilot). It functions seamlessly both as a rich PC web application and as an uncompressed, frameless Electron native Windows application (.exe).

## Core Value

An uncompromised, zero-latency unified workspace that gives every team member isolated personal AI chat sessions, sub-millisecond local RAG over space knowledge, an integrated multi-tab developer browser with selective team sharing, and studio-grade WebRTC audio/video calling—all styled in a strict black-and-white monochrome aesthetic with zero emojis.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **UI-01**: Strict Black-and-White monochrome design palette (`#000000`, `#0A0A0A`–`#171717`, `#262626`–`#404040`, `#FFFFFF`) with zero emojis across entire UI, icons, placeholders, and AI responses.
- [ ] **UI-02**: Triple-paradigm navigation: Discord-style far-left vertical Space rail + persistent bottom-left Voice & User Pod (`MIC ON`, `MUTE`, `STAGE`), Notion-style sidebar and document workspace, and OpenClaw task execution drawer.
- [ ] **UI-03**: Keyboard-first `CTRL+K` global command palette for instantaneous space, document, tool, and member switching.
- [ ] **UI-04**: Top-bar instant Gemini API key input bar with status indicator and live model discovery.
- [ ] **KB-01**: Multi-space management (create, switch, edit, delete independent Spaces including *White Collars Core*, *SignBridge*, *Mai-Reads*).
- [ ] **KB-02**: Per-Space system prompt (`SOUL.MD`) persistent master instructions injected into all AI queries and context exports.
- [ ] **KB-03**: Multi-format document ingestion (`.md`, `.txt`, `.json`, `.csv`, `.py`, `.js`, `.ts`, `.html`, `.css`, `.yaml`) and inline Notion-style slash-command live document editor (`/H2`, `/TODO`, `/CODE`, `/TABLE`, `/AI-SYNTHESIZE`).
- [ ] **KB-04**: Sub-millisecond in-memory cached vector/token index for local RAG retrieval across Active Space or All Spaces.
- [ ] **USR-01**: Multi-member session switcher with 4 pre-configured core slots (`Vicky Sahu`, `Arnav Suryavanshi`, `Lakshay Arora`, `Shiwant Goyal`) plus dynamic member creation.
- [ ] **USR-02**: Strict chat history isolation per user per Space (`chatsByUser[userId]`) so members never see each other's private conversations.
- [ ] **USR-03**: Customizable personal AI profile (Name, Role, Hardware/Tech Stack, Personal System Instructions) injected into Gemini queries.
- [ ] **USR-04**: Reactive 3D monochrome assistant (`WHITE`) rendered via Three.js/WebGL (sculpted geometric sphere / "W" wireframe) with audio reactivity.
- [ ] **BRW-01**: Multi-tab embedded developer browser with per-tab privacy (`PRIVATE (ONLY ME)` by default vs. `TAB: SHARED WITH TEAM`).
- [ ] **BRW-02**: Team Shared Tabs strip enabling teammates to inspect, browse, or clone shared tabs into their own workspace.
- [ ] **BRW-03**: Built-in developer tools: GitHub OSS repository explorer (live REST search + jsDelivr CDN links + Save Spec to Space Docs).
- [ ] **BRW-04**: Built-in Monochrome Code Sandbox with live HTML/CSS/JS editor and instant sandboxed execution.
- [ ] **BRW-05**: Built-in Vector Architecture Board (draggable interactive node/connector canvas with state sync on shared tabs).
- [ ] **BRW-06**: Built-in REST API tester (Hoppscotch-lite client for GET/POST requests and JSON response inspection).
- [ ] **BRW-07**: Embedded web viewport with one-click **INDEX TO SPACE** button to snapshot webpage text directly into Space Docs.
- [ ] **RTC-01**: Studio-grade WebRTC stage bypassing compression caps: 48 kHz, 510 kbps stereo Opus (`maxaveragebitrate=510000;stereo=1;cbr=1;useinbandfec=1`).
- [ ] **RTC-02**: Hardware audio controls with selectable audio inputs, 0–200% live Web Audio `GainNode` boost, real-time loopback monitor, and live FFT spectrum visualizer.
- [ ] **RTC-03**: High-bitrate video and 60fps screen sharing supporting 1080p60 (10 Mbps), 1440p60 (16 Mbps), and 4K60 (25 Mbps via `b=AS:25000` SDP override).
- [ ] **RTC-04**: Multi-mode peer signaling: local browser tab signaling via `BroadcastChannel`, and cross-device signaling via SDP Offer/Answer tokens or Firestore.
- [ ] **TSK-01**: OpenClaw 3-column Mission Control Kanban pipeline (`01 // QUEUED SPECS`, `02 // ACTIVE AGENT LOOP`, `03 // VERIFIED & SHIPPED`) with priority badges (`P0 HIGH`, `P1 MED`, `P2 LOW`).
- [ ] **TSK-02**: One-click **DISPATCH AI** execution moving cards to `ACTIVE AGENT LOOP` and executing tasks in the right-docked AI Copilot drawer with Space RAG grounding.
- [ ] **AI-01**: Direct client-side Google Gemini REST API integration with model discovery and automatic Local RAG fallback when offline or keyless.
- [ ] **SYNC-01**: Cloud Firestore sync for Spaces, docs, tasks, shared tabs, and isolated chats with Firebase Spark free tier and invite-only auth.
- [ ] **BRG-01**: Workspace export bundle (download `context.md` combining active profile, `SOUL.MD`, docs, tasks, and shared tabs; full JSON backup/restore).
- [ ] **BRG-02**: Auto-generated `wc_bridge.py` sync script enabling local PC AI tools (Google Antigravity, Cursor, CLI) to pull workspace state into local folders.
- [ ] **APP-01**: Electron native desktop wrapper (`main.js` + `preload.js` + `package.json`) stripping `X-Frame-Options` and CSP headers for arbitrary URL embedding.
- [ ] **APP-02**: Native Windows packaging with `LAUNCH_WINDOWS_APP.bat`, `BUILD_EXE_INSTALLER.bat` (`electron-builder --win --x64`), and `launch_fedora.sh`.
- [ ] **APP-03**: Dual web/desktop execution ensuring 100% of non-native features function cleanly on the web browser application as well as in Electron.

### Out of Scope

- Mobile app packaging (iOS/Android native apps) — primary targets are PC web browser and Windows native Electron desktop (.exe).
- Heavy centralized media servers (SFU/MCU like Janus/LiveKit server installations) — direct peer WebRTC mesh with BroadcastChannel and SDP/Firestore signaling preserves zero-cost serverless operation.
- Paid AI provider integrations beyond Google Gemini API (OpenAI/Anthropic keys) — focused on Gemini 2.5/3.x models + local RAG fallback.
- Third-party analytics, tracking scripts, and colorful themes — strictly monochrome, privacy-first, zero third-party telemetry.

## Context

- Target user base: White Collars (WHITERs) autonomous development and knowledge work collective.
- High-performance requirement: in-memory caching for sub-millisecond retrieval, 60fps animations, zero-copy Electron flags.
- Complete functional guarantee: no stubbed buttons, dummy alert popups, or static placeholder UI.
- Dual execution: fully usable via browser URL (Vite dev / static preview) and as native desktop application.

## Constraints

- **Design**: Strict monochrome `#000000`, `#0A0A0A`–`#171717`, `#262626`–`#404040`, `#FFFFFF`. Zero emojis. Geometric typographic badges and clean inline SVGs only.
- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS with Lucide-style monochrome SVG icons.
- **Desktop Runtime**: Electron 34+ with Node integration / context isolation preload and security headers stripped for developer web viewing.
- **Web Audio/RTC**: Web Audio API `AudioContext` with `AnalyserNode`, `GainNode`, and Opus SDP manipulation.
- **Cloud Backend**: Firebase Spark free tier (Firestore + Firebase Auth + Hosting).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vite + React + TypeScript + Tailwind CSS | Fast compilation, component modularity for complex UI (Canvas, Three.js, Editor), seamless Electron integration | ✓ Good |
| Dual Web + Desktop Architecture | Allows instantaneous access via any browser while Electron provides frameless UI and arbitrary iframe embedding | ✓ Good |
| Client-Side Direct Gemini REST | Eliminates backend server requirements, zero latency, user keys stored in localStorage/session | ✓ Good |
| In-Memory Cached Index for RAG | Sub-millisecond retrieval without needing heavy external vector database servers | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-11-16 after initialization*
