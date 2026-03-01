import { useState, type ReactNode } from "react";
import { execSql } from "../../services/sandbox.service";
import { SqlResultTable } from "./SqlResultTable";
import { SqlFeedback } from "./SqlFeedback";

interface SqlSearchFormProps {
  sessionId: string;
  endpoint: string;
}

export function SqlSearchForm({ sessionId, endpoint }: SqlSearchFormProps): ReactNode {
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setOutput(null);
    setSuccess(null);

    try {
      const result = await execSql(sessionId, { q: query }, endpoint);
      setOutput(result.output);

      try {
        const parsed = JSON.parse(result.output);
        setSuccess(parsed.success === true && parsed.count > 0);
      } catch {
        setSuccess(false);
      }
    } catch {
      setOutput("Error: Failed to connect to server");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="terminal-border rounded-lg p-6 bg-[#0a0e17]">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-hacker-green/10 border border-hacker-green/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-hacker-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div>
            <h3 className="text-sm font-mono text-gray-200">Product Search</h3>
            <p className="text-[10px] font-mono text-gray-500">VulnCorp Product Database</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
              Search Query
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-black/50 border border-terminal-border rounded-lg px-4 py-2.5 text-sm font-mono text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-hacker-green/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary text-xs w-full disabled:opacity-30"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {success !== null && <SqlFeedback success={success} />}
      {output && <SqlResultTable output={output} />}
    </div>
  );
}
