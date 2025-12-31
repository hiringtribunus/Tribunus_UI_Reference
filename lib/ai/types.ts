/**
 * Chat mode types for Tribunus AI
 * - council_reports: Query council reports and meeting documents
 * - web: General web search
 * - news: News articles and press coverage
 */
export type ChatMode = "council_reports" | "web" | "news";

/**
 * Individual chat message
 */
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string; // ISO timestamp
};

/**
 * Chat session scoped to (projectId, mode)
 * Each combination maintains its own message history
 */
export type ChatSession = {
  projectId: string; // "none" for general context
  mode: ChatMode;
  messages: ChatMessage[];
  updatedAt: string; // ISO timestamp
};

/**
 * Root store structure for localStorage persistence
 * Key: "tribunus_chat_v1"
 */
export type ChatStore = {
  sessions: ChatSession[];
};
