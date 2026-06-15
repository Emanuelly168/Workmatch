# WorkMatch 🤝

> Plataforma mobile que conecta freelancers a clientes de forma rápida, prática e segura.

---

## 📖 Sobre o Projeto

O **WorkMatch** é um aplicativo mobile desenvolvido em React Native que funciona como uma ponte entre **freelancers** e **clientes**. Freelancers publicam seus serviços na plataforma, e clientes podem contratar diretamente ou enviar uma contra-proposta com o valor e condições que desejam. A plataforma oferece perfil profissional, sistema de propostas, negociação e pagamento integrado — tudo em um único lugar.

---

## 👥 Equipe

| Nome | Matrícula | Função |
|------|-----------|--------|
| Emanuelly Mendes | UC24200750 | Dev Frontend |
| Giovanna Chaves | UC24202770 | Dev Backend |
| Guilherme Emanuel | UC24200090 | Dev Backend |
| Lucas Pereira | UC24203021 | Dev Frontend |
| Samara Santos | UC24202708 | Dev Frontend |

---

## ☁️ Backend — Hospedado no Render

O backend deste projeto está hospedado no **[Render](https://render.com)**, uma plataforma de nuvem que permite subir servidores na internet de forma gratuita e sem configurações complexas.

### Por que o Render?

Rodar o servidor localmente exigiria que cada pessoa que fosse testar o projeto **abrisse portas no firewall do computador** e **configurasse o IP da rede**, o que tornaria o processo complicado e dependente do ambiente de cada máquina. Para simplificar ao máximo, o grupo optou por hospedar o backend no Render, deixando a API sempre disponível na internet. Assim, basta rodar o app e ele já se conecta automaticamente ao servidor — **sem nenhuma configuração adicional**.

> 🌐 **URL da API:** `https://workmatch-1ke2.onrender.com`

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado na sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Git](https://git-scm.com/)
- Aplicativo **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

---

### 📦 Passo a Passo

#### 1. Clonar o repositório

```bash
git clone https://github.com/Emanuelly168/Workmatch.git
cd Workmatch
```

#### 2. Entrar na pasta do app

```bash
cd meu-app
```

#### 3. Instalar as dependências

```bash
npm install
```

#### 4. Instalar dependência do Expo

```bash
npx expo install expo-sqlite
```

#### 5. Iniciar o projeto

```bash
npx expo start
```

#### 6. Abrir no celular

- Abra o aplicativo **Expo Go** no seu celular
- Escaneie o **QR Code** que aparecer no terminal
- O app será carregado automaticamente no seu dispositivo

> ⚠️ O celular e o computador precisam estar na **mesma rede Wi-Fi**, ou utilize o comando abaixo para rodar via túnel (funciona em qualquer rede):
> ```bash
> npx expo start --tunnel
> ```

---

## 🔑 Contas para Teste

Caso queira testar sem criar uma conta, utilize os usuários já cadastrados:

| Tipo | Email | Senha |
|------|-------|-------|
| Freelancer | `ana@workmatch.com` | `senha123` |
| Freelancer | `carlos@workmatch.com` | `senha123` |
| Freelancer | `julia@workmatch.com` | `senha123` |
| Cliente | `empresa@workmatch.com` | `senha123` |
| Cliente | `joao@workmatch.com` | `senha123` |

---

## 🗂️ Estrutura do Projeto

```
Workmatch/
├── meu-app/                  # Aplicativo mobile (React Native + Expo)
│   ├── src/
│   │   ├── contexts/         # Contexto de autenticação
│   │   ├── screens/          # Telas do aplicativo
│   │   └── services/         # Comunicação com a API
│   ├── App.tsx               # Navegação principal
│   └── package.json          # Dependências do frontend
│
└── server/                   # Backend (Express + SQLite)
    ├── server.ts             # Servidor e rotas da API
    ├── schema.ts             # Estrutura do banco de dados
    ├── seed.ts               # População inicial do banco
    └── package.json          # Dependências do backend
```

---

## 🛠️ Tecnologias Utilizadas

**Frontend**
- React Native + Expo
- TypeScript
- React Navigation
- Axios

**Backend**
- Node.js + Express
- SQLite com Drizzle ORM
- Hospedado no Render

---

## 📋 Funcionalidades

- ✅ Cadastro e login com escolha de perfil (Freelancer ou Cliente)
- ✅ Freelancer publica serviços com título, descrição, categoria e valor
- ✅ Cliente explora serviços disponíveis com filtros por categoria e busca
- ✅ Cliente pode contratar diretamente ou enviar uma contra-proposta
- ✅ Freelancer recebe propostas com nome do cliente, valor e mensagem
- ✅ Freelancer pode aceitar ou recusar propostas
- ✅ Sistema de pagamento integrado (Pix, Cartão, Boleto)
- ✅ Tela de perfil com edição de dados pessoais
- ✅ Animações de entrada nas telas