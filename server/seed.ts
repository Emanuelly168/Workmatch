import Database from 'better-sqlite3';

const sqlite = new Database('Workmatch.db');

// Garantir que as tabelas existem antes de popular
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    telefone TEXT,
    descricao TEXT,
    foto TEXT,
    criado_em INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS profissionais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    servico TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS vagas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    categoria TEXT NOT NULL,
    orcamento REAL NOT NULL,
    status TEXT NOT NULL,
    criado_em INTEGER NOT NULL,
    atualizado_em INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS propostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vaga_id INTEGER NOT NULL,
    freelancer_id INTEGER NOT NULL,
    valor REAL NOT NULL,
    descricao TEXT NOT NULL,
    status TEXT NOT NULL,
    criado_em INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vaga_id INTEGER NOT NULL,
    cliente_id INTEGER NOT NULL,
    freelancer_id INTEGER NOT NULL,
    valor REAL NOT NULL,
    status TEXT NOT NULL,
    metodo_pagamento TEXT,
    criado_em INTEGER NOT NULL
  );
`);

const agora = Date.now();

// ========== LIMPAR DADOS ANTIGOS ==========
// (garante que rodar o seed duas vezes não duplica dados)
sqlite.exec(`
  DELETE FROM pagamentos;
  DELETE FROM propostas;
  DELETE FROM vagas;
  DELETE FROM profissionais;
  DELETE FROM usuarios;
`);

console.log('🗑️  Dados antigos removidos...');

// ========== USUÁRIOS ==========
// 3 freelancers e 2 clientes de exemplo

const insertUsuario = sqlite.prepare(`
  INSERT INTO usuarios (email, senha, nome, tipo, telefone, descricao, criado_em)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// Freelancers
insertUsuario.run('ana@workmatch.com',      'senha123', 'Ana Silva',       'freelancer', '(11) 91234-5678', 'Desenvolvedora mobile com 4 anos de experiência em React Native.', agora);
insertUsuario.run('carlos@workmatch.com',   'senha123', 'Carlos Mendes',   'freelancer', '(21) 99876-5432', 'Designer UX/UI especializado em interfaces modernas e acessíveis.', agora);
insertUsuario.run('julia@workmatch.com',    'senha123', 'Julia Rocha',     'freelancer', '(31) 98765-4321', 'Redatora e especialista em marketing de conteúdo para redes sociais.', agora);

// Clientes
insertUsuario.run('empresa@workmatch.com',  'senha123', 'Tech Solutions',  'cliente',    '(11) 3456-7890',  'Startup de tecnologia em busca de talentos para projetos inovadores.', agora);
insertUsuario.run('joao@workmatch.com',     'senha123', 'João Pereira',    'cliente',    '(85) 99111-2233', 'Empreendedor buscando profissionais para meu negócio local.', agora);

console.log('👥 Usuários criados...');

// ========== VAGAS (serviços publicados pelos freelancers) ==========

const insertVaga = sqlite.prepare(`
  INSERT INTO vagas (usuario_id, titulo, descricao, categoria, orcamento, status, criado_em, atualizado_em)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Ana (id=1) publica 2 serviços
insertVaga.run(1, 'Desenvolvimento de App Mobile',
  'Criação de aplicativos iOS e Android com React Native. Entrego projetos completos com design, integração de API e publicação nas lojas.',
  'desenvolvimento', 5000.00, 'aberta', agora, agora);

insertVaga.run(1, 'Integração de API REST',
  'Integração de APIs externas em projetos mobile ou web. Experiência com autenticação JWT, pagamentos e geolocalização.',
  'desenvolvimento', 2500.00, 'aberta', agora, agora);

// Carlos (id=2) publica 2 serviços
insertVaga.run(2, 'Design de Interface (UI/UX)',
  'Criação de protótipos e layouts no Figma para apps e sites. Entrego telas prontas para desenvolvedores com guia de estilo.',
  'design', 3000.00, 'aberta', agora, agora);

insertVaga.run(2, 'Criação de Logo e Identidade Visual',
  'Desenvolvimento completo de identidade visual: logo, paleta de cores, tipografia e manual da marca.',
  'design', 1500.00, 'em_progresso', agora, agora);

// Julia (id=3) publica 2 serviços
insertVaga.run(3, 'Gestão de Redes Sociais',
  'Planejamento e criação de conteúdo para Instagram, LinkedIn e TikTok. Pacote mensal com 20 posts + relatório de desempenho.',
  'marketing', 1800.00, 'aberta', agora, agora);

insertVaga.run(3, 'Redação de Artigos e Blog Posts',
  'Produção de conteúdo SEO-friendly para blogs e sites. Entrega de artigos revisados com até 1500 palavras.',
  'escrita', 800.00, 'aberta', agora, agora);

console.log('💼 Serviços criados...');

// ========== PROPOSTAS ==========
// Cliente Tech Solutions (id=4) envia propostas para alguns serviços

const insertProposta = sqlite.prepare(`
  INSERT INTO propostas (vaga_id, freelancer_id, valor, descricao, status, criado_em)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// Tech Solutions propõe para o app mobile da Ana
insertProposta.run(1, 4, 4500.00,
  'Temos interesse no serviço! Podemos fechar por R$ 4.500 com prazo de 45 dias. Nosso projeto é um app de delivery.',
  'pendente', agora);

// Tech Solutions propõe para o design do Carlos
insertProposta.run(3, 4, 2800.00,
  'Gostei do portfólio! Proponho R$ 2.800 para criar as telas do nosso aplicativo. Temos o briefing pronto.',
  'aceita', agora);

// João Pereira (id=5) propõe para gestão de redes da Julia
insertProposta.run(5, 5, 1600.00,
  'Olá Julia! Tenho uma padaria e quero crescer no Instagram. Topo R$ 1.600 por mês. Vamos conversar?',
  'pendente', agora);

console.log('📨 Propostas criadas...');

// ========== PAGAMENTO DE EXEMPLO ==========
// Pagamento referente ao design do Carlos (proposta aceita)

const insertPagamento = sqlite.prepare(`
  INSERT INTO pagamentos (vaga_id, cliente_id, freelancer_id, valor, status, metodo_pagamento, criado_em)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertPagamento.run(4, 4, 2, 1500.00, 'concluido', 'pix', agora);

console.log('💳 Pagamento de exemplo criado...');

// ========== RESUMO FINAL ==========
console.log('\n✅ Seed concluído com sucesso!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 Dados inseridos:');
console.log('   👤 5 usuários (3 freelancers + 2 clientes)');
console.log('   💼 6 serviços publicados');
console.log('   📨 3 propostas (1 aceita, 2 pendentes)');
console.log('   💳 1 pagamento concluído');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n🔑 Contas para teste:');
console.log('   FREELANCER → ana@workmatch.com     / senha123');
console.log('   FREELANCER → carlos@workmatch.com  / senha123');
console.log('   FREELANCER → julia@workmatch.com   / senha123');
console.log('   CLIENTE    → empresa@workmatch.com / senha123');
console.log('   CLIENTE    → joao@workmatch.com    / senha123');

sqlite.close();