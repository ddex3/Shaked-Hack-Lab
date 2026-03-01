import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";

interface SqlResultTableProps {
  output: string;
}

export function SqlResultTable({ output }: SqlResultTableProps): ReactNode {
  const parsed = useMemo(() => {
    try {
      return JSON.parse(output);
    } catch {
      return null;
    }
  }, [output]);

  if (!parsed) {
    return (
      <div className="terminal-border rounded-lg p-4 bg-[#0a0e17]">
        <span className="text-[10px] font-mono text-gray-500 block mb-2">RAW OUTPUT</span>
        <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap break-all">
          {output}
        </pre>
      </div>
    );
  }

  const data = parsed.results || parsed.user;
  const items = Array.isArray(data) ? data : data ? [data] : [];

  if (items.length === 0) {
    return (
      <div className="terminal-border rounded-lg p-4 bg-[#0a0e17]">
        <span className="text-[10px] font-mono text-gray-500 block mb-2">RESPONSE</span>
        <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      </div>
    );
  }

  const columns = Object.keys(items[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-border rounded-lg overflow-hidden bg-[#0a0e17]"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-terminal-border">
        <span className="text-[10px] font-mono text-gray-500">QUERY RESULTS</span>
        <span className="text-[10px] font-mono text-hacker-green">
          {items.length} row{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-terminal-border">
              {columns.map((col) => (
                <th key={col} className="text-left px-4 py-2 text-gray-500 uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((row: Record<string, unknown>, i: number) => (
              <tr
                key={i}
                className="border-b border-terminal-border/50 hover:bg-white/[0.02]"
              >
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2 text-gray-300">
                    {String(row[col] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
