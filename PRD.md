# PRD: WHITESPACE App Demo, Contextual Guide (Ctrl+S+D+F), and Feature Diagnostics

## Objective
Deliver an interactive, whole-app Demo & Guidance system with easy instructions for every page and tool, accessible via the universal shortcut `Ctrl+S+D+F` (plus on-screen trigger), and a comprehensive Feature Diagnostics and Test Suite that audits every feature in the application, determining how many work, how many require external credentials, and ensuring zero broken features.

## Strict Design & Architecture Constraints
- Strict monochrome palette (`#000000`, `#0A0A0A`–`#171717`, `#262626`–`#404040`, `#FFFFFF`).
- Zero emojis: Use geometric typographic badges and crisp inline Lucide SVGs only.
- Dual-target parity: Works seamlessly on both web browser and Windows Electron desktop runtime.
- High performance: Sub-millisecond response, zero layout shift.

---

## Discrete Task Breakdown

### Task 1: Shortcut Listener & Demo Guide Shell Architecture
- Implement robust keyboard listener for `Ctrl+S+D+F` (supporting both simultaneous key holding and fast chord sequences).
- Add sleek monochrome HUD/TopBar trigger button `GUIDE [CTRL+S+D+F]`.
- Implement `AppGuideModal.tsx` modal shell with tabbed navigation: Contextual Page Guide, All Views Explorer, Feature Diagnostics & Health Audit, and Interactive Walkthroughs.

### Task 2: Page-by-Page Interactive Instructions & Guides
- Author comprehensive, crystal-clear instructions for every page and view:
  1. `editor`: Slash commands `/`, 10-format file ingestion, markdown rendering, RAG indexing.
  2. `kanban`: 3-column backlog, P0-P2 priorities, drag-and-drop, 1-click Dispatch AI.
  3. `browser`: 5 developer tools (Web Viewport, GitHub Explorer, Code Sandbox, Vector Board, REST Tester), Private vs Team-Shared tabs.
  4. `stage`: 510 kbps WebRTC studio stage, 0-200% GainNode boost, FFT spectrum analyzer, hardware mic pod.
  5. `copilot`: Member-isolated chat, SOUL.MD grounding, RAG context assembly, 3D assistant (WHITE).
  6. Modals: Space Manager, Member Manager, SOUL.MD Editor, RAG Inspector, Model Discovery, Cloud Sync, Workspace Exporter.
- Include 1-click "Live Demo Actions" (e.g. Load Demo Document, Populate Sample Tasks, Simulate Audio Spectrum, Launch Sandbox Example) that let users immediately experience the feature in action.

### Task 3: In-App Feature Diagnostics Engine (`featureAudit.ts`) & Live Test Tab
- Build `featureAudit.ts` testing all 25 core application capabilities:
  - Space Management
  - Member Isolation
  - SOUL.MD Injection
  - Document Parser (10 formats)
  - Slash-Command Editor
  - Local RAG Tokenizer & Index
  - Local RAG Semantic Querying
  - OpenClaw Kanban Board
  - 1-Click Dispatch AI Pipeline
  - Multi-Tab Browser Engine
  - Private vs Shared Tab Isolation
  - Code Sandbox Execution
  - Vector Architecture Canvas
  - REST API Tester (Hoppscotch-Lite)
  - GitHub Explorer Tool
  - Web Audio Context & GainNode
  - WebRTC Stage & Signaling
  - 60fps Audio Visualizer Canvas
  - Three.js 3D Assistant Canvas
  - Prompt Assembler
  - Gemini REST Client
  - Firebase Cloud Sync Engine
  - Workspace Exporter & Bridge
  - Command Palette (Ctrl+K)
  - Guide Shortcut Engine (Ctrl+S+D+F)
- Provide exact breakdown of: Working vs External Key Required vs Failed.
- Integrate into the Demo Modal as a live interactive Test Runner tab with 1-click "RUN ALL TESTS" and JSON export.

### Task 4: Command-Line Test Suite (`test/test_all_features.mjs`)
- Author comprehensive headless test script testing all core algorithms, parsers, engines, RAG indexing, prompt assembly, and export generators in Node.js.
- Ensure automated CI/CD validation without requiring browser DOM.

### Task 5: Feature Bug Fixes & Optimization
- Review and fix any discovered runtime issues or broken states in developer tools, drag-and-drop, or export pipelines to ensure 100% operational status.

### Task 6: Final Verification, Zero-Emoji Enforcement & Ralph Loop Completion
- Run `npm run build` (TypeScript + Vite).
- Run `node test/verify_system.mjs` and `node test/test_all_features.mjs`.
- Verify zero emoji violations across all newly created and updated files.
- Document exact feature test results in `progress.txt` and append `RALPH_COMPLETE`.
