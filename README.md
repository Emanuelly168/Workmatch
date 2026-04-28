# WorkMatch 🤝

O WorkMatch é uma plataforma digital focada em conectar freelancers a clientes. Este repositório contém os módulos de gerenciamento de profissionais (CRUD), implementados de duas formas distintas para fins acadêmicos.

## Parte 1: API (Backend)
API minimalista construída com TypeScript, Express, SQLite e Drizzle ORM para gerenciar o catálogo de freelancers.

### Como executar:
1. Acesse a pasta do backend no terminal.
2. Instale as dependências:
   \`\`\`bash
   npm install express cors better-sqlite3 drizzle-orm
   npm install -D typescript @types/express @types/cors @types/better-sqlite3 tsx
   \`\`\`
3. Inicie o servidor:
   \`\`\`bash
   npx tsx src/server.ts
   \`\`\`
A API estará rodando em \`http://localhost:3000\`.

## Parte 2: App Mobile (Frontend - React Native / Expo)
Aplicativo React Native que possui telas para consumo da API via Axios e também uma vertente de persistência de dados local offline utilizando \`expo-sqlite\` e Drizzle.

### Como executar:
1. Acesse a pasta do aplicativo no terminal.
2. Instale as dependências do projeto:
   \`\`\`bash
   npm install
   npm install axios
   npx expo install expo-sqlite
   npm install drizzle-orm
   \`\`\`
3. Inicie o Metro Bundler do Expo:
   \`\`\`bash
   npx expo start
   \`\`\`
4. Pressione \`a\` no terminal para emular no Android, ou leia o QR Code usando o aplicativo Expo Go no seu smartphone.

> **Nota para testes de API:** Se estiver utilizando o emulador Android, a rota do Axios deve apontar para \`http://10.0.2.2:3000\`. Caso esteja rodando no celular físico via Expo Go, substitua pelo IP local da sua máquina na rede Wi-Fi.