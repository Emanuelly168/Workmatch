# WorkMatch 📱

Plataforma mobile desenvolvida em **React Native** com **Expo** para conectar freelancers e clientes. O aplicativo funciona com persistência de dados local, permitindo uma experiência offline completa.

## 🎯 Visão Geral

WorkMatch é um aplicativo mobile que oferece:
- ✅ Interface intuitiva para gerenciamento de freelancers
- ✅ Persistência de dados local com SQLite
- ✅ Operações offline completas
- ✅ Navegação fluida entre telas
- ✅ Gerenciamento de estado com Context API

## 🛠 Stack Tecnológico

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **React Native** | 0.81.5 | Framework para desenvolvimento mobile |
| **Expo** | ~54.0.33 | Plataforma para desenvolvimento React Native |
| **TypeScript** | ~5.9.2 | Tipagem estática para JavaScript |
| **Drizzle ORM** | 0.45.2 | ORM para gerenciamento de banco de dados |
| **Expo SQLite** | ~16.0.10 | Banco de dados SQLite para app |
| **React Navigation** | ^7.2.2 | Navegação entre telas |

## 📋 Pré-requisitos

- **Node.js** (v16+) e npm
- **Expo CLI** instalado globalmente
- **Android Studio** (para emulador Android) ou
- **Xcode** (para emulador iOS) ou
- **Expo Go App** no smartphone

## 🚀 Como Executar

### 1. Instalação de Dependências

```bash
# Acesse a pasta do projeto
cd meu-app

# Instale todas as dependências
npm install

# Instale o Expo SQLite
npx expo install expo-sqlite

# Instale dependências de desenvolvimento
npm install -D drizzle-kit
```