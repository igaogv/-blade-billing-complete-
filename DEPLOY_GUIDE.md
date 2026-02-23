# 🚀 GUIA COMPLETO DE DEPLOY - VERCEL + SUPABASE GRATUITO

## ⚠️ SETUP CRÍTICO PARA EVITAR ERROS 500/404

### 1️⃣ BACKEND: Variáveis de Ambiente no Vercel

Acesse: https://vercel.com/settings/projects

**Em: Settings > Environment Variables**

Adicione EXATAMENTE essas variáveis:

```
DATABASE_URL = postgresql://postgres.seu-projeto:sua-senha@seu-project.pooler.supabase.com:6543/postgres
  └─ Pega em: Supabase > Project Settings > Database > Connection Pooling Pool Mode
  └─ IMPORTANTE: Use o pooler, NÃO a direct connection
  └─ Supabase Free inclui pooler grátis!

JWT_SECRET = 7k9Lm@2XPiqHsVv08nBj35Ycz1dF3hGsT6uI*wQaE4ou1
  └─ Pode gerar novo: openssl rand -base64 32

NODE_ENV = production

CORS_ORIGIN = https://seu-frontend.vercel.app
  └─ Importante: adicione o domínio EXATO do frontend

MERCADOPAGO_ACCESS_TOKEN = APP_USR_xxxx (do seu dashboard do MP)
MERCADOPAGO_PUBLIC_KEY = APP_USR_xxxx
MERCADOPAGO_WEBHOOK_URL = https://seu-backend.vercel.app/api/mercadopago/webhook

FRONTEND_URL = https://seu-frontend.vercel.app
API_PORT = 3000 (Vercel ignora, mas deixe)
```

### 2️⃣ FRONTEND: Variáveis de Ambiente no Vercel

Acesse: https://vercel.com/settings/projects

**Em: Settings > Environment Variables (do projeto frontend)**

```
VITE_API_URL = https://seu-backend.vercel.app/api
VITE_ENV = production
```

### 3️⃣ SUPABASE: Configurar PostgreSQL

1. Acesse: https://supabase.com/dashboard
2. Entre em seu projeto
3. Vá em: Settings > Database
4. Observe:
   - **Connection String (Pooling)** ← USE ESTA!
   - Port: 6543 (pooler)
   - Username: postgres
   - Password: a senha que você criou

**Exemplo:**
```
postgresql://postgres.xxxx:suasenha@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
```

### 4️⃣ RODAR MIGRATIONS NO VERCEL

Após deployar, você precisa rodar as migrations:

**Opção 1: Local (Recomendado)**
```bash
# Na sua máquina, com .env configurado:
cd backend
npm run prisma:migrate

# Isso aplica a migration que adiciona userId
```

**Opção 2: Via Vercel CLI**
```bash
npm i -g vercel
vercel env pull .env.local

# Editar .env.local com as urls corretas
npx prisma migrate deploy
```

### 5️⃣ TESTAR LOGIN/CRIAÇÃO DE USUÁRIO

Depois que tudo estiver deployado:

1. Acesse: `https://seu-frontend.vercel.app`
2. Clique em "Criar Conta"
3. Preencha:
   - Email: seu@email.com
   - Senha: suasenha123!
   - Nome: Seu Nome
4. Clique em "Cadastre-se"

**Se receber erro 500:**
- Verifique DATABASE_URL no Vercel
- Verifique se migrations rodaram (erro de schema?)
- Verifique logs: `vercel logs seu-backend.vercel.app`

**Se receber erro 404:**
- Verifique CORS_ORIGIN no backend
- Verifique VITE_API_URL no frontend
- Verifique se nomes de domínio estão corretos

### 6️⃣ COMANDOS ÚTEIS

```bash
# Ver logs em tempo real
vercel logs seu-backend.vercel.app --tail

# Redeploy após mudanças nas envs
vercel redeploy

# Limpar cache
vercel remove seu-backend --confirm
vercel deploy --prod

# Verificar banco de dados
# Acesse Supabase Dashboard > SQL Editor
# Run: SELECT * FROM "users";
```

### 7️⃣ CHECKLIST FINAL (ANTES DE IR AO AR)

- [ ] DATABASE_URL configurada no Vercel backend
  └─ Use o pooler (porta 6543)
  
- [ ] JWT_SECRET configurado no Vercel backend
  └─ Não deixe vazio, use algo seguro
  
- [ ] CORS_ORIGIN configurada no Vercel backend
  └─ Coloque o domínio do frontend (sem http://)
  
- [ ] VITE_API_URL configurada no Vercel frontend
  └─ Coloque o domínio correto do backend (com /api)
  
- [ ] Migrations rodaram
  └─ Execute: npx prisma migrate deploy
  
- [ ] Usuário consegue fazer login
  └─ Teste: criar conta > fazer login
  
- [ ] Usuário consegue criar cliente
  └─ Teste: criar novo cliente
  
- [ ] Usuário consegue criar fatura
  └─ Teste: criar nova fatura

### 8️⃣ SE AINDA DER ERRO 500

1. Verifique os logs:
```bash
vercel logs seu-backend.vercel.app --tail
```

2. Procure por:
   - "ECONNREFUSED" = Banco de dados não conecta
   - "JWT_SECRET" = Variável não configurada
   - "CORS" = Origem não permitida
   - "relation \"users\" does not exist" = Migration não rodou

3. Solução:
   - Erro de conexão BD? Verifique DATABASE_URL
   - Erro de JWT? Verifique JWT_SECRET
   - Erro de CORS? Verifique CORS_ORIGIN
   - Erro de schema? Execute migrations de novo

---

## 🎯 RESUMO: O que mudei para consertar

✅ Adicionei `userId` em Client, Invoice, Appointment (schema + migration)
✅ Filtro de userId em todos os services (segurança multi-tenant)
✅ CORS whitelist ao invés de `origin: true` (segurança)
✅ Variáveis de ambiente documentadas (.env.example)
✅ JWT com payload correto (`sub` + `email`)
✅ Todos os controllers com @UseGuards(JwtAuthGuard)

## 🚀 PRÓXIMOS PASSOS

1. **Deploy Backend**: git push > Vercel auto-deploy
2. **Deploy Frontend**: git push > Vercel auto-deploy
3. **Rodar migrations**: `npx prisma migrate deploy`
4. **Testar login**: Criar conta > fazer login
5. **Ir ao ar! 🎉**

---
