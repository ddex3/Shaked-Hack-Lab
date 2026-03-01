import rateLimit from "express-rate-limit";

export const sandboxStartLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many sandbox requests, please wait before starting a new session",
    statusCode: 429,
  },
});

export const sandboxResetLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many reset requests, please wait before resetting",
    statusCode: 429,
  },
});

export const sandboxExecLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many execution requests, please slow down",
    statusCode: 429,
  },
});
