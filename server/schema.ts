import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  senha: text('senha').notNull(),
  nome: text('nome').notNull(),
  tipo: text('tipo').notNull(), // 'cliente' ou 'freelancer'
  telefone: text('telefone'),
  descricao: text('descricao'),
  foto: text('foto'),
  criado_em: integer('criado_em').notNull(),
});

export const profissionais = sqliteTable('profissionais', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  servico: text('servico').notNull(),
});

export const vagas = sqliteTable('vagas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  usuario_id: integer('usuario_id').notNull(),
  titulo: text('titulo').notNull(),
  descricao: text('descricao').notNull(),
  categoria: text('categoria').notNull(),
  orcamento: real('orcamento').notNull(),
  status: text('status').notNull(), // 'aberta', 'em_progresso', 'finalizada'
  criado_em: integer('criado_em').notNull(),
  atualizado_em: integer('atualizado_em').notNull(),
});

export const propostas = sqliteTable('propostas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vaga_id: integer('vaga_id').notNull(),
  freelancer_id: integer('freelancer_id').notNull(),
  valor: real('valor').notNull(),
  descricao: text('descricao').notNull(),
  status: text('status').notNull(), // 'pendente', 'aceita', 'recusada'
  criado_em: integer('criado_em').notNull(),
});

export const pagamentos = sqliteTable('pagamentos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vaga_id: integer('vaga_id').notNull(),
  cliente_id: integer('cliente_id').notNull(),
  freelancer_id: integer('freelancer_id').notNull(),
  valor: real('valor').notNull(),
  status: text('status').notNull(), // 'pendente', 'processando', 'concluido', 'cancelado'
  metodo_pagamento: text('metodo_pagamento'),
  criado_em: integer('criado_em').notNull(),
});