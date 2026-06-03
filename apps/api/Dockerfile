FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json ./
COPY packages/shared ./packages/shared
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

COPY apps/api ./apps/api
RUN pnpm --filter @kite360/api run prisma:generate
RUN pnpm --filter @kite360/api run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api/prisma ./prisma

RUN mkdir -p /app/uploads

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
