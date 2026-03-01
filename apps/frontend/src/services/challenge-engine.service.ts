import { api } from "./api";
import type { ValidationResult, ChallengeDetail } from "../types/challenge-engine.types";

export async function validateSubmission(
  challengeId: string,
  answer: string,
  sandboxSessionId?: string
): Promise<ValidationResult> {
  const { data } = await api.post<{ success: boolean; data: ValidationResult }>(
    "/engine/validate",
    { challengeId, answer, sandboxSessionId }
  );
  return data.data;
}

export async function getChallengeDetail(challengeId: string): Promise<ChallengeDetail> {
  const { data } = await api.get<{ success: boolean; data: ChallengeDetail }>(
    `/challenges/${challengeId}`
  );
  return data.data;
}

export async function listChallenges(): Promise<ChallengeDetail[]> {
  const { data } = await api.get<{
    success: boolean;
    data: { items: ChallengeDetail[]; total: number; page: number; pageSize: number; totalPages: number };
  }>("/challenges");
  return data.data.items;
}
