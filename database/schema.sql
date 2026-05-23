-- Tabela de projetos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de checklists
CREATE TABLE checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies (Row Level Security) - desabilitado pra tutorial
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;

-- Policy pública (tutorial sem auth)
CREATE POLICY "public_access" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_access" ON checklists FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- SEED DATA
-- =============================================

-- Aula 1: Deploy na Vercel
INSERT INTO projects (id, name) VALUES
  ('a1a1a1a1-1111-1111-1111-111111111111', 'Aula 1 - Deploy na Vercel');

INSERT INTO checklists (project_id, title, done) VALUES
  ('a1a1a1a1-1111-1111-1111-111111111111', 'Abrir site da Vercel', true),
  ('a1a1a1a1-1111-1111-1111-111111111111', 'Conectar com GitHub', true),
  ('a1a1a1a1-1111-1111-1111-111111111111', 'Selecionar o projeto que deseja subir', true),
  ('a1a1a1a1-1111-1111-1111-111111111111', 'Subir versão', true);

-- Aula 2: Deploy Fullstack no Render
INSERT INTO projects (id, name) VALUES
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Aula 2 - Deploy Fullstack no Render');

INSERT INTO checklists (project_id, title, done) VALUES
  -- Passo 1: Provisionar PostgreSQL
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Acessar Dashboard do Render e fazer login com GitHub', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Clicar em New + e selecionar PostgreSQL', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Configurar campos: Name, Database, Region e Instance Type (Free)', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Clicar em Create Database', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Aguardar status Available (Verde)', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Copiar Internal/External Database URL na seção Connections', true),
  -- Passo 2: Deploy do Backend (Web Service)
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Clicar em New + e selecionar Web Service', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Conectar com repositório do GitHub', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Configurar: Name, Root Directory, Runtime, Build e Start Command', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Adicionar variáveis de ambiente (DATABASE_URL e PORT)', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Escolher plano Free e clicar em Create Web Service', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Aguardar status Live e copiar URL pública', true),
  -- Passo 3: Deploy do Frontend (Static Site)
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Atualizar URL da API no código do frontend e fazer push', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Clicar em New + e selecionar Static Site', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Selecionar repositório do frontend', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Configurar: Name, Root Directory, Build Command e Publish Directory', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Adicionar variável BACKEND_URL com URL do Web Service', true),
  ('a2a2a2a2-2222-2222-2222-222222222222', 'Clicar em Create Static Site', true);

-- Aula 3: Supabase
INSERT INTO projects (id, name) VALUES
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Aula 3 - Supabase');

INSERT INTO checklists (project_id, title, done) VALUES
  -- Passo 1: Criar conta e projeto no Supabase
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Acessar supabase.com e clicar em Start your project', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Fazer login com GitHub', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Autorizar o Supabase no GitHub', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Criar uma nova Organization (ou usar a default)', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Clicar em New Project', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Preencher: Name, Database Password e Region (South America)', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Clicar em Create new project e aguardar provisionamento', false),
  -- Passo 2: Obter credenciais (API Keys)
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Ir em Settings > API no dashboard do projeto', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Copiar Project URL (NEXT_PUBLIC_SUPABASE_URL)', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Copiar anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Copiar service_role key (SUPABASE_SERVICE_ROLE_KEY)', false),
  -- Passo 3: Criar tabelas no banco
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Abrir SQL Editor no dashboard do Supabase', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Colar conteudo do arquivo database/schema.sql', false),
  -- Passo 4: Configurar projeto Next.js
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Instalar dependência: npm install @supabase/supabase-js', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Criar arquivo .env.local com as 3 variáveis (URL, ANON_KEY, SERVICE_ROLE_KEY)', false),
  -- Passo 6: Testar e validar
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Rodar npm run dev e abrir localhost:3000', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Verificar projetos carregando do Supabase', false),
  ('a3a3a3a3-3333-3333-3333-333333333333', 'Atualizar checklist Aula 3 - Supabase', false);
