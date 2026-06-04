FROM node:20-alpine AS builder
WORKDIR /app

# Copy entire workspace
COPY . .

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build API
WORKDIR /app/apps/api
RUN pnpm run prisma:generate
RUN pnpm run build

# Build Web
WORKDIR /app/apps/web
RUN pnpm run build

# Runner stage for API
FROM node:20-alpine AS api-runner
WORKDIR /app

# Copy only what's needed from builder
COPY --from=builder /app/apps/api/dist ./api/dist
COPY --from=builder /app/apps/api/package.json ./api/package.json
COPY --from=builder /app/apps/api/prisma ./api/prisma
COPY --from=builder /app/node_modules ./node_modules

RUN mkdir -p /app/uploads

EXPOSE 10212
WORKDIR /app/api
CMD ["node", "dist/main"]

# Runner stage for Web (internal, no exposed port)
FROM node:20-alpine AS web-runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/apps/web/dist /app/dist