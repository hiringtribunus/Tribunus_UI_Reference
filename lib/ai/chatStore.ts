import type { ChatStore, ChatSession, ChatMessage, ChatMode } from "./types";

const STORAGE_KEY = "tribunus_chat_v1";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi — select a project and a mode to start. This is a UI template; the agent will be connected later.",
  createdAt: new Date().toISOString(),
};

/**
 * Load chat store from localStorage
 * Returns empty store if not found or parse fails
 */
export function loadStore(): ChatStore {
  if (typeof window === "undefined") {
    return { sessions: [] };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: [] };

    const parsed = JSON.parse(raw);
    return parsed as ChatStore;
  } catch (error) {
    console.error("Failed to load chat store:", error);
    return { sessions: [] };
  }
}

/**
 * Save chat store to localStorage
 */
export function saveStore(store: ChatStore): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error("Failed to save chat store:", error);
  }
}

/**
 * Get session by (projectId, mode)
 * Creates new session with welcome message if not found
 */
export function getSession(projectId: string, mode: ChatMode): ChatSession {
  const store = loadStore();

  const existing = store.sessions.find(
    (s) => s.projectId === projectId && s.mode === mode
  );

  if (existing) {
    return existing;
  }

  // Create new session with welcome message
  const newSession: ChatSession = {
    projectId,
    mode,
    messages: [WELCOME_MESSAGE],
    updatedAt: new Date().toISOString(),
  };

  store.sessions.push(newSession);
  saveStore(store);

  return newSession;
}

/**
 * Append a message to a session
 * Returns updated session
 */
export function appendMessage(
  projectId: string,
  mode: ChatMode,
  message: ChatMessage
): ChatSession {
  const store = loadStore();

  let session = store.sessions.find(
    (s) => s.projectId === projectId && s.mode === mode
  );

  if (!session) {
    // Create session if doesn't exist
    session = {
      projectId,
      mode,
      messages: [WELCOME_MESSAGE],
      updatedAt: new Date().toISOString(),
    };
    store.sessions.push(session);
  }

  // Append message
  session.messages.push(message);
  session.updatedAt = new Date().toISOString();

  saveStore(store);
  return session;
}

/**
 * Clear all messages from a session and re-add welcome message
 */
export function clearSession(projectId: string, mode: ChatMode): void {
  const store = loadStore();

  const session = store.sessions.find(
    (s) => s.projectId === projectId && s.mode === mode
  );

  if (session) {
    session.messages = [WELCOME_MESSAGE];
    session.updatedAt = new Date().toISOString();
    saveStore(store);
  }
}
