import { Server as HttpServer } from "http";
import { WebSocketServer } from "ws";
import { logger } from "../utils/logger";
import { verifyAccessToken } from "../utils/jwt";
import { handleTerminalConnection } from "./terminal.handler";

export function initWebSocketServer(httpServer: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws/terminal",
  });

  // Ping all connected clients every 30s to keep connections alive
  const pingInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if ((ws as any)._isAlive === false) {
        ws.terminate();
        return;
      }
      (ws as any)._isAlive = false;
      ws.ping();
    });
  }, 30_000);

  wss.on("close", () => {
    clearInterval(pingInterval);
  });

  wss.on("connection", (ws, req) => {
    (ws as any)._isAlive = true;
    ws.on("pong", () => {
      (ws as any)._isAlive = true;
    });

    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const token = url.searchParams.get("token");
    const sessionId = url.searchParams.get("sessionId");

    if (!token || !sessionId) {
      ws.close(4001, "Missing token or sessionId");
      return;
    }

    let userId: string;
    try {
      const payload = verifyAccessToken(token);
      userId = payload.userId;
    } catch {
      ws.close(4003, "Invalid token");
      return;
    }

    handleTerminalConnection(ws, sessionId, userId).catch((err) => {
      logger.error({ err, sessionId }, "Terminal connection error");
      ws.close(1011, "Internal error");
    });
  });

  wss.on("error", (err) => {
    logger.error({ err }, "WebSocket server error");
  });

  logger.info("WebSocket server initialized on /ws/terminal");

  return wss;
}
