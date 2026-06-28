FROM oven/bun:1.3.14 AS build
WORKDIR /app

COPY package.json turbo.json bun.lock ./
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY packages/ ./packages/

RUN bun install --frozen-lockfile

COPY apps/frontend/ ./apps/frontend/

WORKDIR /app/apps/frontend
RUN bun run build.ts

FROM oven/bun:1.3.14
WORKDIR /app

COPY --from=build /app/apps/frontend/dist ./dist
COPY --from=build /app/apps/frontend/public ./public
COPY apps/frontend/prod-server.ts ./prod-server.ts

EXPOSE 3000
CMD ["bun", "prod-server.ts"]
