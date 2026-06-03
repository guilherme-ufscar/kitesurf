FROM node:20-alpine AS builder
WORKDIR /app

# Use pnpm 9.x for better compatibility
RUN npm install -g pnpm@9

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY packages/shared ./packages/shared
COPY apps/web/package.json ./apps/web/

WORKDIR /app/apps/web
RUN pnpm install

COPY apps/web/src ./src
COPY apps/web/index.html ./index.html
COPY apps/web/vite.config.ts ./vite.config.ts
COPY apps/web/tailwind.config.ts ./tailwind.config.ts
COPY apps/web/tsconfig.json ./tsconfig.json
COPY apps/web/src/index.css ./src/index.css
COPY apps/web/src/main.tsx ./src/main.tsx
RUN pnpm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]