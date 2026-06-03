@echo off
echo ========================================
echo KITE360º - Setup de Desenvolvimento
echo ========================================

echo.
echo [1/5] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Docker nao encontrado. Instale o Docker Desktop.
    exit /b 1
)
echo OK - Docker encontrado

echo.
echo [2/5] Verificando pnpm...
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: pnpm nao encontrado. Instale com: npm install -g pnpm
    exit /b 1
)
echo OK - pnpm encontrado

echo.
echo [3/5] Instalando dependencias...
call pnpm install
if errorlevel 1 (
    echo ERRO ao instalar dependencias
    exit /b 1
)

echo.
echo [4/5] Gerando Prisma Client...
call pnpm --filter @kite360/api prisma generate
if errorlevel 1 (
    echo ERRO ao gerar Prisma Client
    exit /b 1
)

echo.
echo [5/5] Subindo servicos externos (PostgreSQL, Redis)...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo ========================================
echo Setup completo!
echo.
echo Para iniciar o projeto:
echo.
echo   1. Execute: pnpm --filter @kite360/api prisma migrate dev
echo.
echo   2. Em um terminal: pnpm --filter @kite360/api start:dev
echo.
echo   3. Em outro terminal: pnpm --filter @kite360/web dev
echo.
echo Frontend: http://localhost:3000
echo ========================================
pause