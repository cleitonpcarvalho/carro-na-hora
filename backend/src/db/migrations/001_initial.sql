-- ============================================================
-- CARRO DA HORA — INITIAL SCHEMA
-- ============================================================

-- ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  name        VARCHAR(255) NOT NULL DEFAULT 'Administrador',
  created_at  TIMESTAMP DEFAULT NOW()
);

-- SITE SETTINGS (key-value store for all configurable data)
CREATE TABLE IF NOT EXISTS site_settings (
  id          SERIAL PRIMARY KEY,
  key         VARCHAR(255) UNIQUE NOT NULL,
  value       TEXT,
  label       VARCHAR(255),
  type        VARCHAR(50) DEFAULT 'text',
  group_name  VARCHAR(100) DEFAULT 'geral'
);

-- PAGES
CREATE TABLE IF NOT EXISTS pages (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(255) UNIQUE NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- SECTIONS (belongs to a page, stores content as JSONB)
CREATE TABLE IF NOT EXISTS sections (
  id          SERIAL PRIMARY KEY,
  page_id     INTEGER REFERENCES pages(id) ON DELETE CASCADE,
  slug        VARCHAR(255) NOT NULL,
  title       VARCHAR(255),
  content     JSONB DEFAULT '{}',
  order_num   INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(page_id, slug)
);

-- MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS media (
  id            SERIAL PRIMARY KEY,
  filename      VARCHAR(500) NOT NULL,
  original_name VARCHAR(500),
  mime_type     VARCHAR(100),
  size_bytes    INTEGER,
  url           TEXT NOT NULL,
  alt_text      VARCHAR(500),
  category      VARCHAR(100) DEFAULT 'geral',
  tags          TEXT[],
  created_at    TIMESTAMP DEFAULT NOW()
);

-- VEHICLES (cars listed on the site)
CREATE TABLE IF NOT EXISTS vehicles (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  brand           VARCHAR(255),
  model           VARCHAR(255),
  year            INTEGER,
  fuel            VARCHAR(100),
  mileage         INTEGER,
  price           DECIMAL(10,2),
  color           VARCHAR(100),
  transmission    VARCHAR(100),
  power           VARCHAR(100),
  description     TEXT,
  extra_info      JSONB DEFAULT '{}',
  images          TEXT[] DEFAULT '{}',
  is_featured     BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  whatsapp_message TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SEED: INITIAL SITE SETTINGS
-- ============================================================

INSERT INTO site_settings (key, value, label, type, group_name) VALUES
  ('site_name',         'Carro da Hora',                                          'Nome do Site',              'text',  'geral'),
  ('site_tagline',      'O seu próximo automóvel está aqui.',                     'Slogan do Site',            'text',  'geral'),
  ('contact_phone',     '+351 932 992 377',                                       'Telefone',                  'text',  'contacto'),
  ('contact_email',     'perimetrodeeficacia@gmail.com',                          'Email de Contacto',         'text',  'contacto'),
  ('contact_address',   'Rua Quinta das Lavadeiras 8 B, 1750-239, Lisboa',        'Morada',                    'text',  'contacto'),
  ('contact_maps',      'https://maps.app.goo.gl/tFQTZ1pATAtxK6tC9',             'Link Google Maps',          'text',  'contacto'),
  ('whatsapp_number',   '351932992377',                                           'Número WhatsApp (sem +)',   'text',  'contacto'),
  ('resend_to_email',   'perimetrodeeficacia@gmail.com',                          'Email Destino Formulário',  'text',  'email'),
  ('social_instagram',  '',                                                       'Instagram URL',             'text',  'redes_sociais'),
  ('social_facebook',   '',                                                       'Facebook URL',              'text',  'redes_sociais'),
  ('social_youtube',    '',                                                       'YouTube URL',               'text',  'redes_sociais'),
  ('social_tiktok',     '',                                                       'TikTok URL',                'text',  'redes_sociais')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- SEED: PAGES AND SECTIONS
-- ============================================================

INSERT INTO pages (slug, title, description) VALUES
  ('home',      'Página Principal',  'Página inicial do site'),
  ('viaturas',  'Viaturas',          'Listagem de todos os veículos'),
  ('sobre',     'Sobre Nós',         'Sobre a Carro da Hora'),
  ('contacto',  'Contacto',          'Página de contacto')
ON CONFLICT (slug) DO NOTHING;

-- SECTIONS FOR HOME PAGE
INSERT INTO sections (page_id, slug, title, content, order_num) VALUES
(
  (SELECT id FROM pages WHERE slug = 'home'),
  'hero',
  'Hero Principal',
  '{
    "headline": "Encontre o Seu Próximo Automóvel na Hora Certa.",
    "subheadline": "Acesso exclusivo a viaturas premium selecionadas com rigor. Rapidez na negociação, transparência em cada detalhe.",
    "cta_primary_text": "Ver Viaturas",
    "cta_primary_url": "/viaturas",
    "cta_secondary_text": "Falar no WhatsApp",
    "background_image": ""
  }',
  1
),
(
  (SELECT id FROM pages WHERE slug = 'home'),
  'featured_vehicles',
  'Viaturas em Destaque',
  '{
    "title": "Viaturas em Destaque",
    "subtitle": "Uma seleção criteriosa de automóveis prontos para si. Cada viatura passa por uma verificação rigorosa antes de chegar até você."
  }',
  2
),
(
  (SELECT id FROM pages WHERE slug = 'home'),
  'why_us',
  'Porquê a Carro da Hora',
  '{
    "title": "Porquê Escolher a Carro da Hora?",
    "subtitle": "Não somos apenas um stand. Somos o elo entre si e o automóvel que merece.",
    "features": [
      {
        "icon": "shield",
        "title": "Transparência Total",
        "description": "Todas as viaturas com historial verificado. Sem surpresas, sem letras pequenas."
      },
      {
        "icon": "zap",
        "title": "Negociação Rápida",
        "description": "Do primeiro contacto à chave na mão em tempo recorde. Valorizamos o seu tempo."
      },
      {
        "icon": "award",
        "title": "Seleção Premium",
        "description": "Cada automóvel é escolhido com critério. Só chegam até si viaturas que passam nos nossos padrões."
      },
      {
        "icon": "headphones",
        "title": "Apoio Personalizado",
        "description": "A nossa equipa acompanha-o do início ao fim. Estamos disponíveis para responder a cada dúvida."
      }
    ]
  }',
  3
),
(
  (SELECT id FROM pages WHERE slug = 'home'),
  'cta_banner',
  'Banner de Conversão',
  '{
    "title": "Pronto para Encontrar o Seu Automóvel?",
    "subtitle": "Fale connosco agora mesmo. A negociação mais rápida de Lisboa começa aqui.",
    "cta_text": "Contactar no WhatsApp",
    "background_image": ""
  }',
  4
),
(
  (SELECT id FROM pages WHERE slug = 'home'),
  'testimonials',
  'Testemunhos',
  '{
    "title": "O Que Dizem os Nossos Clientes",
    "items": [
      {
        "name": "Miguel Ferreira",
        "text": "Processo incrivelmente rápido. Em menos de 48 horas tinha o meu carro novo. Recomendo a todos.",
        "rating": 5
      },
      {
        "name": "Ana Sousa",
        "text": "Excelente atendimento, total transparência no processo. Voltarei certamente para o próximo automóvel.",
        "rating": 5
      },
      {
        "name": "Carlos Mendes",
        "text": "Encontrei exactamente o que procurava ao melhor preço. A equipa foi fantástica do início ao fim.",
        "rating": 5
      }
    ]
  }',
  5
);

-- SECTIONS FOR SOBRE PAGE
INSERT INTO sections (page_id, slug, title, content, order_num) VALUES
(
  (SELECT id FROM pages WHERE slug = 'sobre'),
  'about_hero',
  'Cabeçalho Sobre Nós',
  '{
    "title": "Sobre a Carro da Hora",
    "subtitle": "Uma história construída sobre confiança, velocidade e paixão por automóveis."
  }',
  1
),
(
  (SELECT id FROM pages WHERE slug = 'sobre'),
  'about_story',
  'A Nossa História',
  '{
    "title": "Nascemos para Simplificar a Compra do Seu Automóvel",
    "text": "Na Carro da Hora, acreditamos que comprar um automóvel deve ser uma experiência positiva — sem burocracia excessiva, sem pressão, sem incertezas. Surgimos com uma missão clara: colocar as melhores viaturas à disposição de quem as procura, com a rapidez que o mercado atual exige e a confiança que cada cliente merece. Localizados no coração de Lisboa, a nossa equipa de profissionais dedicados trabalha todos os dias para garantir que cada transação seja transparente, ágil e satisfatória. Do primeiro contacto à entrega das chaves, estamos consigo em cada passo.",
    "image": ""
  }',
  2
),
(
  (SELECT id FROM pages WHERE slug = 'sobre'),
  'about_values',
  'Os Nossos Valores',
  '{
    "title": "Os Pilares que nos Guiam",
    "values": [
      { "title": "Confiança", "description": "A nossa reputação é construída negócio a negócio. Cada cliente satisfeito é a nossa melhor referência." },
      { "title": "Rapidez", "description": "Sabemos que o seu tempo é precioso. Por isso, tornamos o processo tão ágil quanto possível." },
      { "title": "Qualidade", "description": "Não comprometemos nos padrões. Cada viatura é verificada e selecionada com rigor antes de entrar no nosso portefólio." }
    ]
  }',
  3
);

-- SECTIONS FOR CONTACTO PAGE
INSERT INTO sections (page_id, slug, title, content, order_num) VALUES
(
  (SELECT id FROM pages WHERE slug = 'contacto'),
  'contact_hero',
  'Cabeçalho Contacto',
  '{
    "title": "Fale Connosco",
    "subtitle": "Estamos prontos para ajudá-lo a encontrar o automóvel certo. Contacte-nos por qualquer canal."
  }',
  1
),
(
  (SELECT id FROM pages WHERE slug = 'contacto'),
  'contact_map',
  'Mapa e Morada',
  '{
    "maps_embed_url": "https://maps.app.goo.gl/tFQTZ1pATAtxK6tC9",
    "address": "Rua Quinta das Lavadeiras 8 B, 1750-239, Lisboa",
    "phone": "+351 932 992 377",
    "email": "perimetrodeeficacia@gmail.com"
  }',
  2
)
ON CONFLICT DO NOTHING;
