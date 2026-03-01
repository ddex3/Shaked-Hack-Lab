FROM node:20-alpine

RUN apk add --no-cache sqlite bash curl

RUN adduser -D -s /bin/bash hacker

RUN mkdir -p /app /data && chown -R hacker:hacker /app /data

COPY --chown=hacker:hacker docker/sandbox/sql-app/ /app/

WORKDIR /app
RUN npm install --production 2>/dev/null || true && chown -R hacker:hacker /app

EXPOSE 3000

USER hacker
CMD ["node", "server.js"]
