# Phase 04-02 Summary: AI Prompt Assembler & Isolated ChatView

## Deliverables
1. **Prompt Assembly Service** (`src/services/promptAssembler.ts`):
   - Combines 4 structured contexts into master system prompts:
     1. Space Master Directives (`SOUL.MD`)
     2. Active Member Identity (Role, Hardware/Environment Stack, Personal Directives)
     3. Retrieved Local RAG Chunks (vector relevance grounding)
     4. Operational Discipline (strict monochrome, zero emojis, exact code)
   - Function `inspectPromptBreakdown`: calculates tokens, characters, and section-by-section breakdown for inspection.
2. **Dedicated Chat / Copilot View** (`src/components/chat/ChatView.tsx`):
   - User identity header with active member badge, name, role, and space badge.
   - Strictly isolated thread loading from `ChatContext.getMessages(activeMember.id, activeSpace.id)`.
   - Dual execution engine: client-side fetch to Gemini REST API `gemini-2.5-flash` when key is linked, and high-speed autonomous fallback engine with RAG grounding when offline.
   - Clickable RAG reference pills displaying source documents and similarity scores.
   - "INSPECT ASSEMBLED PROMPT" modal showing live token count and section breakdowns.
   - Session markdown exporter and clear conversation button.
3. **MainLayout Integration** (`src/components/layout/MainLayout.tsx`):
   - Mounted `ChatView` when `activeView === 'copilot'`.

## Verification
- `npm run build`: Zero errors, production bundle compiled.
- Zero-emoji scan: Confirmed 0 emojis across `src/`.
- Requirements satisfied: **USR-03** (personal AI profile injected into Gemini queries).
