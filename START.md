# KITE360º - Script de Desenvolvimento

# ============================================
# REQUISITOS
# ============================================
# - Docker + Docker Compose
# - Node.js 20+ (para desenvolvimento local)
# - pnpm 8+
#
# Para iniciar apenas os serviços externos (PostgreSQL, Redis):
#   docker-compose -f docker-compose.dev.yml up -d
#
# ============================================
# DESENVOLVIMENTO LOCAL
# ============================================

# 1. Instalar dependências
pnpm install

# 2. Copiar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# 3. Gerar Prisma Client
pnpm --filter @kite360/api prisma generate

# 4. Rodar migrações do banco
pnpm --filter @kite360/api prisma migrate dev

# 5. Iniciar serviços externos (PostgreSQL, Redis, LibreTranslate)
docker-compose -f docker-compose.dev.yml up -d

# 6. Iniciar o servidor de desenvolvimento
# API (NestJS)
pnpm --filter @kite360/api start:dev

# Web (em outro terminal)
pnpm --filter @kite360/web dev

# ============================================
# PRODUÇÃO (Docker)
# ============================================

# Build e start de todos os serviços
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# ============================================
# DICAS
# ============================================
# - O frontend estará em http://localhost:3000 (via Nginx)
# - A API estará em http://localhost:3000/api
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
# - LibreTranslate: localhost:5000