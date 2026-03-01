import { api } from "./api";
import type { SandboxStartResponse, SandboxStatusResponse, SqlExecResponse } from "../types/challenge-engine.types";

export async function startSandbox(challengeId: string): Promise<SandboxStartResponse> {
  const { data } = await api.post<{ success: boolean; data: SandboxStartResponse }>(
    "/sandbox/start",
    { challengeId }
  );
  return data.data;
}

export async function stopSandbox(sessionId: string): Promise<void> {
  await api.post(`/sandbox/${sessionId}/stop`);
}

export async function getSandboxStatus(sessionId: string): Promise<SandboxStatusResponse> {
  const { data } = await api.get<{ success: boolean; data: SandboxStatusResponse }>(
    `/sandbox/${sessionId}/status`
  );
  return data.data;
}

export async function resetSandbox(sessionId: string): Promise<SandboxStartResponse> {
  const { data } = await api.post<{ success: boolean; data: SandboxStartResponse }>(
    `/sandbox/${sessionId}/reset`
  );
  return data.data;
}

export async function execSql(
  sessionId: string,
  fields: Record<string, string>,
  endpoint: string
): Promise<SqlExecResponse> {
  const { data } = await api.post<{ success: boolean; data: SqlExecResponse }>(
    `/sandbox/${sessionId}/sql-exec`,
    { fields, endpoint }
  );
  return data.data;
}

export async function getActiveSandbox(challengeId: string): Promise<SandboxStartResponse | null> {
  const { data } = await api.get<{ success: boolean; data: SandboxStartResponse | null }>(
    `/sandbox/active/${challengeId}`
  );
  return data.data;
}
