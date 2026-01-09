#!/bin/bash

echo "═══════════════════════════════════════════════════════════════"
echo "  🚀 BLADE BILLING - MERCADO PAGO SETUP AUTOMÁTICO"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📍 PASSO 1: Entrando na pasta backend...${NC}"
cd backend

echo -e "${GREEN}✅ Na pasta backend${NC}"
echo ""

echo -e "${YELLOW}📍 PASSO 2: Instalando axios...${NC}"
npm install axios

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao instalar axios${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Axios instalado${NC}"
echo ""

echo -e "${YELLOW}📍 PASSO 3: Gerando Prisma Client...${NC}"
npx prisma generate

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao gerar Prisma${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prisma gerado${NC}"
echo ""

echo -e "${YELLOW}📍 PASSO 4: Fazendo push do schema pro banco...${NC}"
npx prisma db push

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao fazer push do schema${NC}"
    echo -e "${YELLOW}Verifique se o DATABASE_URL está correto no .env${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Schema enviado pro banco${NC}"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}  🎉 SETUP COMPLETO!${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Próximos passos:"
echo "1. npm run dev (para rodar o servidor)"
echo "2. Testar os endpoints com Postman"
echo "3. git push (para deploy em Vercel)"
echo ""
echo -e "${GREEN}Bora lá! 🚀${NC}"
