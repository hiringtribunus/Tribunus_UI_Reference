import type { ChatMode } from "./types";

/**
 * Build a deterministic placeholder response based on mode and context
 * No real AI backend - just template-based responses
 */
export function buildPlaceholderResponse(args: {
  mode: ChatMode;
  projectName?: string;
  message: string;
}): string {
  const { mode, projectName } = args;
  const context = projectName || "General";

  switch (mode) {
    case "council_reports":
      return `**Council Reports Agent (placeholder)**
Context: ${context}

I can answer once council report sources are connected.

For now, paste a council agenda/report link and tell me what you're trying to decide (e.g., rezoning risk, height/FSR, parking variances).`;

    case "web":
      return `**Web Search (placeholder)**
Context: ${context}

Web search will be enabled soon. For now, paste a URL or describe what you want to verify.`;

    case "news":
      return `**News (placeholder)**
Context: ${context}

News search will be enabled soon. For now, paste an article URL or the headline.`;

    default:
      return `Context: ${context}\n\nPlaceholder response. Agent backend will be connected later.`;
  }
}
