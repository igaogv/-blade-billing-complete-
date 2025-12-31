#!/bin/bash

# 🚀 SCRIPT PARA RODAR BACKEND LOCAL + NGROK

echo "\n📄 Setup Backend Local com ngrok...\n"

# 1. Instalar dependências
echo "1. Instalando dependências..."
npm install

# 2. Build
echo "\n2. Buildando projeto..."
npm run build

# 3. Rodar em background
echo "\n3. Iniciando backend em http://localhost:3000/api"
npm run start:prod &
BACKEND_PID=$!

# 4. Aguardar backend iniciar
echo "\n4. Aguardando backend iniciar..."
sleep 3

# 5. Rodar ngrok
echo "\n5. Iniciando ngrok..."
echo "\n🔍 Procure por: Forwarding                    https://..."
echo "📋 Copie essa URL e use no frontend!\n"

ngrok http 3000

# Cleanup
trap "kill $BACKEND_PID" EXIT
