# Use Node.js 20 Alpine as base image
FROM node:lts-alpine AS builder

RUN npm install -g pnpm@latest

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/server/package.json ./apps/server/
COPY apps/server/tsconfig.json ./apps/server/

RUN pnpm install --frozen-lockfile


COPY apps/server/src ./apps/server/src
COPY apps/server/prisma ./apps/server/prisma

WORKDIR /app/apps/server

RUN pnpm db:generate

RUN pnpm build

FROM node:lts-alpine

RUN npm install -g pnpm@latest

WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/server/package.json ./apps/server/

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/apps/server/prisma ./apps/server/prisma

RUN pnpm --filter server db:generate

RUN pnpm prune --prod

COPY --from=builder /app/apps/server/dist ./apps/server/dist

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["pnpm", "start"]
