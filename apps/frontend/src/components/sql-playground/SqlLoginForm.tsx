import { useState, type ReactNode } from "react";
import { execSql } from "../../services/sandbox.service";
import { SqlResultTable } from "./SqlResultTable";
import { SqlFeedback } from "./SqlFeedback";

interface SqlLoginFormProps {
  sessionId: string;
  endpoint: string;
}

export function SqlLoginForm({ sessionId, endpoint }: SqlLoginFormProps): ReactNode {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setOutput(null);
    setSuccess(null);

    try {
      const result = await execSql(sessionId, { username, password }, endpoint);
      setOutput(result.output);

      try {
        const parsed = JSON.parse(result.output);
        setSuccess(parsed.success === true);
      } catch {
        setSuccess(false);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to connect to server";
      setOutput(`Error: ${msg}`);
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
            <svg className="w-4 h-4 text-hacker-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div>
            <h3 className="text-sm font-mono text-gray-200">Secure Login</h3>
            <p className="text-[10px] font-mono text-gray-500">VulnCorp Employee Portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-black/50 border border-terminal-border rounded-lg px-4 py-2.5 text-sm font-mono text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-hacker-green/50"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
              Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-black/50 border border-terminal-border rounded-lg px-4 py-2.5 text-sm font-mono text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-hacker-green/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="btn-primary text-xs w-full disabled:opacity-30"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>

      {success !== null && <SqlFeedback success={success} />}
      {output && <SqlResultTable output={output} />}
    </div>
  );
}
