# Pitfalls Research

**Domain:** Autonomous AI Workspace OS & Native Desktop Application
**Researched:** 2026-11-16
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: External Iframe Anti-Framing (`X-Frame-Options` & CSP)

**What goes wrong:**
When users attempt to load external documentation or web apps inside the OSS Browser, external servers return `X-Frame-Options: SAMEORIGIN` or `Content-Security-Policy: frame-ancestors ...`, causing the browser to refuse to display the iframe with a blank screen error.

**Why it happens:**
Standard web security policies protect external banking and web applications from clickjacking attacks. However, in a dedicated developer workspace OS, this blocks legitimate developer reference sites.

**How to avoid:**
- In the **Electron Desktop Runtime**, intercept all web requests in `main.cjs` using `session.defaultSession.webRequest.onHeadersReceived` and strip `x-frame-options`, `content-security-policy`, and `frame-options` response headers for child webviews/iframes.
- In the **Pure Web Browser Mode**, detect frame rejection, provide clear messaging, and provide an instant **READER SNAPSHOT** or direct open action with the **INDEX TO SPACE** documentation ingestor.

**Warning signs:**
Console errors: `Refused to display ... in a frame because it set 'X-Frame-Options' to 'sameorigin'`.

**Phase to address:**
Phase 4 (OSS Browser & Dev Suite) and Phase 8 (Electron Desktop Runtime).

---

### Pitfall 2: WebRTC Opus Stereo & Quality Cap Throttling

**What goes wrong:**
WebRTC defaults to a low-bitrate mono voice configuration (around 24–32 kbps with heavy dynamic range compression and low-pass filtering at 8 kHz), destroying high-fidelity sound, music sharing, and studio-grade voice.

**Why it happens:**
Chromium's default WebRTC profile assumes standard telephone conferences and aggressively conserves bandwidth unless specifically overridden in the SDP (Session Description Protocol).

**How to avoid:**
- Mutate the SDP offer and answer strings prior to `setLocalDescription` and `setRemoteDescription`:
  ```javascript
  sdp = sdp.replace(/a=fmtp:111 ((?:(?!minptime).)*)\r\n/g,
    'a=fmtp:111 $1;stereo=1;sprop-stereo=1;maxaveragebitrate=510000;cbr=1;useinbandfec=1\r\n');
  ```
- Add `b=AS:510` for audio bandwidth and `b=AS:25000` for 4K 60fps screen share channels.
- Configure `getUserMedia` with `echoCancellation: false`, `noiseSuppression: false`, `autoGainControl: false` when in Studio / Hardware Bypass mode.

**Warning signs:**
Muffled audio, loss of stereo panning, audio cuts during high-frequency speech or background instruments.

**Phase to address:**
Phase 5 (Uncompressed WebRTC Stage & Audio Pod).

---

### Pitfall 3: Web Audio Autoplay Policy & 200% Gain Distortion

**What goes wrong:**
The Web Audio `AudioContext` starts in a `suspended` state if initialized before user interaction. Additionally, boosting user microphone gain up to 200% (`gainNode.gain.value = 2.0`) can cause harsh digital clipping and acoustic distortion.

**Why it happens:**
Modern browsers require a user gesture (click/keypress) before allowing audio playback. Multiplying raw PCM audio buffers beyond 1.0 (0 dBFS) without limiting pushes waveform peaks into flat-topped square waves.

**How to avoid:**
- Always bind `audioContext.resume()` to the first click on the `MIC ON`, `MUTE`, or `STAGE` controls.
- Insert a native `DynamicsCompressorNode` immediately after the `GainNode` with threshold `-1dB`, knee `12`, and ratio `12` to ensure clean analog-style soft limiting when boosted to 200%.

**Warning signs:**
`The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture` in console; crackling audio when speaking loudly.

**Phase to address:**
Phase 5 (Uncompressed WebRTC Stage & Audio Pod).

---

### Pitfall 4: Three.js WebGL Context Leaks & Battery Drain

**What goes wrong:**
Three.js animation loops (`requestAnimationFrame`) continue executing at 60fps in the background even when the 3D assistant is hidden, burning GPU cycles and causing video frame drops during 60fps screen sharing.

**Why it happens:**
Render loops detached from React component lifecycles never stop unless explicitly cancelled.

**How to avoid:**
- Maintain an active render flag in `useRef`; cancel the animation frame loop whenever the 3D assistant is toggled off or hidden.
- Call `.dispose()` on geometries, materials, and textures when unmounting.

**Warning signs:**
High CPU/GPU usage when idling; fans spinning up on laptops.

**Phase to address:**
Phase 3 (User Personalization & 3D Assistant).

---

### Pitfall 5: Synchronous Local RAG Freezing Main Thread

**What goes wrong:**
Tokenizing large source files (.py, .ts, .json, .md) synchronously during RAG indexing causes noticeable UI stutter and keyboard lag in the Notion document editor.

**Why it happens:**
JavaScript execution runs on the single main UI thread. Heavy string splitting, regex matching, and TF-IDF matrix computations over 50KB+ files block DOM updates.

**How to avoid:**
- Maintain an incremental in-memory inverted index: chunk documents on save/upload rather than on every query.
- Use lightweight tokenization (alphanumeric trigrams or term dictionaries) with pre-computed inverse document frequencies.
- Query matching executes in `< 1 ms` over in-memory sparse vectors.

**Warning signs:**
Dropped frames while typing in the document editor or switching spaces.

**Phase to address:**
Phase 2 (Multi-Space Knowledge Base & Local RAG).

---

### Pitfall 6: Firebase Spark Free Tier Quota Exhaustion

**What goes wrong:**
Saving documents to Cloud Firestore on every keystroke quickly exceeds the Spark free tier's 20,000 writes/day quota within an hour of active editing.

**Why it happens:**
Naive two-way data binding triggers write operations on every character change.

**How to avoid:**
- Use a 1500ms debounce timer on Firestore persistence.
- Store immediate state in `localStorage` for sub-millisecond persistence and offline resilience; sync to Firestore in the background.

**Warning signs:**
Firestore error `RESOURCE_EXHAUSTED: Quota exceeded`.

**Phase to address:**
Phase 7 (Gemini API & Firebase Cloud Sync).

---
*Pitfalls research for: White Collars (WHITESPACE) // Autonomous Workspace OS*
*Researched: 2026-11-16*
