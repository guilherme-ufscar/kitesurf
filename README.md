# KITE360º

Marketplace digital para compra, venda e negociação de equipamentos de esportes aquáticos: **kitesurf, wingfoil, kitefoil e kitewave**.

## Stack Técnica

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + TypeScript + Vite |
| UI | Tailwind v4 + shadcn/ui |
| Mobile | Capacitor (iOS + Android) |
| Backend | NestJS + TypeScript |
| ORM | Prisma |
| Banco | PostgreSQL 16 |
| Cache | Redis |
| Auth | JWT (access + refresh tokens) |
| Chat tempo real | Socket.IO |
| Tradução | LibreTranslate self-hosted |
| i18n | react-i18next (PT-BR, EN, ES) |
| Monorepo | pnpm workspaces |
| Containerização | Docker + docker-compose |
| Proxy reverso | Nginx |

## Quick Start

### Pré-requisitos
- Docker + Docker Compose
- Node.js 20+
- pnpm 8+

### Setup

```bash
# 1. Clone o repositório e entre na pasta
cd kitesurf

# 2. Execute o setup (Windows)
setup.bat

# Ou manualmente:
pnpm install
pnpm --filter @kite360/api prisma generate
docker-compose -f docker-compose.dev.yml up -d
pnpm --filter @kite360/api prisma migrate dev
```

### Desenvolvimento

```bash
# Terminal 1 - API
pnpm --filter @kite360/api start:dev

# Terminal 2 - Web
pnpm --filter @kite360/web dev
```

### Produção (Docker)

```bash
# Build e start
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## Estrutura do Projeto

```
kitesurf/
├── apps/
│   ├── api/           # NestJS API
│   └── web/           # React frontend
├── packages/
│   └── shared/        # Types, DTOs, Enums compartilhados
├── nginx/             # Configuração do Nginx
├── docker-compose.yml # Produção
├── docker-compose.dev.yml # Desenvolvimento (serviços externos)
├── escopo.md          # Documentação completa
└── START.md           # Guia de início
```

## Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/auth/register | Registro de usuário |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh token |
| GET | /api/search | Busca de anúncios |
| POST | /api/listings | Criar anúncio |
| GET | /api/listings/slug/:slug | Detalhe do anúncio |
| WS | /socket.io | Chat em tempo real |
| WS | /notifications | Notificações |

## Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
DATABASE_URL=postgresql://kite360:changeme@db:5432/kite360
JWT_SECRET=sua-chave-secreta
ADMIN_EMAILS=admin@kite360.com.br
```

## Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request