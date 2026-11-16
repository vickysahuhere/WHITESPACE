# Feature Research

**Domain:** Autonomous AI Workspace OS & Native Desktop Application
**Researched:** 2026-11-16
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Multi-Space Knowledge Base | Isolates distinct projects and domain contexts (*White Collars Core*, *SignBridge*, *Mai-Reads*) | MEDIUM | Must support Space creation, switching, editing, deleting, and persistent storage |
| Notion-Style Document Editor | Modern knowledge workers demand distraction-free live editing with slash commands | MEDIUM | Supports `/H2`, `/TODO`, `/CODE`, `/TABLE`, `/AI-SYNTHESIZE`, and file uploads (`.md`, `.txt`, `.json`, `.py`, `.ts`, etc.) |
| Multi-Member Session Switcher | Team members need dedicated workspace identities without logging in and out constantly | LOW | Pre-configured slots for `Vicky Sahu`, `Arnav Suryavanshi`, `Lakshay Arora`, `Shiwant Goyal` + `+` add user |
| Strict Chat History Isolation | Confidentiality: users must never see each other's private AI conversations | MEDIUM | Partitioned by `userId` and `spaceId` (`chatsByUser[userId][spaceId]`) with zero cross-contamination |
| Multi-Tab Developer Browser | Embedded browsing reduces context switching away from the workspace | MEDIUM | Tabs with URL navigation, reload, back/forward, and dev tools |
| 3-Column Mission Control Kanban | Visual tracking of engineering specs and autonomous execution pipeline | MEDIUM | Columns: `01 // QUEUED SPECS`, `02 // ACTIVE AGENT LOOP`, `03 // VERIFIED & SHIPPED` with `P0`/`P1`/`P2` badges |
| Gemini API Top-Bar Wiring | Instant activation without burying keys in deep settings dialogs | LOW | Top-bar single input: paste Gemini API key, press `Enter` or click `LINK`, immediately unlocks AI |
| Desktop App Packaging | Native desktop feel, system tray, frameless styling, and executable installer | HIGH | Electron 34+ wrapper, `LAUNCH_WINDOWS_APP.bat`, `BUILD_EXE_INSTALLER.bat`, `launch_fedora.sh` |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Sub-Millisecond Local RAG | In-memory tokenized indexing provides instantaneous context retrieval without server round-trips | HIGH | In-memory chunking over Space docs, `SOUL.MD`, OpenClaw tasks, and shared browser tabs |
| Per-Space `SOUL.MD` Engine | Persistent system instructions injected into every AI query and workspace export | MEDIUM | Shapes AI tone, persona, and technical domain constraints per Space |
| Selective Per-Tab Sharing | Solves the privacy vs. collaboration dilemma in developer browsing | MEDIUM | Default `PRIVATE (ONLY ME)`. One-click toggle to `SHARED WITH TEAM` mirrors to teammates' shared strip |
| Built-in Developer Suite (GitHub OSS, Sandbox, Vector Board, REST Tester) | Complete developer workspace without external tool bloat | HIGH | GitHub repo search + CDN links; HTML/CSS/JS sandbox; Excalidraw-style node canvas; Hoppscotch-lite REST client |
| Embedded Web Viewport with `INDEX TO SPACE` | Instantly snapshots external web documentation and API references into Space Docs | MEDIUM | Extracts text/markdown from active web tab and embeds it directly into current Space Knowledge Base |
| Uncompressed WebRTC Stage (510 kbps Opus) | Studio-grade broadcast audio quality (48 kHz stereo Opus) bypassing chat compression caps | HIGH | Custom SDP negotiation: `maxaveragebitrate=510000;stereo=1;cbr=1;useinbandfec=1` |
| Hardware Audio Pod with FFT Visualizer | Professional audio controls: 0–200% GainNode boost, loopback monitor, real-time dB & spectrum canvas | MEDIUM | Web Audio API nodes with live 60fps canvas rendering |
| 60fps Screen Sharing (1080p, 1440p, 4K) | Crystal-clear code and design streaming up to 25 Mbps | HIGH | Supported via `b=AS:25000` SDP bandwidth override |
| One-Click Kanban `DISPATCH AI` | Moves tasks directly into autonomous AI execution drawer with full Space RAG context | MEDIUM | Right-docked AI Copilot drawer runs task, streams reasoning, and updates card state |
| Google Antigravity & PC Bridge (`wc_bridge.py`) | Bridges cloud/workspace state with local PC agent workflows (Google Antigravity, Cursor, CLI) | MEDIUM | One-click `context.md` bundle download + standalone Python script for local folder synchronization |
| Reactive 3D Assistant (`WHITE`) | Sleek geometric monochrome sphere or sculpted "W" wireframe with audio reactivity | MEDIUM | Three.js WebGL canvas responding to speech frequencies and AI generation states |
| Electron X-Frame/CSP Stripper | Overcomes iframe blocking, allowing any external website or documentation to render inline | HIGH | Intercepts HTTP headers in Electron session layer and removes `X-Frame-Options` and restrictive `frame-ancestors` |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Emojis in UI or Badges | Often used for quick casual visual categorization | Breaks the strict White Collars monochrome discipline; looks childish and cluttered | Crisp geometric typography (`WC`, `SB`, `MR`), monochrome inline SVGs, and status dots |
| Heavy External Vector Database (Pinecone, Weaviate) | Common for multi-gigabyte corporate enterprise RAG | Requires external API keys, adds network latency, increases failure points and costs | Blazing in-memory cached token/cosine index with `< 1 ms` query latency |
| Generic Glassmorphism & Rainbow Gradients | Popular in generic AI concept designs | Distracting, reduces contrast, causes GPU lag during video calls and 60fps screen share | High-contrast monochrome palette (`#000000`, `#0A0A0A`, `#171717`, `#262626`, `#FFFFFF`) |
| Placeholder / Stubbed Action Buttons | Fast to prototype | Violates core contract; causes user frustration when features fail silently | Every button is functional and wired to real state machines or local storage |

## Feature Dependencies

```
[Space Knowledge Base] ──────provides context───> [Sub-ms Local RAG]
       │                                                 │
       ├──contains──> [SOUL.MD]                          └──feeds──> [AI Copilot & Kanban Dispatch]
       │                                                                      │
       └──contains──> [Space Docs & Live Editor]                              │
                               │                                              │
[Embedded Browser Tabs] ───────┼───INDEX TO SPACE snapshot───────────────────┘
       │                       │
       └──toggle SHARED──> [Team Shared Tabs Strip]
                               │
[Multi-Member Switcher] ───────┴───partitions───> [Isolated Chat Histories & Personal Profiles]

[Web Audio Context] ───────────powers───────────> [FFT Spectrum Visualizer & 3D Assistant WHITE]
       │
       └──boosts──> [WebRTC Stage (510 kbps Opus)]
```

### Dependency Notes

- **Local RAG requires Space Docs, SOUL.MD, and Tasks:** The in-memory cache aggregates all text nodes within the active space (or all spaces) to serve immediate similarity lookups.
- **AI Copilot requires Gemini API Key & Personal Profile:** Injects the active member's role and system instructions combined with Space `SOUL.MD` and retrieved RAG context.
- **WebRTC Stage requires AudioContext:** Hardware GainNode boost and microphone stream feeding the uncompressed RTCPeerConnection and FFT visualizer.
- **Electron Desktop Wrapper enhances Browser Tabs:** Stripping frame headers in Electron unlocks external websites that would otherwise block `iframe` embedding on the web version.

## MVP Definition

### Launch With (v1)

- [ ] Strict monochrome UI shell with Discord rail, Notion sidebar, and OpenClaw task drawer
- [ ] Top-bar Gemini API Key input with live verification and model discovery
- [ ] Multi-Space manager with persistent `SOUL.MD` and live Notion-style document editor
- [ ] In-memory Local RAG engine with `< 1 ms` retrieval across spaces
- [ ] Multi-member switcher (4 pre-configured WHITERs + add user) with strictly isolated chats
- [ ] 3D Reactive geometric assistant (`WHITE`) rendered in Three.js
- [ ] Multi-tab browser with selective per-tab sharing (`PRIVATE` vs `SHARED`)
- [ ] Developer tool suite: GitHub OSS explorer, Code Sandbox, Vector Architecture Board, REST API client
- [ ] Embedded web viewport with `INDEX TO SPACE` documentation snapshotting
- [ ] Uncompressed WebRTC Stage (48 kHz 510 kbps Opus, GainNode boost 0-200%, loopback monitor, FFT canvas visualizer)
- [ ] 60fps high-bitrate screen and video streaming (1080p, 1440p, 4K SDP override)
- [ ] OpenClaw Kanban pipeline with one-click `DISPATCH AI` into right-docked AI Copilot drawer
- [ ] Cloud Firestore sync (Firebase Spark tier) and invite-only auth
- [ ] Desktop/Antigravity bridge (`context.md` bundle download, full JSON backup/restore, auto-generated `wc_bridge.py`)
- [ ] Electron native Windows wrapper (`main.js`, `preload.js`, `LAUNCH_WINDOWS_APP.bat`, `BUILD_EXE_INSTALLER.bat`, `launch_fedora.sh`)

---
*Feature research for: White Collars (WHITESPACE) // Autonomous Workspace OS*
*Researched: 2026-11-16*
