# SaaS Gestão Confeitaria 7.0

Sistema completo de gestão para confeitarias com autenticação via webhook Stripe e persistência de sessão.

## 🚀 Como Funciona

### Fluxo de Autenticação
1. **Usuário assina** → Paga via Stripe Checkout
2. **Webhook processa** → Cria usuário no Supabase automaticamente
3. **Email enviado** → Link de acesso direto (magic link)
4. **Sessão persistente** → Usuário fica logado automaticamente

### Tecnologias
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (Auth + Database + Edge Functions)
- **Pagamentos**: Stripe + Webhooks
- **Deploy**: Netlify (Frontend) + Supabase (Backend)

## 🛠️ Configuração para Deploy

### 1. Variáveis de Ambiente

#### Frontend (Netlify)
```
VITE_SUPABASE_URL=https://stasbepnjxxyifjhprwu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0YXNiZXBuanh4eWlmamhwcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDgwNDAsImV4cCI6MjA3MDQyNDA0MH0.K2Sbf8kmldeUN2OtegGAhATEP7jvUJ6us-5SNemTwZY
VITE_SUPABASE_FUNCTIONS_URL=https://stasbepnjxxyifjhprwu.supabase.co/functions/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Rt8pCB1cuFGKX9I3b7x7HykxRsCoY42gCUxENl9EwYyTTXq2356MsHRjo8IejZXfch5q8RFzpRwzDPNvasifLOr00PJG0yQAA
VITE_STRIPE_CHECKOUT_URL=https://buy.stripe.com/test_dRmeVcfyGeKJ6np0lEefC03
```

#### Backend (Supabase Edge Functions)
```
STRIPE_SECRET_KEY=sk_test_... (sua chave secreta do Stripe)
STRIPE_WEBHOOK_SECRET=whsec_... (secret do webhook do Stripe)
```

### 2. Configurar Webhook no Stripe

1. Acesse [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Clique em "Add endpoint"
3. URL: `https://stasbepnjxxyifjhprwu.supabase.co/functions/v1/stripe-webhook`
4. Eventos para escutar:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copie o "Signing secret" e adicione como `STRIPE_WEBHOOK_SECRET`

### 3. Deploy das Edge Functions

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login no Supabase
supabase login

# Deploy das funções
supabase functions deploy stripe-webhook --project-ref stasbepnjxxyifjhprwu
```

### 4. Executar Migrações do Database

1. Vá no painel do Supabase > SQL Editor
2. Execute o conteúdo de `supabase/migrations/create_user_subscriptions.sql`

### 5. Deploy do Frontend

#### Netlify
1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `dist`

## 📋 Funcionalidades

### ✅ Sistema de Pagamento e Autenticação
- Landing page com checkout Stripe
- Webhook processa pagamento e cria usuário
- Login via magic link (sem senha)
- Sessão persistente no navegador
- Verificação automática de assinatura

### ✅ Dashboard Completo
- 📦 **Pedidos**: CRUD completo com status
- 👥 **Clientes**: Gestão de dados e contatos
- 🎂 **Produtos**: Catálogo com preços e categorias
- 🔍 **Busca**: Filtros em tempo real
- 📱 **Responsivo**: Funciona em todos os dispositivos

### ✅ Segurança
- Row Level Security (RLS) em todas as tabelas
- Políticas baseadas no usuário autenticado
- Webhook com verificação de assinatura
- Chaves secretas apenas no backend

## 🔄 Fluxo Completo

1. **Usuário acessa** → Landing page
2. **Clica "Começar"** → Stripe Checkout
3. **Paga assinatura** → Webhook ativado
4. **Webhook processa** → Cria usuário + assinatura no Supabase
5. **Usuário clica "Entrar"** → Digita email
6. **Recebe magic link** → Clica e entra automaticamente
7. **Sessão persistente** → Fica logado mesmo fechando navegador
8. **Acesso liberado** → Dashboard completo disponível

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis (copiar .env.example para .env)
cp .env.example .env

# Executar em desenvolvimento
npm run dev
```

## 📊 Monitoramento

- **Stripe Dashboard**: Acompanhe pagamentos e assinaturas
- **Supabase Dashboard**: Monitore usuários e dados
- **Logs**: Edge Functions mostram processamento dos webhooks

## 🆘 Troubleshooting

### Webhook não funciona
- Verifique se a URL está correta no Stripe
- Confirme se o `STRIPE_WEBHOOK_SECRET` está configurado
- Veja os logs na aba Functions do Supabase

### Usuário não consegue entrar
- Verifique se o pagamento foi processado no Stripe
- Confirme se o webhook foi executado (logs do Supabase)
- Verifique se o email está correto

### Sessão não persiste
- Confirme se `persistSession: true` está configurado
- Verifique se não há conflitos de localStorage
- Teste em modo incógnito para descartar cache