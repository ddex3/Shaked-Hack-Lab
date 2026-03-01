import type WebSocket from "ws";
import { getSession } from "../services/sandbox.service";
import { attachTerminal } from "../services/terminal.service";
import { logger } from "../utils/logger";

export async function handleTerminalConnection(
  ws: WebSocket,
  sessionId: string,
  userId: string
): Promise<void> {
  const session = await getSession(sessionId);

  if (!session) {
    ws.close(4004, "Session not found");
    return;
  }

  if (session.userId !== userId) {
    ws.close(4003, "Not authorized");
    return;
  }

  if (session.status !== "RUNNING" || !session.containerId) {
    ws.close(4005, "Session not active");
    return;
  }

  logger.info({ sessionId, userId }, "Terminal connected");

  await attachTerminal(ws, sessionId, session.containerId);
}
