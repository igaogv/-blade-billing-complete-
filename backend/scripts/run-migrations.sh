#!/bin/bash

# Script para rodar Prisma migrations no Supabase
# Uso: ./scripts/run-migrations.sh

set -e  # Exit on error

echo "🔄 Iniciando Prisma migrations..."

# Verificar se .env existe
if [ ! -f ".env" ]; then
  echo "❌ Arquivo .env não encontrado!"
  echo "Por favor, crie o arquivo .env com as variáveis de ambiente"
  exit 1
fi

echo "📦 Gerando Prisma client..."
npm run prisma:generate

echo "📊 Executando migrations..."
npm run prisma:migrate

echo "✅ Migrations executadas com sucesso!"
echo ""
echo "🎉 Database está pronto!"
