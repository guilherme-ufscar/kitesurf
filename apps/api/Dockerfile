FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json ./
COPY packages/shared ./packages/shared
COPY apps/api/package.json ./apps/api/
RUN pnpm install

COPY apps/api ./apps/api
WORKDIR /app/apps/api
RUN pnpm install
RUN pnpm run prisma:generate
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/prisma ./prisma

RUN mkdir -p /app/uploads

EXPOSE 10209
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]