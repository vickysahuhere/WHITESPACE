# Requirements: White Collars (WHITESPACE) // Autonomous Workspace OS

**Defined:** 2026-11-16  
**Core Value:** An uncompromised, zero-latency unified workspace that gives every team member isolated personal AI chat sessions, sub-millisecond local RAG over space knowledge, an integrated multi-tab developer browser with selective team sharing, and studio-grade WebRTC audio/video calling—all styled in a strict black-and-white monochrome aesthetic with zero emojis.

---

## Milestone v1.0 Requirements (Validated & Shipped)

### Visual Design & Triple-Paradigm Shell
- [x] **UI-01**: Strict Black-and-White monochrome palette (`#000000`, `#0A0A0A`–`#171717`, `#262626`–`#404040`, `#FFFFFF`).
- [x] **UI-02**: Zero emojis anywhere in the UI, icons, placeholders, or AI responses (crisp inline SVGs and typographic badges only).
- [x] **UI-03**: Discord-style far-left vertical Space rail with active space indicator and direct voice/stage toggle.
- [x] **UI-04**: Notion-style workspace navigation tree and document sidebar.
- [x] **UI-05**: Persistent bottom-left Voice & User Pod (`MIC ON`, `MUTE`, `STAGE`) with instant status badges.
- [x] **UI-06**: Keyboard-first global Command Palette (`CTRL+K`) for sub-second switching between spaces, docs, tabs, and team members.
- [x] **UI-07**: Top-bar minimal Omnibar and live Gemini status indicator with model discovery.

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
- [x] **BRW-01**: Personal multi-tab browser per member with tab switching, URL navigation, and history.
- [x] **BRW-02**: Selective per-tab privacy (`PRIVATE (ONLY ME)` by default vs. `TAB: SHARED WITH TEAM`).
- [x] **BRW-03**: Team Shared Tabs strip displaying teammates' shared tabs with one-click preview and clone.
- [x] **BRW-04**: Embedded Web Viewport with one-click **INDEX TO SPACE** button to snapshot page content into Space Docs.

### Built-in Developer Suite
- [x] **DEV-01**: GitHub OSS Explorer searching live repositories via GitHub REST API with jsDelivr CDN links and save to space docs.
- [x] **DEV-02**: Monochrome Code Sandbox with live HTML/CSS/JS editing and instant sandboxed execution.
- [x] **DEV-03**: Vector Architecture Board with interactive draggable node-and-connector canvas and state sync.
- [x] **DEV-04**: REST API Tester (Hoppscotch-lite client) firing GET/POST requests and formatting JSON responses.

### Uncompressed WebRTC Stage & Hardware Audio Pod
- [x] **RTC-01**: Studio audio WebRTC stage at 48 kHz, 510 kbps stereo Opus with hardware bypass options.
- [x] **RTC-02**: Hardware audio controls with selectable audio inputs, 0–200% live GainNode boost, and loopback monitor.
- [x] **RTC-03**: Real-time dB level meter and FFT spectrum visualizer rendered on HTML5 Canvas.
- [x] **RTC-04**: High-bitrate 60fps screen and video sharing supporting 1080p, 1440p, and 4K (via `b=AS:25000` SDP override).
- [x] **RTC-05**: Peer signaling via `BroadcastChannel` (for instant local browser tabs) and SDP Offer/Answer tokens or Firestore.

### OpenClaw Mission Control Kanban & AI Copilot
- [x] **TSK-01**: 3-column Kanban pipeline (`01 // QUEUED SPECS`, `02 // ACTIVE AGENT LOOP`, `03 // VERIFIED & SHIPPED`) with priority badges (`P0 HIGH`, `P1 MED`, `P2 LOW`).
- [x] **TSK-02**: One-click **DISPATCH AI** execution moving cards to `ACTIVE AGENT LOOP` and executing them in the right-docked AI Copilot drawer.
- [x] **TSK-03**: Right-docked AI Copilot drawer with real-time streaming, RAG context grounding, and space `SOUL.MD` awareness.

### Google Gemini Direct REST, Firebase Cloud Sync & Bridge
- [x] **SYNC-01**: Direct client-side Google Gemini REST API integration with model discovery and Local RAG offline fallback.
- [x] **SYNC-02**: Cloud Firestore sync for spaces, docs, tasks, shared tabs, and isolated chats with Firebase Spark free tier and invite-only auth.
- [x] **SYNC-03**: Workspace export bundle (`context.md` download combining active profile, `SOUL.MD`, docs, tasks, shared tabs, and full JSON backup/restore).
- [x] **SYNC-04**: Auto-generated `wc_bridge.py` Python sync script pulling live workspace state into local PC tool directories (Antigravity, Cursor, CLI).

### Electron Native Desktop App & Cross-Platform Packaging
- [x] **APP-01**: Electron 34+ wrapper (`main.cjs`, `preload.cjs`) with frameless window, GPU rasterization, and zero-copy 60fps flags.
- [x] **APP-02**: Electron session header stripper removing `X-Frame-Options` and CSP headers for arbitrary external website embedding.
- [x] **APP-03**: Auto-grant permissions for microphone, camera, and desktopCapturer screen sharing with system audio loopback.
- [x] **APP-04**: One-click native launchers: `LAUNCH_WINDOWS_APP.bat`, `BUILD_EXE_INSTALLER.bat` (`electron-builder --win --x64`), and `launch_fedora.sh`.
- [x] **APP-05**: Dual web and desktop parity ensuring complete web browser functionality with graceful fallbacks.

---

## Milestone v1.1 Requirements: Mobile Companion (Active)

### Mobile Shell & PWA Foundation
- [ ] **MOB-01**: Touch-first responsive mobile shell (`< 768px`) with safe-area padding (`env(safe-area-inset-*)`), clean monochrome top navigation bar, and bottom dock toggling between `[AI BOT]` and `[STAGE]`.
- [ ] **MOB-02**: Progressive Web App (PWA) manifest (`manifest.json`), service worker, and mobile meta tags for instant standalone phone installation without App Store friction.

### Mobile AI Bot (WHITE Assistant & RAG Chat)
- [ ] **MOB-03**: Mobile AI Bot chat interface with thumb-reachable prompt input, streaming Gemini REST, Space RAG grounding chips, and mobile-optimized 3D/Canvas audio-reactive assistant sphere.

### Mobile Studio Stage (WebRTC Calling & Voice Pod)
- [ ] **MOB-04**: Mobile Studio WebRTC Stage with touch audio controls (1-tap mute, loopback monitor, earpiece/speaker toggle, 0-200% GainNode boost) and 60fps mobile Canvas visualizer.

### Mobile Android Packaging
- [ ] **MOB-05**: Mobile Android packaging configuration with Capacitor / Android CLI launcher (`BUILD_ANDROID_APK.bat`) producing installable `.apk` for Android physical devices.

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 to UI-07 | Phase 1 | Complete |
| KB-01 to KB-04 | Phase 2 | Complete |
| RAG-01 to RAG-03 | Phase 3 | Complete |
| USR-01 to USR-04 | Phase 4 | Complete |
| BRW-01 to BRW-04 | Phase 5 | Complete |
| DEV-01 to DEV-04 | Phase 6 | Complete |
| RTC-01 to RTC-05 | Phase 7 | Complete |
| TSK-01 to TSK-03 | Phase 8 | Complete |
| SYNC-01 to SYNC-04 | Phase 9 | Complete |
| APP-01 to APP-05 | Phase 10 | Complete |
| MOB-01 to MOB-02 | Phase 11 | Pending |
| MOB-03 | Phase 12 | Pending |
| MOB-04 | Phase 13 | Pending |
| MOB-05 | Phase 14 | Pending |

**Coverage:**
- v1.0 requirements: 40 total (40 validated ✓)
- v1.1 requirements: 5 total (5 mapped to phases 11-14)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-11-16*  
*Last updated: 2026-11-16 for Milestone v1.1*
