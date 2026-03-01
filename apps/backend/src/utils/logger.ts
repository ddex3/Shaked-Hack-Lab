import pino from "pino";
import { env } from "../config/env";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    env.NODE_ENV === "development"
      ? { target: "pino/file", options: { destination: 1 } }
      : undefined,
  redact: {
    paths: ["password", "passwordHash", "accessToken", "refreshToken", "authorization"],
    censor: "[REDACTED]",
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
});
