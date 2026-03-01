import type WebSocket from "ws";
import { Duplex } from "stream";
import { docker } from "../config/docker";
import { logger } from "../utils/logger";

interface TerminalSession {
  execStream: Duplex;
  ws: WebSocket;
}

const activeSessions = new Map<string, TerminalSession>();

export async function attachTerminal(
  ws: WebSocket,
  sessionId: string,
  containerId: string
): Promise<void> {
  const existing = activeSessions.get(sessionId);
  if (existing) {
    existing.execStream.destroy();
    activeSessions.delete(sessionId);
  }

  const container = docker.getContainer(containerId);

  const exec = await container.exec({
    Cmd: ["/bin/sh"],
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
  });

  const stream = await exec.start({
    hijack: true,
    stdin: true,
    Tty: true,
  });

  activeSessions.set(sessionId, { execStream: stream, ws });

  stream.on("data", (chunk: Buffer) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(chunk);
    }
  });

  stream.on("end", () => {
    if (ws.readyState === ws.OPEN) {
      ws.close(1000, "Terminal session ended");
    }
    activeSessions.delete(sessionId);
  });

  stream.on("error", (err: Error) => {
    logger.error({ err, sessionId }, "Terminal stream error");
    if (ws.readyState === ws.OPEN) {
      ws.close(1011, "Terminal stream error");
    }
    activeSessions.delete(sessionId);
  });

  ws.on("message", (data: WebSocket.RawData) => {
    try {
      stream.write(data as Buffer);
    } catch {
    }
  });

  ws.on("close", () => {
    detachTerminal(sessionId);
  });

  ws.on("error", (err) => {
    logger.error({ err, sessionId }, "WebSocket error");
    detachTerminal(sessionId);
  });
}

export function detachTerminal(sessionId: string): void {
  const session = activeSessions.get(sessionId);
  if (!session) return;

  try {
    session.execStream.destroy();
  } catch {
  }

  activeSessions.delete(sessionId);
}

export function getActiveTerminalCount(): number {
  return activeSessions.size;
}
