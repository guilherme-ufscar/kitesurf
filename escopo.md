# KITE360º — Escopo do Projeto

> Documento de referência para todos os Claude Codes deste projeto.
> Última atualização: 2026-06-01

---

## Visão Geral

**KITE360º** é um marketplace digital (web + app Android/iOS) focado exclusivamente em compra, venda e negociação de equipamentos de esportes aquáticos: **kitesurf, wingfoil, kitefoil e kitewave**.

- **Domínio:** kite360.com.br
- **Objetivo principal:** ambiente seguro, organizado e confiável para negociações na comunidade de esportes aquáticos
- **Inspiração de produto:** Mercado Livre, OLX — mas com design moderno e identidade própria do universo kitesurf
- **Nota:** O evento KITE360º é uma iniciativa separada e **não faz parte do marketplace**.

---

## Stack Técnica (decisões fechadas)

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + TypeScript + Vite |
| UI | Tailwind v4 + shadcn/ui (customizado com tema da marca) |
| Ícones | lucide-react + SVGs customizados |
| Editor rico | TipTap |
| Estado/fetch | TanStack Query + Zustand |
| Roteamento | React Router v7 |
| Mobile | Capacitor (iOS + Android) |
| Backend | NestJS + TypeScript |
| ORM | Prisma |
| Banco | PostgreSQL 16 |
| Cache | Redis |
| Auth | JWT (access + refresh tokens) |
| Chat tempo real | Socket.IO |
| Upload imagens | Multer → disco (volume Docker) + sharp (webp + thumbnails) |
| Vídeos | Apenas embed de link do YouTube (sem upload) |
| Pagamentos | Mercado Pago (Pix, cartão, boleto) |
| Tradução | LibreTranslate self-hosted (container Docker) + cache PostgreSQL |
| i18n frontend | react-i18next (PT-BR, EN, ES) |
| Monorepo | pnpm workspaces |
| Containerização | Docker + docker-compose |
| Proxy reverso | Nginx |
| Hospedagem | VPS com aaPanel |

---

## Regras de Design (OBRIGATÓRIAS em todo o projeto)

### Cores da marca (extraídas de logo.svg)
```
--navy:       #141F2E   (primária escura — fundos, headers)
--teal:       #286B72   (primária destaque — CTAs, links ativos, badges)
--steel:      #A2B3BC   (neutro — textos secundários, bordas, placeholders)
--white:      #FFFFFF
--bg-light:   #F4F7F8   (fundo geral claro)
```

### Regras absolutas
- **NUNCA usar emojis** em nenhuma parte da plataforma (UI, textos, notificações, etc.)
- Usar **exclusivamente ícones** (lucide-react ou SVG customizado)
- **Proibido glassmorphism / liquid glass** em qualquer componente
- Seletor de idioma: ícones SVG das bandeiras (PT/EN/ES), **nunca** emoji de bandeira
- Design moderno, limpo, inspirado no universo kitesurf (vento, mar, movimento)
- Tendências globais atuais: minimal, bold typography, espaçamento generoso

---

## Tradução Automática Camuflada

### Comportamento esperado
- O usuário seleciona o idioma via ícone discreto (PT / EN / ES)
- O conteúdo da página atualiza **dinamicamente**, sem reload, sem barra de tradução
- **Nada indica que há tradução automática acontecendo** (sem logo do Google, sem "Traduzido por", sem barra no topo)
- Strings fixas da UI: arquivos i18n (pt.json, en.json, es.json) — tradução humana
- Conteúdo dinâmico (anúncios, perfis): endpoint interno `/api/translate` com cache

### Arquitetura
```
frontend → GET /api/translate?text=...&to=en
         ← { translated: "..." }  (cacheado em DB)

backend → LibreTranslate container (self-hosted, porta interna)
        → cache PostgreSQL (hash(text+lang) → translation)
```

### Implementação
- `TranslationModule` no NestJS com interface `TranslationProvider` (plugável)
- Provider padrão: `LibreTranslateProvider` (http://libretranslate:5000 interno)
- Cache em tabela `translation_cache` (hash, source_lang, target_lang, translated_text, created_at)
- Frontend usa hook `useTranslate(text, lang)` que chama o endpoint com debounce

---

## Arquitetura do Projeto

```
kitesurf/
├── escopo.md
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── pnpm-workspace.yaml
├── package.json
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
├── apps/
│   ├── api/                    # NestJS
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       └── modules/
│   │           ├── auth/
│   │           ├── users/
│   │           ├── listings/
│   │           ├── media/
│   │           ├── search/
│   │           ├── chat/
│   │           ├── reviews/
│   │           ├── payments/
│   │           ├── ads/
│   │           ├── translate/
│   │           └── communities/
│   └── web/                    # React + Vite
│       ├── Dockerfile
│       ├── capacitor.config.ts
│       ├── package.json
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       ├── index.html
│       └── src/
│           ├── main.tsx
│           ├── app.tsx
│           ├── components/
│           ├── pages/
│           ├── hooks/
│           ├── stores/
│           ├── lib/
│           └── locales/
│               ├── pt.json
│               ├── en.json
│               └── es.json
└── packages/
    └── shared/
        ├── package.json
        └── src/
            ├── types/
            ├── dtos/
            └── enums/
```

---

## Modelo de Dados (entidades principais)

### User
- id, email, password_hash, name, avatar_url, phone, cpf_hash (verificação), bio
- location (cidade, estado, país), whatsapp
- is_verified (selo de segurança), verification_level (BASIC | VERIFIED | PRO)
- reputation_score, total_sales, total_purchases
- subscription_plan (FREE | PRO | BUSINESS), subscription_expires_at
- created_at, updated_at, last_seen_at

### Listing (anúncio)
- id, user_id, title, slug, description (TipTap JSON), price, currency
- category_id, brand_id, modality (KITESURF | WINGFOIL | KITEFOIL | KITEWAVE | OUTRO)
- condition (NOVO | SEMINOVO | USADO | PARA_PECAS)
- year, size (tamanho do equipamento)
- location (cidade, estado, lat/lng)
- youtube_url (opcional), images (array de media_ids)
- status (DRAFT | ACTIVE | PAUSED | SOLD | EXPIRED)
- views_count, favorites_count
- is_featured (destaque pago), featured_until
- created_at, updated_at, expires_at

### Category
- id, name (i18n key), slug, icon, parent_id
- Exemplos: Pipas, Barras, Pranchas, Trapézios, Sacos/Malas, Acessórios, Wingsuits

### Brand
- id, name, logo_url, verified (marca verificada)

### Media
- id, user_id, listing_id, filename, path, url, type (IMAGE), width, height, size_bytes
- thumbnail_url, webp_url
- created_at

### Conversation
- id, listing_id, buyer_id, seller_id, last_message_at, status (ACTIVE | ARCHIVED)

### Message
- id, conversation_id, sender_id, content, type (TEXT | IMAGE | SYSTEM)
- read_at, created_at

### Review
- id, reviewer_id, reviewed_id, listing_id, rating (1-5), comment
- type (SELLER | BUYER), created_at

### Payment
- id, user_id, listing_id, type (COMMISSION | SUBSCRIPTION | FEATURED | WHATSAPP_BOOST)
- amount, currency, status (PENDING | APPROVED | REJECTED | REFUNDED)
- mercadopago_id, created_at

### Subscription
- id, user_id, plan (PRO | BUSINESS), price, expires_at, auto_renew

### VerificationRequest
- id, user_id, status (PENDING | APPROVED | REJECTED), documents (array), created_at

### TranslationCache
- id, text_hash, source_lang, target_lang, translated_text, hit_count, created_at

---

## Módulos Backend (NestJS)

| Módulo | Responsabilidades |
|--------|------------------|
| `auth` | Registro, login, refresh JWT, logout, recuperação de senha |
| `users` | Perfil, avatar upload, configurações, reputação |
| `listings` | CRUD anúncios, publicar/pausar/encerrar, favoritar |
| `media` | Upload Multer, processamento sharp (webp + 3 tamanhos), servir URL |
| `search` | Busca full-text PostgreSQL, filtros (categoria, marca, modalidade, localização, preço, condição) |
| `chat` | Gateway Socket.IO, mensagens, conversas, leitura |
| `reviews` | Avaliações de compradores e vendedores |
| `payments` | Mercado Pago webhooks, comissão, assinatura, destaque |
| `ads` | Anúncios em destaque (patrocinados), gerenciamento |
| `translate` | Proxy LibreTranslate + cache PostgreSQL |
| `communities` | Links para grupos WhatsApp por modalidade/região |

---

## Telas do Frontend

### Públicas (sem login)
- **Home:** feed de anúncios em destaque + recentes, barra de busca, categorias rápidas, banner hero com estética kitesurf
- **Busca/Listagem:** grid de anúncios com filtros sidebar (categoria, marca, modalidade, localização, preço, condição, verificado)
- **Detalhe do Anúncio:** galeria de imagens, vídeo YouTube embed, descrição TipTap, dados do vendedor, botão "Entrar em contato", anúncios similares
- **Perfil Público:** anúncios do usuário, avaliações, reputação, selo de verificação
- **Login / Registro / Recuperar Senha**

### Autenticadas
- **Dashboard do Usuário:** meus anúncios, favoritos, conversas, avaliações
- **Criar / Editar Anúncio:** formulário multi-step (dados básicos → fotos → descrição TipTap → preço/localização → preview)
- **Chat:** lista de conversas + janela de chat em tempo real (Socket.IO)
- **Favoritos:** grade de anúncios salvos
- **Meu Perfil:** edição, avatar upload, configurações, verificação
- **Planos e Assinatura:** comparativo de planos, pagamento Mercado Pago

### Admin (painel interno)
- Gerenciamento de usuários, anúncios, verificações, pagamentos, anúncios em destaque

---

## Modelo de Monetização

1. **Selo de segurança / verificação** — taxa única ou renovação anual
2. **Anúncios em destaque** — pagamento por período (7/15/30 dias) no topo dos resultados
3. **Assinatura PRO/BUSINESS** — limites maiores de anúncios, recursos exclusivos, suporte prioritário
4. **Comissão sobre vendas** — % sobre transações intermediadas pela plataforma
5. **Divulgação em grupos WhatsApp** — impulsionamento premium do anúncio nos grupos segmentados

---

## Faseamento

### Fase 0 — Scaffold e Foundation
- Monorepo, Docker, Nginx, PostgreSQL, variáveis de ambiente
- Autenticação completa (registro, login, JWT refresh)
- Design system: tokens de cor, componentes base shadcn customizados, tipografia
- i18n frontend: pt/en/es com seletor de idioma (ícones SVG)
- Schema Prisma completo

### Fase 1 — MVP (anúncios)
- CRUD de anúncios com upload de imagens (local, sharp, webp)
- Categorias e marcas
- Embed de vídeo YouTube
- Editor TipTap
- Busca e filtros avançados
- Detalhe do anúncio
- Perfil público e privado
- Favoritos

### Fase 2 — Comunidade
- Chat em tempo real (Socket.IO)
- Sistema de avaliações e reputação
- Verificação/selo de segurança
- Notificações (in-app)

### Fase 3 — Monetização
- Integração Mercado Pago
- Anúncios em destaque
- Assinaturas PRO/BUSINESS
- Comissão sobre vendas
- Divulgação WhatsApp

### Fase 4 — Expansão
- LibreTranslate self-hosted + tradução camuflada dinâmica
- Comunidades/grupos por modalidade
- Admin panel completo
- Build Capacitor (iOS + Android)
- SEO, sitemap, meta tags Open Graph

---

## Convenções do Projeto

### Código
- TypeScript strict mode em todos os workspaces
- ESLint + Prettier configurados na raiz
- Commits semânticos (feat, fix, chore, docs, style)
- Variáveis de ambiente nunca no código — sempre `.env`

### Nomeação
- Backend: módulos em snake_case para Prisma, camelCase para TypeScript
- Frontend: componentes em PascalCase, hooks `use` prefix, stores `use...Store`
- URLs de API: `/api/v1/...`

### Upload de imagens
- Tipos aceitos: jpg, jpeg, png, webp
- Tamanho máximo: 10MB por arquivo
- Processamento: original → webp 1200px, medium 600px, thumb 150px
- Armazenamento: `/uploads/listings/{listing_id}/{uuid}.webp`
- Servidos por Nginx em `/uploads/...`

### Segurança
- Rate limiting em todos os endpoints públicos
- Validação de input com class-validator (NestJS)
- Sanitização de HTML no TipTap (DOMPurify)
- CPF hasheado (nunca armazenar em claro)
- Imagens servidas apenas via Nginx (não expor paths do disco)

---

## Variáveis de Ambiente (.env.example)

```env
# Database
DATABASE_URL=postgresql://kite360:password@db:5432/kite360

# JWT
JWT_SECRET=change_me_in_production
JWT_REFRESH_SECRET=change_me_refresh
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# API
API_PORT=3000
API_URL=http://localhost:3000

# Frontend
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3000

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_WEBHOOK_SECRET=

# LibreTranslate
LIBRETRANSLATE_URL=http://libretranslate:5000
LIBRETRANSLATE_API_KEY=

# Upload
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760

# Redis
REDIS_URL=redis://redis:6379
```

---

## Referências
- Logo: `logo.svg` (cores extraídas: navy #141F2E, teal #286B72, steel #A2B3BC)
- Domínio: kite360.com.br
- Hospedagem: VPS aaPanel com Docker
