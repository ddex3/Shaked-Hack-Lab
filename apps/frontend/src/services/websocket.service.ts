import { getAccessToken } from "./api";

export function createTerminalWebSocket(sessionId: string): WebSocket {
  const token = getAccessToken();
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = import.meta.env.VITE_WS_URL || `${protocol}//${window.location.host}`;
  return new WebSocket(`${wsUrl}/ws/terminal?token=${token}&sessionId=${sessionId}`);
}
