@echo off
REM BLADE BILLING - MERCADO PAGO SETUP AUTOMATICO
REM Script para Windows PowerShell/CMD

color 0A
echo.
echo ========================================
echo   BLADE BILLING - MERCADO PAGO SETUP
echo ========================================
echo.

echo [1/4] Entrando na pasta backend...
cd backend
if errorlevel 1 (
    color 0C
    echo Erro: Não conseguiu entrar em backend
    exit /b 1
)
echo [OK] Pasta backend
echo.

echo [2/4] Instalando axios...
call npm install axios
if errorlevel 1 (
    color 0C
    echo Erro: Não conseguiu instalar axios
    exit /b 1
)
echo [OK] Axios instalado
echo.

echo [3/4] Gerando Prisma Client...
call npx prisma generate
if errorlevel 1 (
    color 0C
    echo Erro: Não conseguiu gerar Prisma
    exit /b 1
)
echo [OK] Prisma gerado
echo.

echo [4/4] Fazendo push do schema pro banco...
call npx prisma db push
if errorlevel 1 (
    color 0C
    echo Erro: Não conseguiu fazer push do schema
    echo Verifique se o DATABASE_URL está correto no .env
    exit /b 1
)
echo [OK] Schema enviado pro banco
echo.

color 0B
echo ========================================
echo   SETUP COMPLETO!
echo ========================================
echo.
echo Proximos passos:
echo 1. npm run dev (para rodar o servidor)
echo 2. Testar os endpoints com Postman
echo 3. git push (para deploy em Vercel)
echo.
echo Bora la!
echo.
pause
