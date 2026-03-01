import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { globalRateLimiter } from "./middleware/rateLimiter";
import { globalErrorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import challengeRoutes from "./routes/challenge.routes";
import adminRoutes from "./routes/admin.routes";
import sandboxRoutes from "./routes/sandbox.routes";
import hintRoutes from "./routes/hint.routes";
import engineRoutes from "./routes/engine.routes";
import trainingRoutes from "./routes/training.routes";

const app = express();

app.set("trust proxy", 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  maxAge: 86400,
}));

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(globalRateLimiter);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sandbox", sandboxRoutes);
app.use("/api/hints", hintRoutes);
app.use("/api/engine", engineRoutes);
app.use("/api/training", trainingRoutes);

app.use(globalErrorHandler);

export default app;
