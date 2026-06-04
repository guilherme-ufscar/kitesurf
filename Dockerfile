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
WORKDIR /app/apps/api

RUN npm install -g pnpm

# Copy workspace node_modules
COPY --from=builder /app/node_modules ./node_modules
# Copy api-specific files
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/apps/api/prisma ./prisma

RUN mkdir -p /app/uploads

EXPOSE 10212
CMD ["node", "dist/main"]

# Runner stage for Web (internal, no exposed port)
FROM node:20-alpine AS web-runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/apps/web/dist /app/dist