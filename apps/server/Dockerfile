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

# Install both dependencies and devDependencies for prisma generation
RUN pnpm install --frozen-lockfile

# Prisma needs schema to generate
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma

# Generate Prisma client in final container
RUN pnpm --filter server db:generate

# Only now remove devDependencies if needed
RUN pnpm prune --prod

# Copy only what's needed for runtime
COPY --from=builder /app/apps/server/dist ./apps/server/dist

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["pnpm", "start"]
