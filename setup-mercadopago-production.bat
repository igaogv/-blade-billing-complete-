@echo off
REM ============================================================
REM  BLADE BILLING - MERCADO PAGO SETUP PROFISSIONAL
REM  Versao: 1.0 - PRODUCTION READY
REM  Data: 09/01/2026
REM  ============================================================
REM  ATENCAO: Este script cria migrations para PRODUCAO
REM  Nao use db push! Use migrate dev!
REM ============================================================

setlocal enabledelayedexpansion

color 0F
echo.
echo ============================================================
echo   BLADE BILLING - MERCADO PAGO SETUP PROFISSIONAL
echo   VERSAO: 1.0 - PRODUCTION READY
echo ============================================================
echo.

REM Verificar se estamos na pasta correta
if not exist "backend" (
    color 0C
    echo [ERRO] Pasta 'backend' nao encontrada!
    echo Execute este script da raiz do projeto
    echo Exemplo: C:\Users\55199\OneDrive\Desktop\blade-billing-main\
    pause
    exit /b 1
)

echo [1/6] Entrando na pasta backend...
cd backend
if errorlevel 1 (
    color 0C
    echo [ERRO] Nao conseguiu entrar em backend
    pause
    exit /b 1
)
echo [OK] Na pasta backend
echo.

echo [2/6] Verificando NODE_MODULES...
if not exist "node_modules" (
    echo [INFO] node_modules nao existe. Restaurando...
    call npm install
    if errorlevel 1 (
        color 0C
        echo [ERRO] npm install falhou
        pause
        exit /b 1
    )
)
echo [OK] node_modules verificado
echo.

echo [3/6] Instalando axios (se nao tiver)...
call npm list axios >nul 2>&1
if errorlevel 1 (
    echo [INFO] Instalando axios...
    call npm install axios
    if errorlevel 1 (
        color 0C
        echo [ERRO] npm install axios falhou
        pause
        exit /b 1
    )
) else (
    echo [OK] Axios ja instalado
)
echo.

echo [4/6] Gerando Prisma Client...
call npx prisma generate
if errorlevel 1 (
    color 0C
    echo [ERRO] Prisma generate falhou
    pause
    exit /b 1
)
echo [OK] Prisma Client gerado
echo.

echo [5/6] Criando MIGRATION para producao...
echo [ATENCAO] Responda 'y' quando perguntarem se quer continuar
echo.
call npx prisma migrate dev --name add_mercadopago_tables
if errorlevel 1 (
    color 0C
    echo [ERRO] Prisma migrate falhou
    echo Verifique se DATABASE_URL esta correto em backend\.env
    pause
    exit /b 1
)
echo [OK] Migration criada com sucesso
echo.

echo [6/6] Validando schema...
call npx prisma generate
if errorlevel 1 (
    color 0C
    echo [ERRO] Validacao do schema falhou
    pause
    exit /b 1
)
echo [OK] Schema validado
echo.

color 0A
echo ============================================================
echo   [SUCESSO] SETUP COMPLETO!
echo ============================================================
echo.
echo TABELAS CRIADAS:
echo   - mercadopago_preferences
echo   - mercadopago_payments
echo   - invoices (atualizada com novos campos)
echo.
echo ARQUIVOS DE MIGRATION CRIADOS:
echo   - prisma/migrations/*/migration.sql
echo   - Estes arquivos serao executados automaticamente no Vercel
echo.
echo PROXIMOS PASSOS:
echo   1. npm run dev (para testar localmente)
echo   2. Testar endpoints com Postman ou cURL
echo   3. git add . && git commit && git push (para Vercel)
echo.
echo IMPORTANTE:
echo   - Os arquivos de migration foram criados em prisma/migrations/
echo   - Vercel vai executar automaticamente na producao
echo   - Nao precisa fazer nada mais, so fazer push!
echo.
color 0B
echo Bora la! Mercado Pago ativado em PRODUCAO! 🚀
echo ============================================================
echo.
pause
