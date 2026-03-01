import { useEffect, useRef, useCallback } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { createTerminalWebSocket } from "../services/websocket.service";

interface UseTerminalReturn {
  terminalRef: React.RefObject<HTMLDivElement | null>;
}

export function useTerminal(sessionId: string | null): UseTerminalReturn {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (terminalInstance.current) {
      terminalInstance.current.dispose();
      terminalInstance.current = null;
    }
    fitAddonRef.current = null;
  }, []);

  useEffect(() => {
    if (!sessionId || !terminalRef.current) return;

    cleanup();

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      theme: {
        background: "#0a0e17",
        foreground: "#00ff41",
        cursor: "#00ff41",
        selectionBackground: "#00ff4155",
        black: "#0a0e17",
        green: "#00ff41",
        brightGreen: "#00ff41",
      },
      allowProposedApi: true,
      rightClickSelectsWord: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    terminalInstance.current = term;
    fitAddonRef.current = fitAddon;

    // Ctrl+Shift+C = copy, Ctrl+Shift+V = paste
    term.attachCustomKeyEventHandler((e: KeyboardEvent) => {
      if (e.type === "keydown") {
        // Ctrl+Shift+C -> copy selection
        if (e.ctrlKey && e.shiftKey && e.key === "C") {
          const sel = term.getSelection();
          if (sel) {
            navigator.clipboard.writeText(sel);
          }
          return false;
        }
        // Ctrl+Shift+V -> paste from clipboard
        if (e.ctrlKey && e.shiftKey && e.key === "V") {
          navigator.clipboard.readText().then((text) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(text);
            }
          });
          return false;
        }
        // Ctrl+C when text is selected -> copy instead of SIGINT
        if (e.ctrlKey && !e.shiftKey && e.key === "c") {
          const sel = term.getSelection();
          if (sel) {
            navigator.clipboard.writeText(sel);
            term.clearSelection();
            return false;
          }
        }
      }
      return true;
    });

    // Auto-copy on mouse selection
    term.onSelectionChange(() => {
      const sel = term.getSelection();
      if (sel) {
        navigator.clipboard.writeText(sel).catch(() => {
          // clipboard API may not be available
        });
      }
    });

    const ws = createTerminalWebSocket(sessionId);
    wsRef.current = ws;

    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      term.writeln("\x1b[32m[*] Connected to sandbox terminal\x1b[0m");
      term.writeln("\x1b[90m[*] Tip: Select text to copy | Ctrl+Shift+V to paste\x1b[0m");
      term.writeln("");
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        term.write(new Uint8Array(event.data));
      } else {
        term.write(event.data);
      }
    };

    ws.onclose = () => {
      term.writeln("");
      term.writeln("\x1b[31m[!] Terminal connection closed\x1b[0m");
    };

    ws.onerror = () => {
      term.writeln("\x1b[31m[!] Terminal connection error\x1b[0m");
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    // Right-click to paste
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(text);
        }
      }).catch(() => {
        // clipboard API may not be available
      });
    };

    const termEl = terminalRef.current;
    termEl?.addEventListener("contextmenu", handleContextMenu);

    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      termEl?.removeEventListener("contextmenu", handleContextMenu);
      cleanup();
    };
  }, [sessionId, cleanup]);

  return { terminalRef };
}
