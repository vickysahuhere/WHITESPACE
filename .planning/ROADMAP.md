# Roadmap: White Collars (WHITESPACE) // Autonomous Workspace OS

## Overview

White Collars (WHITESPACE) is built as a complete, high-speed, dual-target AI Workspace & Native Desktop Application. The roadmap follows a Vertical MVP progression across 10 fine-grained, self-contained phases. Each phase delivers an end-to-end functional slice of capability, ensuring that every button, control, and state machine is genuinely functional on both the PC web browser and Windows native desktop wrapper.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Monochrome Design Foundation & Triple-Paradigm Shell** - Establish strict black-and-white theme tokens, Discord space rail, Notion navigation, top-bar Gemini bar, audio pod, and CTRL+K palette.
- [ ] **Phase 2: Multi-Space Knowledge Base, SOUL.MD & Live Document Editor** - Multi-space management, persistent per-space SOUL.MD, multi-format file ingestion, and Notion-style slash-command editor.
- [ ] **Phase 3: Sub-Millisecond In-Memory Local RAG Engine** - Client-side incremental chunking and token index providing < 1 ms similarity search across active or all spaces.
- [ ] **Phase 4: User Personalization, Chat Isolation & 3D Assistant (WHITE)** - 4-member session switcher + add user, strictly isolated chat histories, personal AI profiles, and reactive Three.js 3D assistant.
- [ ] **Phase 5: Multi-Tab OSS Browser & Selective Tab Sharing** - Embedded multi-tab browser with per-tab privacy (PRIVATE vs SHARED), Team Shared Tabs strip, and web viewport with INDEX TO SPACE.
- [ ] **Phase 6: Built-in Developer Suite (GitHub OSS, Sandbox, Vector Board, REST Tester)** - GitHub repo search with CDN links, monochrome live code sandbox, interactive vector architecture canvas, and Hoppscotch-lite REST client.
- [ ] **Phase 7: Uncompressed Studio WebRTC Stage & Hardware Audio Pod** - 48 kHz 510 kbps stereo Opus stage, 0–200% GainNode boost with soft limiter, live FFT spectrum canvas, 4K60 screen share, and BroadcastChannel/SDP signaling.
- [ ] **Phase 8: OpenClaw Mission Control Kanban & Right-Docked AI Copilot** - 3-column task pipeline with one-click DISPATCH AI into right-docked AI Copilot drawer with RAG grounding.
- [ ] **Phase 9: Google Gemini Direct REST, Firebase Cloud Sync & Antigravity Bridge** - Direct Gemini REST with model discovery, Firebase Spark Firestore sync with invite-only auth, context.md download, and auto-generated wc_bridge.py.
- [ ] **Phase 10: Electron Native Desktop Packaging & Cross-Platform Launchers** - Electron 34+ wrapper with CSP/X-Frame-Options stripper, LAUNCH_WINDOWS_APP.bat, BUILD_EXE_INSTALLER.bat (portable .exe), and full dual web/desktop verification.

## Phase Details

### Phase 1: Monochrome Design Foundation & Triple-Paradigm Shell
**Goal**: Establish the strict black-and-white theme tokens, Discord space rail, Notion navigation tree, persistent bottom-left audio pod, top-bar Gemini key bar, and CTRL+K global command palette with responsive dual web/desktop layout.
**Mode**: mvp
**Depends on**: Nothing (first phase)
**Requirements**: UI-01, UI-02, UI-03, UI-04, UI-05, UI-06, UI-07
**Success Criteria** (what must be TRUE):
  1. Complete monochrome interface (#000000, #0A0A0A–#171717, #262626–#404040, #FFFFFF) renders with zero emojis anywhere in the system.
  2. Left Discord-style vertical space rail displays space indicators, voice/stage toggle, and persistent bottom-left User/Voice Pod.
  3. Top bar provides single Gemini API Key input field with instant status feedback and model link button.
  4. CTRL+K keyboard shortcut instantly triggers the global command palette for fast keyboard-first navigation.
  5. UI renders identically and responsively on both standard web browsers and Electron window frames.
**Plans**: 3 plans

Plans:
**Wave 1**
- [x] 01-01: Initialize Vite React TypeScript Tailwind project with strict monochrome design system, theme tokens, and typography.

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 01-02: Build Discord Space Rail, Notion Sidebar, Top-Bar Gemini Key Bar, and persistent Voice & User Pod.

**Wave 3** *(blocked on Wave 2 completion)*
- [x] 01-03: Implement CTRL+K global command palette modal with keyboard navigation across spaces, documents, tools, and actions.

### Phase 2: Multi-Space Knowledge Base, SOUL.MD & Live Document Editor
**Goal**: Deliver multi-space workspace partitioning (*White Collars Core*, *SignBridge*, *Mai-Reads*), per-space persistent SOUL.MD, multi-format document ingestion, and Notion-style live slash-command markdown editor.
**Mode**: mvp
**Depends on**: Phase 1
**Requirements**: KB-01, KB-02, KB-03, KB-04
**Success Criteria** (what must be TRUE):
  1. Users can create, switch between, edit metadata for, and delete independent Spaces with full local persistence.
  2. Each Space maintains an editable SOUL.MD system prompt that dynamically shapes AI context.
  3. Multi-format file uploader parses and loads `.md`, `.txt`, `.json`, `.csv`, `.py`, `.js`, `.ts`, `.html`, `.css`, and `.yaml` documents into the Space tree.
  4. Live document editor executes Notion slash commands (`/H2`, `/TODO`, `/CODE`, `/TABLE`, `/AI-SYNTHESIZE`) inline without lag.
**Plans**: 3 plans

Plans:
**Wave 1**
- [ ] 02-01: Implement Space management state machine, Space creation/switch/delete modals, and SOUL.MD persistent storage.

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] 02-02: Build multi-format document ingestion pipeline supporting 10 file formats with drag-and-drop file upload.

**Wave 3** *(blocked on Wave 2 completion)*
- [ ] 02-03: Build Notion 3.0 live slash-command document editor with inline formatting, block actions, and Markdown rendering.

### Phase 3: Sub-Millisecond In-Memory Local RAG Engine
**Goal**: Deliver an incremental in-memory chunking, token indexing, and vector similarity retrieval engine operating in < 1 ms over active or all spaces.
**Mode**: mvp
**Depends on**: Phase 2
**Requirements**: RAG-01, RAG-02, RAG-03
**Success Criteria** (what must be TRUE):
  1. Documents, SOUL.MD, OpenClaw tasks, and shared browser tabs are automatically tokenized and indexed in memory upon creation/update.
  2. Query searches across the active Space or across All Spaces return ranked similarity chunks in < 1 ms.
  3. Context inspector UI displays matched chunks, relevance scores, and document sources for transparent AI grounding.
**Plans**: 2 plans

Plans:
- [ ] 03-01: Build client-side document chunker, inverted token indexer, and sub-millisecond sparse cosine/BM25 ranker.
- [ ] 03-02: Build RAG context inspector drawer and test query bench with sub-millisecond benchmark display.

### Phase 4: User Personalization, Chat Isolation & 3D Assistant (WHITE)
**Goal**: Implement multi-member session switching with 4 pre-configured slots plus additions, strict chat history isolation per user per space, personal AI profiles, and reactive Three.js geometric 3D assistant.
**Mode**: mvp
**Depends on**: Phase 3
**Requirements**: USR-01, USR-02, USR-03, USR-04
**Success Criteria** (what must be TRUE):
  1. User switcher transitions between `Vicky Sahu`, `Arnav Suryavanshi`, `Lakshay Arora`, `Shiwant Goyal`, and custom added members seamlessly.
  2. Chat histories are strictly isolated per user and per space (`chatsByUser[userId][spaceId]`), ensuring privacy between team members.
  3. Personal AI profile (Name, Role, Hardware/Tech Stack, Custom Instructions) is injected into every Gemini system prompt.
  4. Reactive 3D assistant (`WHITE`) renders a monochrome geometric wireframe sphere / sculpted "W" in Three.js responding visually to audio/voice activity.
**Plans**: 3 plans

Plans:
- [ ] 04-01: Implement multi-member session switcher, member management modal, and strictly isolated chat stores by user and space.
- [ ] 04-02: Build personal AI profile customization interface and Gemini prompt injection assembler.
- [ ] 04-03: Build Three.js 3D assistant (WHITE) with geometric wireframe sphere and sculpted "W" audio reactivity.

### Phase 5: Multi-Tab OSS Browser & Selective Tab Sharing
**Goal**: Deliver an embedded multi-tab browser per member with selective privacy toggles (`PRIVATE (ONLY ME)` vs. `SHARED WITH TEAM`), Team Shared Tabs strip, and embedded web viewport with INDEX TO SPACE.
**Mode**: mvp
**Depends on**: Phase 4
**Requirements**: BRW-01, BRW-02, BRW-03, BRW-04
**Success Criteria** (what must be TRUE):
  1. Every team member can open, switch, and close multiple personal browser tabs with URL navigation and back/forward history.
  2. New tabs default to `PRIVATE (ONLY ME)` and can be toggled to `TAB: SHARED WITH TEAM` with one click.
  3. Team Shared Tabs strip shows all shared tabs across all members, allowing teammates to view, inspect, or clone them into their own workspace.
  4. Embedded web viewport loads external web pages with an INDEX TO SPACE button that extracts page text directly into Space Docs.
**Plans**: 2 plans

Plans:
- [ ] 05-01: Build personal multi-tab browser shell with tab bar, URL input, navigation controls, and PRIVATE vs SHARED privacy toggles.
- [ ] 05-02: Implement Team Shared Tabs strip with clone action and embedded web viewport with INDEX TO SPACE document snapshotter.

### Phase 6: Built-in Developer Suite (GitHub OSS, Sandbox, Vector Board, REST Tester)
**Goal**: Provide 4 first-class built-in developer tools accessible via browser tabs: GitHub OSS Explorer, Monochrome Code Sandbox, Vector Architecture Board, and REST API Tester.
**Mode**: mvp
**Depends on**: Phase 5
**Requirements**: DEV-01, DEV-02, DEV-03, DEV-04
**Success Criteria** (what must be TRUE):
  1. GitHub OSS Explorer searches live GitHub repositories via REST API, copies jsDelivr CDN links, and saves repo specs directly to Space Docs.
  2. Monochrome Code Sandbox provides a live HTML/CSS/JS editor with instant iframe execution and error logging.
  3. Vector Architecture Board provides an interactive draggable node-and-connector canvas that synchronizes state when the tab is shared.
  4. REST API Tester (Hoppscotch-lite) executes GET/POST HTTP requests, passes custom headers, and formats JSON response payloads with status codes.
**Plans**: 3 plans

Plans:
- [ ] 06-01: Build GitHub OSS Explorer (REST search, jsDelivr links, save repo spec to Space Docs) and Monochrome Code Sandbox (live HTML/CSS/JS runner).
- [ ] 06-02: Build Vector Architecture Board with draggable nodes, connectors, geometric badges, and state serialization.
- [ ] 06-03: Build REST API Tester (Hoppscotch-lite client) with method selector, header editor, payload input, and formatted JSON viewer.

### Phase 7: Uncompressed Studio WebRTC Stage & Hardware Audio Pod
**Goal**: Deliver uncompressed studio-grade WebRTC voice/video/screen calling (48 kHz 510 kbps stereo Opus, 4K60 video, 0–200% GainNode boost, loopback monitor, FFT canvas visualizer, BroadcastChannel/SDP signaling).
**Mode**: mvp
**Depends on**: Phase 6
**Requirements**: RTC-01, RTC-02, RTC-03, RTC-04, RTC-05
**Success Criteria** (what must be TRUE):
  1. WebRTC audio pipeline establishes 48 kHz stereo Opus transmission with SDP bitrate set to `510000` bps and hardware processing bypass.
  2. Hardware audio pod controls allow selecting audio inputs, boosting volume 0–200% through a dynamics compressor, and listening via live loopback monitor.
  3. Real-time dB meter and FFT spectrum visualizer animate smoothly on HTML5 Canvas at 60fps.
  4. High-bitrate 60fps screen share transmits crisp code and design views up to 4K resolution (via `b=AS:25000` SDP override).
  5. Peer connection auto-links locally across browser tabs via `BroadcastChannel` and across machines via manual SDP tokens or Firestore signaling.
**Plans**: 3 plans

Plans:
- [ ] 07-01: Implement Web Audio API hardware pod: input device selector, 0–200% GainNode boost with dynamics compressor, and loopback monitor.
- [ ] 07-02: Build 60fps HTML5 Canvas dB level meter and FFT frequency spectrum analyzer linked to the audio pipeline.
- [ ] 07-03: Implement WebRTC Stage with 510 kbps Opus SDP mutator, 4K60 screen share (b=AS:25000), and dual BroadcastChannel + SDP signaling.

### Phase 8: OpenClaw Mission Control Kanban & Right-Docked AI Copilot
**Goal**: Deliver the OpenClaw 3-column Kanban pipeline with one-click DISPATCH AI execution into the right-docked AI Copilot drawer grounded by Space RAG context.
**Mode**: mvp
**Depends on**: Phase 7
**Requirements**: TSK-01, TSK-02, TSK-03
**Success Criteria** (what must be TRUE):
  1. Kanban board organizes tasks across `01 // QUEUED SPECS`, `02 // ACTIVE AGENT LOOP`, and `03 // VERIFIED & SHIPPED` with `P0`, `P1`, and `P2` priority badges.
  2. Clicking DISPATCH AI on any task card automatically moves it to `ACTIVE AGENT LOOP` and opens the right-docked AI Copilot drawer.
  3. Right-docked AI Copilot executes the task prompt grounded in Space RAG chunks and SOUL.MD, streaming tokens in real time and providing task status updates.
**Plans**: 2 plans

Plans:
- [ ] 08-01: Build OpenClaw 3-column Kanban board with card drag-and-drop, priority tagging (`P0`/`P1`/`P2`), and card creation/editing.
- [ ] 08-02: Implement right-docked AI Copilot drawer with DISPATCH AI binding, RAG context injection, and streaming execution updates.

### Phase 9: Google Gemini Direct REST, Firebase Cloud Sync & Antigravity Bridge
**Goal**: Wire direct client-side Google Gemini REST API with live model discovery, Firebase Spark Cloud Firestore sync with invite-only auth, workspace export bundle, and auto-generated `wc_bridge.py`.
**Mode**: mvp
**Depends on**: Phase 8
**Requirements**: SYNC-01, SYNC-02, SYNC-03, SYNC-04
**Success Criteria** (what must be TRUE):
  1. Direct client-side REST calls connect to `generativelanguage.googleapis.com` with live model discovery and automatic Local RAG fallback when keyless.
  2. Cloud Firestore real-time synchronization synchronizes Spaces, docs, tasks, shared tabs, and isolated chats across devices on the Spark free tier.
  3. One-click Download `context.md` packages active profile, SOUL.MD, docs, tasks, and shared tabs; full JSON backup/restore exports and imports complete workspace state.
  4. Auto-generated `wc_bridge.py` script runs on local machines to pull live Firestore workspace state directly into local project folders for Google Antigravity, Cursor, and CLI tools.
**Plans**: 3 plans

Plans:
- [ ] 09-01: Build direct client-side Gemini REST client with model discovery and automatic offline Local RAG fallback.
- [ ] 09-02: Implement Firebase Spark Cloud Firestore sync with debounced updates and invite-only authentication.
- [ ] 09-03: Implement workspace export bundle (`context.md`), JSON backup/restore, and auto-generated `wc_bridge.py` sync script.

### Phase 10: Electron Native Desktop Packaging & Cross-Platform Launchers
**Goal**: Assemble Electron 34+ desktop wrapper with GPU flags and session-level header stripper (removing `X-Frame-Options` and CSP), create native launchers (`LAUNCH_WINDOWS_APP.bat`, `BUILD_EXE_INSTALLER.bat`, `launch_fedora.sh`), and verify end-to-end dual web/desktop parity.
**Mode**: mvp
**Depends on**: Phase 9
**Requirements**: APP-01, APP-02, APP-03, APP-04, APP-05
**Success Criteria** (what must be TRUE):
  1. Electron main process strips `X-Frame-Options` and restrictive CSP headers in `onHeadersReceived`, enabling arbitrary external web pages to render inside OSS Browser tabs.
  2. Electron auto-grants mic, camera, and desktopCapturer screen-sharing permissions with system loopback audio.
  3. `LAUNCH_WINDOWS_APP.bat` launches the frameless native desktop application instantly.
  4. `BUILD_EXE_INSTALLER.bat` executes `electron-builder` to compile a standalone portable `WhiteCollarsOS.exe` and Windows installer.
  5. 100% of non-native features function cleanly and identically on the PC web browser version.
**Plans**: 3 plans

Plans:
- [ ] 10-01: Assemble Electron main process (`main.cjs`) and preload bridge (`preload.cjs`) with CSP/XFO stripper and frameless window controls.
- [ ] 10-02: Create `LAUNCH_WINDOWS_APP.bat`, `BUILD_EXE_INSTALLER.bat` with electron-builder config, and `launch_fedora.sh`.
- [ ] 10-03: Conduct end-to-end verification, browser testing, and ensure dual web and native desktop feature parity across all 10 pillars.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Monochrome Design Foundation & Triple-Paradigm Shell | 3/3 | Completed | 2026-11-16 |
| 2. Multi-Space Knowledge Base, SOUL.MD & Live Document Editor | 0/3 | Not started | - |
| 3. Sub-Millisecond In-Memory Local RAG Engine | 0/2 | Not started | - |
| 4. User Personalization, Chat Isolation & 3D Assistant (WHITE) | 0/3 | Not started | - |
| 5. Multi-Tab OSS Browser & Selective Tab Sharing | 0/2 | Not started | - |
| 6. Built-in Developer Suite | 0/3 | Not started | - |
| 7. Uncompressed Studio WebRTC Stage & Hardware Audio Pod | 0/3 | Not started | - |
| 8. OpenClaw Mission Control Kanban & Right-Docked AI Copilot | 0/2 | Not started | - |
| 9. Google Gemini Direct REST, Firebase Cloud Sync & Antigravity Bridge | 0/3 | Not started | - |
| 10. Electron Native Desktop Packaging & Cross-Platform Launchers | 0/3 | Not started | - |

---
*Roadmap generated: 2026-11-16*
*Last updated: 2026-11-16 after initialization*
