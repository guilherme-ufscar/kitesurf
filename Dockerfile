FROM node:20-alpine AS builder
WORKDIR /app

# Copy entire workspace
COPY . .

# Install dependencies with npm (more compatible)
RUN npm install -g pnpm && \
    pnpm install

# Build API
WORKDIR /app/apps/api
RUN pnpm run prisma:generate && \
    pnpm run build

# Build Web
WORKDIR /app/apps/web
RUN pnpm run build

# Runner stage for API
FROM node:20-alpine AS api-runner
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
RUN mkdir -p /app/uploads
EXPOSE 10209
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

# Runner stage for Web (serves on port 10209)
FROM node:20-alpine AS web-runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/apps/web/dist /app/dist
EXPOSE 10212
CMD ["serve", "-s", "/app/dist", "-l", "10212"]