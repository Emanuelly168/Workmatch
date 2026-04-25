import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const profissionais = sqliteTable('profissionais', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  servico: text('servico').notNull(),
});