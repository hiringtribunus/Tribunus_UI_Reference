# Feature 06 — Tribunus AI Chat UI Template (No Agent)

## Objective
Implement the **Tribunus AI** page as a ChatGPT-like UI **without any real AI backend**.
Requirements:
- Chat thread UI (user + assistant bubbles)
- Bottom input composer (textarea + send button)
- **Project selector** (dropdown) to scope context
- **Mode toggles** (Council Reports / Web / News) — UI-only
- Placeholder assistant responses (deterministic templates)
- Optional streaming-like typing animation (fake) for realism (UI-only)
- Persist chat history per project + mode locally (Supabase optional; default localStorage)

---

## Part A — Routing

### A1) Route
Create:
- `app/ai/page.tsx`

Server component responsibilities:
- Fetch projects list for Project dropdown (id + name)
- Render client UI container with projects list

---

## Part B — Data Model (MVP)

### B1) Local storage persistence (default)
Persist chat sessions in `localStorage`:
- key: `tribunus_chat_v1`
- structure:
```ts
type ChatMode = "council_reports" | "web" | "news";
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string; // ISO
};
type ChatSession = {
  projectId: string | "none";
  mode: ChatMode;
  messages: ChatMessage[];
  updatedAt: string; // ISO
};
type ChatStore = {
  sessions: ChatSession[];
};
Rules:

session identity = (projectId, mode)

switching project or mode loads the matching session’s messages

if none exists, start empty with a one-time assistant “welcome” message

B2) Optional Supabase persistence (DO NOT implement now)
Do not add DB tables in this feature. UI must be built so it can later be swapped to server persistence.

Part C — UX: ChatGPT-like Layout
C1) Page structure
Header row (within main content):

Left: Tribunus AI title + small subtitle

Right: Project dropdown + mode toggles

Chat thread area:

scrollable, fills remaining height

messages centered with max width (e.g. 800–900px)

Composer at bottom:

sticky within the page (not the whole app)

textarea auto-grow (1–6 lines)

send button, enter-to-send (shift+enter for newline)

C2) Visual style requirements
Clean white background

Subtle separators/borders

Rounded message bubbles (assistant lightly tinted, user slightly stronger)

No heavy shadows

Smooth scroll to newest message

Show timestamps only on hover (optional)

Part D — Project Selector
D1) Dropdown behavior
Component: components/ai/ProjectContextSelector.tsx (client)

Options:

None (General) with value "none"

All projects from DB

Selecting a project changes session context immediately:

load messages for selected project + current mode

update URL query param:

?projectId=<uuid|none>&mode=<mode>

use router.replace() to preserve shareable state

Part E — Mode Toggles
E1) Mode buttons
Component: components/ai/ModeToggle.tsx
Modes:

Council Reports (council_reports) — primary emphasis

Web (web)

News (news)

Behavior:

Selecting mode switches session (same projectId, different mode)

URL param updates mode

UI indicates active mode (filled pill / subtle background)

Part F — Chat Thread
F1) Chat container
Component: components/ai/ChatThread.tsx

Props:

messages

Renders:

MessageBubble per message

Auto-scroll:

whenever a new message is appended, scroll to bottom

avoid stealing scroll if user scrolled up (optional MVP behavior: always scroll)

F2) Message bubble
Component: components/ai/MessageBubble.tsx

Role-based styling:

user: right aligned

assistant: left aligned

Support basic markdown rendering (optional):

If implemented: use a safe markdown renderer with no HTML

Otherwise plain text with newline support

Part G — Composer (Input)
G1) Composer component
Component: components/ai/ChatComposer.tsx
Props:

onSend(message: string)

isSending (for fake typing state)

Behavior:

Enter sends; shift+enter newline

Disable send on empty/whitespace

Show small hint: Enter to send • Shift+Enter for new line

Part H — Placeholder “Assistant” Logic (No Agent)
H1) Deterministic response templates
Create lib/ai/placeholders.ts with:

ts
Copy code
export function buildPlaceholderResponse(args: {
  mode: ChatMode;
  projectName?: string;
  message: string;
}): string;
Response must:

Acknowledge project context:

If project selected: Context: <Project Name>

If none: Context: General

Acknowledge mode:

Council Reports / Web / News

Provide a helpful “next steps” scaffold without claiming real search:

Council Reports mode: asks for source URLs or says “connect agent later”

Web/News: says “web/news connector will be enabled later”

Keep responses short and structured.

Required templates

Council Reports mode:

bash
Copy code
Council Reports Agent (placeholder)
Context: <ProjectName>
I can answer once council report sources are connected.
For now, paste a council agenda/report link and tell me what you’re trying to decide (e.g., rezoning risk, height/FSR, parking variances).
Web mode:

sql
Copy code
Web Search (placeholder)
Context: <ProjectName>
Web search will be enabled soon. For now, paste a URL or describe what you want to verify.
News mode:

mathematica
Copy code
News (placeholder)
Context: <ProjectName>
News search will be enabled soon. For now, paste an article URL or the headline.
H2) Fake streaming (optional but recommended)
Implement a “typing” effect:

When user sends:

append user message immediately

set isSending=true

after 300–600ms, append assistant message

optionally reveal assistant content character-by-character (timer) for 1–2s

Ensure user can type while assistant “typing”

Provide “Stop” button (optional MVP) that instantly completes rendering

Part I — Session Management
I1) Session store utility
Create lib/ai/chatStore.ts:

loadStore(): ChatStore

saveStore(store: ChatStore): void

getSession(projectId, mode): ChatSession (creates if missing)

appendMessage(projectId, mode, msg): ChatSession

clearSession(projectId, mode): void (optional)

I2) One-time welcome message
When a session is created:

Insert assistant message:

Hi — select a project and a mode to start. This is a UI template; the agent will be connected later.

I3) Clear chat
Add a button in header area:

Clear chat

Clears current session messages and re-adds welcome message

Confirm via AlertDialog

Part J — Page Container Implementation
J1) Client container
Create app/ai/TribunusAIClient.tsx:
Responsibilities:

Read searchParams for initial:

projectId default "none"

mode default "council_reports"

Manage:

activeProjectId

activeMode

messages

isSending

On context change:

load session messages from localStorage store

On send:

append user message

generate placeholder response and append assistant message

persist to store after each append

Part K — Files to Create / Modify
Create
app/ai/page.tsx

app/ai/TribunusAIClient.tsx

components/ai/ProjectContextSelector.tsx

components/ai/ModeToggle.tsx

components/ai/ChatThread.tsx

components/ai/MessageBubble.tsx

components/ai/ChatComposer.tsx

lib/ai/types.ts

lib/ai/chatStore.ts

lib/ai/placeholders.ts

Modify
Sidebar nav: ensure /ai points to Tribunus AI page

Part L — Modular Execution Checklist (AI Agent Tasks)
L1) Routing + base page
 Create app/ai/page.tsx and render client container

 Fetch projects list for dropdown

L2) State + URL params
 Implement URL param parsing + router.replace() updates

 projectId + mode are shareable

L3) Local storage store
 Implement chat store helpers

 Create sessions per (projectId, mode)

 Implement clear session

L4) UI components
 Selector + mode toggles

 Chat thread + message bubbles

 Composer with enter-to-send

L5) Placeholder responses + fake typing
 Deterministic templates per mode

 Optional streaming/typing animation

L6) QA
 Switching projects loads different history

 Switching modes loads different history

 URL refresh preserves selection and messages

 Clear chat works per session

 No backend calls besides reading projects list

Acceptance Criteria
/ai renders a ChatGPT-like UI with project dropdown + mode toggles.

Sending a message appends a placeholder assistant response (mode-aware, project-aware).

Messages persist per project + mode via localStorage and survive refresh.

No real agent backend or web/news retrieval is implemented.