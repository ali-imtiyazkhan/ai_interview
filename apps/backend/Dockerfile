FROM oven/bun:1.3.14 AS base
WORKDIR /app

COPY package.json turbo.json bun.lock ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/

RUN bun install --frozen-lockfile

COPY apps/backend/ ./apps/backend/

WORKDIR /app/apps/backend
RUN bunx prisma generate

EXPOSE 3001

CMD bunx prisma migrate deploy && bun src/index.ts
