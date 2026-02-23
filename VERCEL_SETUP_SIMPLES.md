🚀 GUIA RÁPIDO - COPIAR E COLAR NO VERCEL
=========================================

## PASSO 1: Ir no Vercel

1. Abra: https://vercel.com/dashboard
2. Clique no projeto "blade-billing-complete"
3. Clique em "Settings" (no topo)
4. Clique em "Environment Variables" (na esquerda)

## PASSO 2: Deletar variáveis antigas

Se já tiver variáveis antigas, delete tudo primeiro.

## PASSO 3: ADICIONAR AS VARIÁVEIS (Backend)

Para CADA linha abaixo: 
- Copie o nome (esquerda do =)
- Copie o valor (direita do =)
- Clique "Add"

### Backend VARIABLES (copiar uma por uma):

NAME: DATABASE_URL
VALUE: postgresql://postgres.dkpiceyiwlgmtfazolx:ltFqHUZDG0ABQHSh@aws-1-sa-east-1.pooler.supabase.com:6543/postgres

---

NAME: CORS_ORIGIN
VALUE: https://blade-billing-complete-jh2k-nhres9889.vercel.app

---

NAME: JWT_SECRET
VALUE: 7k9Lm@2XPiqHsVv08nBj35Ycz1dF3hGsT6uI*wQaE4ou1

---

NAME: NODE_ENV
VALUE: production

---

NAME: API_PORT
VALUE: 3000

---

NAME: FRONTEND_URL
VALUE: https://blade-billing-complete-jh2k-nhres9889.vercel.app

---

NAME: MERCADOPAGO_ACCESS_TOKEN
VALUE: APP_USR_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

---

NAME: MERCADOPAGO_PUBLIC_KEY
VALUE: APP_USR_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

---

NAME: MERCADOPAGO_WEBHOOK_URL
VALUE: https://blade-billing-complete.vercel.app/api/mercadopago/webhook

---

NAME: WHATSAPP_PHONE_NUMBER_ID
VALUE: seu_phone_id

---

NAME: WHATSAPP_ACCESS_TOKEN
VALUE: seu_access_token

---

## PASSO 4: Aguardar redeploy automático

Depois de adicionar, Vercel vai fazer um novo deploy automático.
Vai aparecer em Deployments > pode levar 2-3 minutos.

## PASSO 5: Testar login

Abra: https://blade-billing-complete-jh2k-nhres9889.vercel.app/login

Tente fazer login com:
Email: seu_email@gmail.com
Senha: qualquer_senha

Se der erro, vem o próximo passo.

---

⚠️ IMPORTANTE:

- DATABASE_URL: Essa string você copiou em Supabase > Settings > Database > Connection string (copie a COM POOLING)
- CORS_ORIGIN: Esse é o URL do seu frontend (com o hash do Vercel)
- JWT_SECRET: Pode deixar esse mesmo ou gerar outro em: https://generate-secret.vercel.app/

---

Já fiz isso? 👇
