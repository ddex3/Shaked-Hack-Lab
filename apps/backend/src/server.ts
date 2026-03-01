import "./config/dotenv";
import { createServer } from "http";
import app from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { prisma } from "./config/prisma";
import { initWebSocketServer } from "./websocket/terminal.gateway";
import { startCleanupLoop, stopCleanupLoop, cleanupAllSessions } from "./services/sandbox-cleanup.service";

async function main(): Promise<void> {
  await prisma.$connect();
  logger.info("Database connected");

  const httpServer = createServer(app);

  initWebSocketServer(httpServer);

  startCleanupLoop();

  httpServer.listen(env.BACKEND_PORT, () => {
    logger.info(`Server running on port ${env.BACKEND_PORT}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received, shutting down gracefully`);

    stopCleanupLoop();

    try {
      await cleanupAllSessions();
      logger.info("All sandbox sessions cleaned up");
    } catch (err) {
      logger.error({ err }, "Error cleaning up sandbox sessions");
    }

    httpServer.close(async () => {
      await prisma.$disconnect();
      logger.info("Database disconnected");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
