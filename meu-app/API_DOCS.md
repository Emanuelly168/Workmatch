# 📚 Documentação da API WorkMatch

**Porta:** 3000  
**URL Base:** `http://localhost:3000`

## 🔐 Autenticação

### Registrar novo usuário
**POST** `/auth/registro`

```json
{
  "email": "usuario@email.com",
  "senha": "senha123",
  "nome": "João Silva",
  "tipo": "freelancer",
  "telefone": "11999999999"
}
```

**Resposta (201):**
```json
{
  "message": "Usuário criado com sucesso"
}
```

### Fazer login
**POST** `/auth/login`

```json
{
  "email": "usuario@email.com",
  "senha": "senha123"
}
```

**Resposta (200):**
```json
{
  "id": 1,
  "email": "usuario@email.com",
  "nome": "João Silva",
  "tipo": "freelancer"
}
```

---

## 👤 Usuários

### Obter dados do usuário
**GET** `/usuarios/:id`

**Resposta:**
```json
{
  "id": 1,
  "email": "usuario@email.com",
  "nome": "João Silva",
  "tipo": "freelancer",
  "telefone": "11999999999",
  "descricao": "Desenvolvedor experiente",
  "foto": null,
  "criado_em": 1717363200000
}
```

### Atualizar perfil
**PUT** `/usuarios/:id`

```json
{
  "nome": "João Silva",
  "telefone": "11999999999",
  "descricao": "Desenvolvedor full-stack com 5 anos de experiência",
  "foto": "url_da_foto"
}
```

### Listar usuários por tipo
**GET** `/usuarios/tipo/freelancer`  
**GET** `/usuarios/tipo/cliente`

**Resposta:** Array de usuários

---

## 💼 Profissionais

### Listar profissões
**GET** `/profissionais`

### Criar profissão
**POST** `/profissionais`

```json
{
  "nome": "Desenvolvedor",
  "servico": "Desenvolvimento de sistemas"
}
```

### Deletar profissão
**DELETE** `/profissionais/:id`

---

## 📋 Vagas

### Criar vaga
**POST** `/vagas`

```json
{
  "usuario_id": 1,
  "titulo": "Desenvolvimento de App Mobile",
  "descricao": "Preciso de um app React Native para iOS e Android",
  "categoria": "desenvolvimento",
  "orcamento": 5000.00
}
```

**Resposta (201):**
```json
{
  "id": 1,
  "message": "Vaga criada com sucesso"
}
```

### Listar todas as vagas
**GET** `/vagas`

### Obter vaga específica
**GET** `/vagas/:id`

### Listar vagas de um usuário
**GET** `/vagas/usuario/:usuario_id`

### Atualizar vaga
**PUT** `/vagas/:id`

```json
{
  "titulo": "Desenvolvimento de App Mobile",
  "descricao": "Preciso de um app React Native",
  "categoria": "desenvolvimento",
  "orcamento": 5500.00,
  "status": "em_progresso"
}
```

**Status permitidos:** `aberta`, `em_progresso`, `finalizada`

### Deletar vaga
**DELETE** `/vagas/:id`

---

## 💡 Propostas

### Enviar proposta
**POST** `/propostas`

```json
{
  "vaga_id": 1,
  "freelancer_id": 5,
  "valor": 4500.00,
  "descricao": "Tenho experiência com React Native e posso entregar em 30 dias"
}
```

### Listar propostas de uma vaga
**GET** `/propostas/vaga/:vaga_id`

### Listar propostas de um freelancer
**GET** `/propostas/freelancer/:freelancer_id`

### Atualizar status da proposta
**PUT** `/propostas/:id/status`

```json
{
  "status": "aceita"
}
```

**Status permitidos:** `pendente`, `aceita`, `recusada`

---

## 💳 Pagamentos

### Criar pagamento
**POST** `/pagamentos`

```json
{
  "vaga_id": 1,
  "cliente_id": 1,
  "freelancer_id": 5,
  "valor": 4500.00,
  "metodo_pagamento": "cartao"
}
```

### Obter pagamento
**GET** `/pagamentos/:id`

### Listar pagamentos de uma vaga
**GET** `/pagamentos/vaga/:vaga_id`

### Atualizar status do pagamento
**PUT** `/pagamentos/:id/status`

```json
{
  "status": "concluido"
}
```

**Status permitidos:** `pendente`, `processando`, `concluido`, `cancelado`

---

## ✅ Health Check

**GET** `/health`

**Resposta:**
```json
{
  "status": "API do WorkMatch rodando ✓",
  "timestamp": "2026-06-03T10:30:00.000Z"
}
```

---

## 📝 Códigos de Status

| Status | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado |
| 204 | No Content - Deletado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Falha na autenticação |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Email já cadastrado |
| 500 | Internal Server Error - Erro no servidor |

---

## 🚀 Como Iniciar

```bash
# Instalar dependências
npm install

# Iniciar o servidor
npm run start

# Ou diretamente com ts-node/tsx
npx tsx src/server.ts
```

---


