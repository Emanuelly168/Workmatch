import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { profissionais } from './db/schema';
import { eq } from 'drizzle-orm';

const app = express();
app.use(cors());
app.use(express.json());

const sqlite = new Database('Workmatch.db');
const db = drizzle(sqlite);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS profissionais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    servico TEXT NOT NULL
  );
`);

app.get('/profissionais', async (req, res) => {
  const result = await db.select().from(profissionais);
  res.json(result);
});

app.post('/profissionais', async (req, res) => {
  const { nome, servico } = req.body;
  if (!nome || !servico) return res.status(400).json({ error: 'Preencha todos os campos' });
  
  await db.insert(profissionais).values({ nome, servico });
  res.status(201).send();
});

app.delete('/profissionais/:id', async (req, res) => {
  const { id } = req.params;
  await db.delete(profissionais).where(eq(profissionais.id, Number(id)));
  res.status(204).send();
});

app.listen(3000, () => console.log('API do WorkMatch rodando na porta 3000'));