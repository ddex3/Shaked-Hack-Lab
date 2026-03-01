FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared-types/package.json ./packages/shared-types/
RUN npm ci --workspace=apps/backend --include-workspace-root

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build --workspace=apps/backend

FROM base AS runner
ENV NODE_ENV=production
RUN apk add --no-cache docker-cli
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
USER appuser
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1
CMD ["node", "dist/server.js"]
