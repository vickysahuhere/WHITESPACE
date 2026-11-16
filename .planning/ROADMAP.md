# Roadmap: White Collars (WHITESPACE) // Autonomous Workspace OS

## Overview

White Collars (WHITESPACE) is built as a complete, high-speed, multi-platform AI Workspace, Native Desktop Application, and Phone Companion. The roadmap follows a Vertical MVP progression:
- **Milestone v1.0**: Core Autonomous Workspace OS, Desktop Packaging & Web Parity (Phases 1–10, Completed).
- **Milestone v1.1**: Mobile Companion Phone App for AI Bot & Studio Stage (Phases 11–14, Active).

## Milestone v1.0 Phases (Completed)

- [x] **Phase 1: Monochrome Design Foundation & Triple-Paradigm Shell** - Strict black-and-white theme tokens, Discord space rail, Notion navigation, top-bar Gemini bar, audio pod, and CTRL+K palette.
- [x] **Phase 2: Multi-Space Knowledge Base, SOUL.MD & Live Document Editor** - Multi-space management, persistent per-space SOUL.MD, multi-format file ingestion, and Notion-style slash-command editor.
- [x] **Phase 3: Sub-Millisecond In-Memory Local RAG Engine** - Client-side incremental chunking and token index providing < 1 ms similarity search across active or all spaces.
- [x] **Phase 4: User Personalization, Chat Isolation & 3D Assistant (WHITE)** - 4-member session switcher + add user, strictly isolated chat histories, personal AI profiles, and reactive Three.js 3D assistant.
- [x] **Phase 5: Multi-Tab OSS Browser & Selective Tab Sharing** - Embedded multi-tab browser with per-tab privacy (PRIVATE vs SHARED), Team Shared Tabs strip, and web viewport with INDEX TO SPACE.
- [x] **Phase 6: Built-in Developer Suite (GitHub OSS, Sandbox, Vector Board, REST Tester)** - GitHub repo search with CDN links, monochrome live code sandbox, interactive vector architecture canvas, and Hoppscotch-lite REST client.
- [x] **Phase 7: Uncompressed Studio WebRTC Stage & Hardware Audio Pod** - 48 kHz 510 kbps stereo Opus stage, 0–200% GainNode boost with soft limiter, live FFT spectrum canvas, 4K60 screen share, and BroadcastChannel/SDP signaling.
- [x] **Phase 8: OpenClaw Mission Control Kanban & Right-Docked AI Copilot** - 3-column task pipeline with one-click DISPATCH AI into right-docked AI Copilot drawer with RAG grounding.
- [x] **Phase 9: Google Gemini Direct REST, Firebase Cloud Sync & Antigravity Bridge** - Direct Gemini REST with model discovery, Firebase Spark Firestore sync with invite-only auth, context.md download, and auto-generated wc_bridge.py.
- [x] **Phase 10: Electron Native Desktop Packaging & Cross-Platform Launchers** - Electron 34+ wrapper with CSP/X-Frame-Options stripper, LAUNCH_WINDOWS_APP.bat, BUILD_EXE_INSTALLER.bat (portable .exe), and full dual web/desktop verification.

## Milestone v1.1 Phases: Mobile Companion (Active)

- [ ] **Phase 11: Mobile Companion Shell & Progressive Web App (PWA)** - Touch-first mobile viewport (`< 768px`) with safe-area padding, minimal monochrome mobile header, bottom dock navigation (`[AI BOT]` / `[STAGE]`), and installable PWA manifest with service worker.
- [ ] **Phase 12: Mobile AI Bot Interface & Touch 3D Assistant** - Full-screen mobile chat view with thumb-reachable input, streaming Gemini REST, Space RAG grounding chips, and mobile-optimized 3D/Canvas audio-reactive assistant sphere.
- [ ] **Phase 13: Mobile Studio WebRTC Stage & Touch Audio Pod** - Uncompressed 48 kHz stereo Opus calling on phones, touch audio controls (1-tap mute, loopback monitor, earpiece/speaker switch, 0-200% GainNode boost), and 60fps compact Canvas FFT visualizer.
- [ ] **Phase 14: Mobile Android Packaging & Physical Device Verification** - Capacitor Android configuration, `BUILD_ANDROID_APK.bat` packaging script producing installable `.apk`, and comprehensive mobile touch verification.

---

## Phase Details: Milestone v1.1

### Phase 11: Mobile Companion Shell & Progressive Web App (PWA)
**Goal**: Build the touch-first responsive mobile companion shell with bottom dock navigation toggling between AI Bot and Studio Stage, safe-area-insets, and installable PWA support.
**Mode**: mvp
**Depends on**: Phase 10
**Requirements**: MOB-01, MOB-02
**Success Criteria** (what must be TRUE):
  1. Application automatically detects mobile viewports (`< 768px`) and renders the lightweight mobile companion shell instead of the heavy desktop Discord/Notion sidebars.
  2. Bottom dock navigation provides instantaneous switching between `[AI BOT]` and `[STAGE]` with tactile feedback and active indicator.
  3. Mobile layout respects device safe-area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) with zero horizontal overflow or clipping.
  4. PWA manifest (`manifest.json`), service worker, and mobile meta tags enable 1-tap "Add to Home Screen" standalone execution on iOS Safari and Android Chrome.
**Plans**: 2 plans

Plans:
- [ ] 11-01: Build touch-first mobile shell with responsive breakpoint hook, safe-area layout, mobile topbar, and bottom navigation dock.
- [ ] 11-02: Configure PWA manifest (`manifest.json`), service worker registration, and standalone mobile app icons.

### Phase 12: Mobile AI Bot Interface & Touch 3D Assistant
**Goal**: Deliver a full-screen, thumb-friendly mobile chat interface with direct Gemini REST streaming, Space RAG grounding, and mobile-optimized audio-reactive assistant.
**Mode**: mvp
**Depends on**: Phase 11
**Requirements**: MOB-03
**Success Criteria** (what must be TRUE):
  1. Full-screen mobile chat view renders message bubbles cleanly with high readability and thumb-reachable bottom composer input.
  2. Streaming Gemini REST responses render in real time with sub-second time-to-first-token.
  3. Space RAG context chips display matched knowledge without cluttering mobile screens.
  4. Lightweight mobile Three.js / Canvas 3D assistant sphere responds to touch dragging and live audio modulation.
**Plans**: 2 plans

Plans:
- [ ] 12-01: Build full-screen mobile chat view with thumb-reachable input, streaming Gemini REST, and Space RAG grounding chips.
- [ ] 12-02: Build mobile-optimized 3D assistant / 60fps reactive canvas sphere with touch gesture rotation and space selector.

### Phase 13: Mobile Studio WebRTC Stage & Touch Audio Pod
**Goal**: Deliver uncompressed 48 kHz stereo Opus calling on phone screens with touch audio controls (1-tap mute, loopback, earpiece/speaker switch, 0-200% GainNode boost) and 60fps mobile Canvas visualizer.
**Mode**: mvp
**Depends on**: Phase 12
**Requirements**: MOB-04
**Success Criteria** (what must be TRUE):
  1. WebRTC stage establishes peer connection on mobile browsers and native webviews with 48 kHz stereo Opus audio.
  2. Touch audio pod controls provide 1-tap hardware mute, live loopback monitor, and 0-200% GainNode boost slider.
  3. Mobile HTML5 Canvas renders 60fps real-time FFT frequency spectrum bars without battery drain or thermal throttling.
  4. Phone stage view cleanly displays active speakers, camera video tiles, and screen shares with pinch/zoom support.
**Plans**: 2 plans

Plans:
- [ ] 13-01: Adapt Web Audio API pipeline for mobile devices: microphone permission handling, 0-200% gain slider, loopback monitor, and earpiece/speaker output toggle.
- [ ] 13-02: Build mobile stage view with touch participant cards, video/screen viewer, and 60fps compact Canvas FFT audio meter.

### Phase 14: Mobile Android Packaging & Physical Device Verification
**Goal**: Configure Capacitor Android container and author `BUILD_ANDROID_APK.bat` packaging script producing installable `.apk` for Android physical devices, followed by full mobile verification.
**Mode**: mvp
**Depends on**: Phase 13
**Requirements**: MOB-05
**Success Criteria** (what must be TRUE):
  1. Capacitor Android project configuration set up with audio/camera/mic permissions in AndroidManifest.xml.
  2. `BUILD_ANDROID_APK.bat` compiles the web bundle and builds a release/debug Android `.apk`.
  3. Mobile audit verifies touch targets (minimum 44x44px), strict monochrome aesthetic, zero emojis, and dual PWA/APK execution.
**Plans**: 2 plans

Plans:
- [ ] 14-01: Configure Capacitor Android runtime (`capacitor.config.ts`, AndroidManifest.xml) and create `BUILD_ANDROID_APK.bat`.
- [ ] 14-02: Run mobile system verification audit and confirm zero emojis, high-speed execution, and touch UX excellence.

---

## Progress

**Execution Order:**
Milestone v1.0 (Phases 1–10: Complete) → Milestone v1.1 (Phases 11–14: In Progress)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Monochrome Design Foundation & Triple-Paradigm Shell | 3/3 | Completed | 2026-11-16 |
| 2. Multi-Space Knowledge Base, SOUL.MD & Live Document Editor | 3/3 | Completed | 2026-11-16 |
| 3. Sub-Millisecond In-Memory Local RAG Engine | 2/2 | Completed | 2026-11-16 |
| 4. User Personalization, Chat Isolation & 3D Assistant (WHITE) | 3/3 | Completed | 2026-11-16 |
| 5. Multi-Tab OSS Browser & Selective Tab Sharing | 2/2 | Completed | 2026-11-16 |
| 6. Built-in Developer Suite | 3/3 | Completed | 2026-11-16 |
| 7. Uncompressed Studio WebRTC Stage & Hardware Audio Pod | 3/3 | Completed | 2026-11-16 |
| 8. OpenClaw Mission Control Kanban & Right-Docked AI Copilot | 2/2 | Completed | 2026-11-16 |
| 9. Google Gemini Direct REST, Firebase Cloud Sync & Antigravity Bridge | 3/3 | Completed | 2026-11-16 |
| 10. Electron Native Desktop Packaging & Cross-Platform Launchers | 3/3 | Completed | 2026-11-16 |
| 11. Mobile Companion Shell & Progressive Web App (PWA) | 0/2 | Not started | - |
| 12. Mobile AI Bot Interface & Touch 3D Assistant | 0/2 | Not started | - |
| 13. Mobile Studio WebRTC Stage & Touch Audio Pod | 0/2 | Not started | - |
| 14. Mobile Android Packaging & Physical Device Verification | 0/2 | Not started | - |

---
*Roadmap generated: 2026-11-16*  
*Last updated: 2026-11-16 for Milestone v1.1*
