FROM node:20-alpine AS builder
WORKDIR /app

# Use pnpm 9.x for better compatibility
RUN npm install -g pnpm@9

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY packages/shared ./packages/shared
COPY apps/api/package.json ./apps/api/

WORKDIR /app/apps/api
RUN pnpm install

COPY apps/api/src ./src
COPY apps/api/prisma ./prisma
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