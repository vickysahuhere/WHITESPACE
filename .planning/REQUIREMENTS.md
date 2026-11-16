# Requirements: White Collars (WHITESPACE) // Autonomous Workspace OS

**Defined:** 2026-11-16
**Core Value:** An uncompromised, zero-latency unified workspace that gives every team member isolated personal AI chat sessions, sub-millisecond local RAG over space knowledge, an integrated multi-tab developer browser with selective team sharing, and studio-grade WebRTC audio/video calling—all styled in a strict black-and-white monochrome aesthetic with zero emojis.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Visual Design & Triple-Paradigm Shell

- [x] **UI-01**: Strict Black-and-White monochrome palette (`#000000`, `#0A0A0A`–`#171717`, `#262626`–`#404040`, `#FFFFFF`).
- [x] **UI-02**: Zero emojis anywhere in the UI, icons, placeholders, or AI responses (crisp inline SVGs and typographic badges only).
- [x] **UI-03**: Discord-style far-left vertical Space rail with active space indicator and direct voice/stage toggle.
- [x] **UI-04**: Notion-style workspace navigation tree and document sidebar.
- [x] **UI-05**: Persistent bottom-left Voice & User Pod (`MIC ON`, `MUTE`, `STAGE`) with instant status badges.
- [x] **UI-06**: Keyboard-first global Command Palette (`CTRL+K`) for sub-second switching between spaces, docs, tabs, and team members.
- [x] **UI-07**: Top-bar instant Gemini API Key input bar with link button, live status indicator, and model discovery.

### Multi-Space Knowledge Base & Live Editor

- [x] **KB-01**: Create, switch, rename, and delete independent Spaces (*White Collars Core*, *SignBridge*, *Mai-Reads*).
- [x] **KB-02**: Persistent per-Space system prompt (`SOUL.MD`) injected into all AI queries and workspace exports.
- [x] **KB-03**: Multi-format document ingestion (`.md`, `.txt`, `.json`, `.csv`, `.py`, `.js`, `.ts`, `.html`, `.css`, `.yaml`).
- [x] **KB-04**: Notion 3.0 live slash-command markdown editor (`/H2`, `/TODO`, `/CODE`, `/TABLE`, `/AI-SYNTHESIZE`).

### Sub-Millisecond In-Memory Local RAG

- [x] **RAG-01**: Client-side chunking and incremental token index covering `SOUL.MD`, space docs, tasks, and shared tabs.
- [x] **RAG-02**: Sub-millisecond (`< 1 ms`) similarity search across active Space or All Spaces.
- [x] **RAG-03**: RAG context inspector displaying matched chunks, scores, and source documents.

### User Personalization & Chat Isolation

- [x] **USR-01**: Multi-member session switcher with 4 pre-configured slots (`Vicky Sahu`, `Arnav Suryavanshi`, `Lakshay Arora`, `Shiwant Goyal`) plus dynamic member creation.
- [x] **USR-02**: Strict chat history isolation per user per Space (`chatsByUser[userId][spaceId]`).
- [x] **USR-03**: Personal AI profile (Name, Role, Hardware/Tech Stack, Personal Instructions) injected into Gemini queries.
- [x] **USR-04**: Reactive 3D monochrome assistant (`WHITE`) rendered with Three.js WebGL (geometric wireframe sphere / sculpted "W") with audio reactivity.

### Multi-Tab OSS Developer Browser

- [ ] **BRW-01**: Personal multi-tab browser per member with tab switching, URL navigation, and history.
- [ ] **BRW-02**: Selective per-tab privacy (`PRIVATE (ONLY ME)` by default vs. `TAB: SHARED WITH TEAM`).
- [ ] **BRW-03**: Team Shared Tabs strip displaying teammates' shared tabs with one-click preview and clone.
- [ ] **BRW-04**: Embedded Web Viewport with one-click **INDEX TO SPACE** button to snapshot page content into Space Docs.

### Built-in Developer Suite

- [ ] **DEV-01**: GitHub OSS Explorer searching live repositories via GitHub REST API with jsDelivr CDN links and save to space docs.
- [ ] **DEV-02**: Monochrome Code Sandbox with live HTML/CSS/JS editing and instant sandboxed execution.
- [ ] **DEV-03**: Vector Architecture Board with interactive draggable node-and-connector canvas and state sync.
- [ ] **DEV-04**: REST API Tester (Hoppscotch-lite client) firing GET/POST requests and formatting JSON responses.

### Uncompressed WebRTC Stage & Hardware Audio Pod

- [ ] **RTC-01**: Studio audio WebRTC stage at 48 kHz, 510 kbps stereo Opus with hardware bypass options.
- [ ] **RTC-02**: Hardware audio controls with selectable audio inputs, 0–200% live GainNode boost, and loopback monitor.
- [ ] **RTC-03**: Real-time dB level meter and FFT spectrum visualizer rendered on HTML5 Canvas.
- [ ] **RTC-04**: High-bitrate 60fps screen and video sharing supporting 1080p, 1440p, and 4K (via `b=AS:25000` SDP override).
- [ ] **RTC-05**: Peer signaling via `BroadcastChannel` (for instant local browser tabs) and SDP Offer/Answer tokens or Firestore.

### OpenClaw Mission Control Kanban & AI Copilot

- [ ] **TSK-01**: 3-column Kanban pipeline (`01 // QUEUED SPECS`, `02 // ACTIVE AGENT LOOP`, `03 // VERIFIED & SHIPPED`) with priority badges (`P0 HIGH`, `P1 MED`, `P2 LOW`).
- [ ] **TSK-02**: One-click **DISPATCH AI** execution moving cards to `ACTIVE AGENT LOOP` and executing them in the right-docked AI Copilot drawer.
- [ ] **TSK-03**: Right-docked AI Copilot drawer with real-time streaming, RAG context grounding, and space `SOUL.MD` awareness.

### Google Gemini Direct REST, Firebase Cloud Sync & Bridge

- [ ] **SYNC-01**: Direct client-side Google Gemini REST API integration with model discovery and Local RAG offline fallback.
- [ ] **SYNC-02**: Cloud Firestore sync for spaces, docs, tasks, shared tabs, and isolated chats with Firebase Spark free tier and invite-only auth.
- [ ] **SYNC-03**: Workspace export bundle (`context.md` download combining active profile, `SOUL.MD`, docs, tasks, shared tabs, and full JSON backup/restore).
- [ ] **SYNC-04**: Auto-generated `wc_bridge.py` Python sync script pulling live workspace state into local PC tool directories (Antigravity, Cursor, CLI).

### Electron Native Desktop App & Cross-Platform Packaging

- [ ] **APP-01**: Electron 34+ wrapper (`main.cjs`, `preload.cjs`) with frameless window, GPU rasterization, and zero-copy 60fps flags.
- [ ] **APP-02**: Electron session header stripper removing `X-Frame-Options` and CSP headers for arbitrary external website embedding.
- [ ] **APP-03**: Auto-grant permissions for microphone, camera, and desktopCapturer screen sharing with system audio loopback.
- [ ] **APP-04**: One-click native launchers: `LAUNCH_WINDOWS_APP.bat`, `BUILD_EXE_INSTALLER.bat` (`electron-builder --win --x64`), and `launch_fedora.sh`.
- [ ] **APP-05**: Dual web and desktop parity ensuring complete web browser functionality with graceful fallbacks.

## v2 Requirements

Deferred to future releases.

### Native Mobile Companions
- **MOB-01**: Native iOS and Android companion apps with lightweight push notifications.

### Global Multi-Region SFU Relay
- **SFU-01**: Dedicated SFU edge nodes for massive 100+ participant video stages.

## Out of Scope

Explicitly excluded to protect performance, focus, and aesthetic integrity.

| Feature | Reason |
|---------|--------|
| Emojis in UI or Badges | Strictly forbidden by White Collars monochrome discipline; replaced by geometric badges and SVG icons |
| Heavy External Vector DB Servers (Pinecone, Weaviate) | Unnecessary complexity, cost, and latency; in-memory cache provides sub-millisecond retrieval with zero dependencies |
| Generic Gradients and Glassmorphism | Lowers contrast, violates high-speed monochrome standard, causes GPU lag |
| Placeholder / Stubbed Action Buttons | Every control must be functionally wired to real state machines or local storage |
| Mobile Native Packaging | Primary targets are PC web browser and Windows native Electron desktop (.exe) |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 to UI-07 | Phase 1 | Complete |
| KB-01 to KB-04 | Phase 2 | Pending |
| RAG-01 to RAG-03 | Phase 3 | Pending |
| USR-01 to USR-04 | Phase 4 | Pending |
| BRW-01 to BRW-04 | Phase 5 | Pending |
| DEV-01 to DEV-04 | Phase 6 | Pending |
| RTC-01 to RTC-05 | Phase 7 | Pending |
| TSK-01 to TSK-03 | Phase 8 | Pending |
| SYNC-01 to SYNC-04 | Phase 9 | Pending |
| APP-01 to APP-05 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 40 total
- Mapped to phases: 40
- Unmapped: 0 ✓

---
*Requirements defined: 2026-11-16*
*Last updated: 2026-11-16 after initialization*
