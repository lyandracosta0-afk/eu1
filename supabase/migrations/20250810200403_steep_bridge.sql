/*
  # Tabela de assinaturas de usuários

  1. Nova Tabela
     - `user_subscriptions` - Controla o status das assinaturas dos usuários
       - `id` (uuid, primary key)
       - `user_id` (uuid, referência para auth.users)
       - `email` (text, email do usuário)
       - `stripe_customer_id` (text, ID do cliente no Stripe)
       - `stripe_subscription_id` (text, ID da assinatura no Stripe)
       - `subscription_status` (text, status da assinatura)
       - `current_period_start` (timestamp, início do período atual)
       - `current_period_end` (timestamp, fim do período atual)
       - `created_at` (timestamp)
       - `updated_at` (timestamp)

  2. Segurança
     - Enable RLS na tabela `user_subscriptions`
     - Política para usuários autenticados acessarem apenas seus próprios dados

  3. Índices
     - Índice no email para busca rápida
     - Índice no stripe_customer_id para webhook lookups
*/

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas para user_subscriptions
CREATE POLICY "Users can read their own subscription"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all subscriptions"
  ON user_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_email ON user_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();