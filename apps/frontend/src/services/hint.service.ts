import { api } from "./api";
import type { HintsListResponse, HintUnlockResponse } from "../types/challenge-engine.types";

export async function getHints(challengeId: string): Promise<HintsListResponse> {
  const { data } = await api.get<{ success: boolean; data: HintsListResponse }>(
    `/hints/${challengeId}`
  );
  return data.data;
}

export async function unlockHint(hintId: string): Promise<HintUnlockResponse> {
  const { data } = await api.post<{ success: boolean; data: HintUnlockResponse }>(
    `/hints/${hintId}/unlock`,
    { confirm: true }
  );
  return data.data;
}
