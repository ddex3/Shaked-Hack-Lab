import crypto from "crypto";

export interface FlagValidationData {
  expectedHash: string;
}

export async function validate(
  answer: string,
  validationData: FlagValidationData
): Promise<{ correct: boolean; feedback: string }> {
  const answerHash = crypto
    .createHash("sha256")
    .update(answer.trim())
    .digest("hex");

  const correct = answerHash === validationData.expectedHash;

  return {
    correct,
    feedback: correct
      ? "Flag accepted. Challenge complete."
      : "Incorrect flag. Try again.",
  };
}
