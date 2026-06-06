import express, { Request, Response } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { usuarios, profissionais, vagas, propostas, pagamentos } from './db/schema';
import { eq, and } from 'drizzle-orm';

const app = express();
app.use(cors());
app.use(express.json());

const sqlite = new Database('Workmatch.db');
const db = drizzle(sqlite);

// Inicializar tabelas
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

// ========== AUTENTICAÇÃO ==========

app.post('/auth/registro', async (req: Request, res: Response) => {
  try {
    const { email, senha, nome, tipo, telefone } = req.body;

    if (!email || !senha || !nome || !tipo) {
      return res.status(400).json({ error: 'Email, senha, nome e tipo são obrigatórios' });
    }

    if (!['cliente', 'freelancer'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo deve ser cliente ou freelancer' });
    }

    await db.insert(usuarios).values({
      email,
      senha, 
      nome,
      tipo,
      telefone: telefone || null,
      criado_em: Date.now(),
    });

    return res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    return res.status(500).json({ error: error.message });
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .then((result) => result[0]);

    if (!user || user.senha !== senha) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    return res.json({
      id: user.id,
      email: user.email,
      nome: user.nome,
      tipo: user.tipo,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ========== USUÁRIOS ==========

app.get('/usuarios/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, Number(id)))
      .then((result) => result[0]);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/usuarios/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, telefone, descricao, foto } = req.body;

    await db
      .update(usuarios)
      .set({ nome, telefone, descricao, foto })
      .where(eq(usuarios.id, Number(id)));

    return res.json({ message: 'Usuário atualizado' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/usuarios/tipo/:tipo', async (req: Request, res: Response) => {
  try {
    const { tipo } = req.params;
    const result = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.tipo, tipo));

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ========== PROFISSIONAIS ==========

app.get('/profissionais', async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(profissionais);
    res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/profissionais', async (req: Request, res: Response) => {
  try {
    const { nome, servico } = req.body;
    if (!nome || !servico) {
      return res.status(400).json({ error: 'Nome e serviço são obrigatórios' });
    }

    await db.insert(profissionais).values({ nome, servico });
    return res.status(201).json({ message: 'Profissional criado' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/profissionais/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(profissionais).where(eq(profissionais.id, Number(id)));
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ========== VAGAS/JOBS ==========

app.post('/vagas', async (req: Request, res: Response) => {
  try {
    const { usuario_id, titulo, descricao, categoria, orcamento } = req.body;

    if (!usuario_id || !titulo || !descricao || !categoria || !orcamento) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const result = await db.insert(vagas).values({
      usuario_id,
      titulo,
      descricao,
      categoria,
      orcamento,
      status: 'aberta',
      criado_em: Date.now(),
      atualizado_em: Date.now(),
    });

    return res.status(201).json({ id: result, message: 'Vaga criada com sucesso' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/vagas', async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(vagas);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/vagas/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vaga = await db
      .select()
      .from(vagas)
      .where(eq(vagas.id, Number(id)))
      .then((result) => result[0]);

    if (!vaga) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    return res.json(vaga);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/vagas/usuario/:usuario_id', async (req: Request, res: Response) => {
  try {
    const { usuario_id } = req.params;
    const result = await db
      .select()
      .from(vagas)
      .where(eq(vagas.usuario_id, Number(usuario_id)));

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/vagas/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, categoria, orcamento, status } = req.body;

    await db
      .update(vagas)
      .set({
        titulo,
        descricao,
        categoria,
        orcamento,
        status,
        atualizado_em: Date.now(),
      })
      .where(eq(vagas.id, Number(id)));

    return res.json({ message: 'Vaga atualizada' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/vagas/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(vagas).where(eq(vagas.id, Number(id)));
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ========== PROPOSTAS/BIDS ==========

app.post('/propostas', async (req: Request, res: Response) => {
  try {
    const { vaga_id, freelancer_id, valor, descricao } = req.body;

    if (!vaga_id || !freelancer_id || !valor || !descricao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const result = await db.insert(propostas).values({
      vaga_id,
      freelancer_id,
      valor,
      descricao,
      status: 'pendente',
      criado_em: Date.now(),
    });

    return res.status(201).json({ id: result, message: 'Proposta enviada com sucesso' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/propostas/vaga/:vaga_id', async (req: Request, res: Response) => {
  try {
    const { vaga_id } = req.params;
    const result = await db
      .select()
      .from(propostas)
      .where(eq(propostas.vaga_id, Number(vaga_id)));

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/propostas/freelancer/:freelancer_id', async (req: Request, res: Response) => {
  try {
    const { freelancer_id } = req.params;
    const result = await db
      .select()
      .from(propostas)
      .where(eq(propostas.freelancer_id, Number(freelancer_id)));

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/propostas/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pendente', 'aceita', 'recusada'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    await db.update(propostas).set({ status }).where(eq(propostas.id, Number(id)));

    return res.json({ message: 'Proposta atualizada' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ========== PAGAMENTOS ==========

app.post('/pagamentos', async (req: Request, res: Response) => {
  try {
    const { vaga_id, cliente_id, freelancer_id, valor, metodo_pagamento } = req.body;

    if (!vaga_id || !cliente_id || !freelancer_id || !valor) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const result = await db.insert(pagamentos).values({
      vaga_id,
      cliente_id,
      freelancer_id,
      valor,
      metodo_pagamento: metodo_pagamento || 'cartao',
      status: 'pendente',
      criado_em: Date.now(),
    });

    return res.status(201).json({ id: result, message: 'Pagamento criado' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/pagamentos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pagamento = await db
      .select()
      .from(pagamentos)
      .where(eq(pagamentos.id, Number(id)))
      .then((result) => result[0]);

    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }

    return res.json(pagamento);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/pagamentos/vaga/:vaga_id', async (req: Request, res: Response) => {
  try {
    const { vaga_id } = req.params;
    const result = await db
      .select()
      .from(pagamentos)
      .where(eq(pagamentos.vaga_id, Number(vaga_id)));

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/pagamentos/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pendente', 'processando', 'concluido', 'cancelado'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    await db.update(pagamentos).set({ status }).where(eq(pagamentos.id, Number(id)));

    return res.json({ message: 'Pagamento atualizado' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ========== Health Check ==========

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'API do WorkMatch rodando ✓', timestamp: new Date() });
});

app.listen(3000, () => {
  console.log('🚀 API do WorkMatch rodando na porta 3000');
  console.log('📍 http://localhost:3000');
});