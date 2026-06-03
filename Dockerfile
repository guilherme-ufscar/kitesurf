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

# Runner stage for Web
FROM nginx:alpine AS web-runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]