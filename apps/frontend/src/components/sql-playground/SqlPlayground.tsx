import { type ReactNode } from "react";
import { SqlLoginForm } from "./SqlLoginForm";
import { SqlSearchForm } from "./SqlSearchForm";

interface SqlPlaygroundProps {
  sessionId: string;
  endpoint: string;
}

export function SqlPlayground({ sessionId, endpoint }: SqlPlaygroundProps): ReactNode {
  if (endpoint === "/login") {
    return <SqlLoginForm sessionId={sessionId} endpoint={endpoint} />;
  }

  return <SqlSearchForm sessionId={sessionId} endpoint={endpoint} />;
}
