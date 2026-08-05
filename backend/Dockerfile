FROM oven/bun:1.3.14 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM deps AS build
COPY tsconfig*.json nest-cli.json ./
COPY prisma ./prisma
COPY src ./src
RUN bunx prisma generate && bun run build

FROM oven/bun:1.3.14-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package.json ./
USER bun
CMD ["bun", "run", "start"]
