import { Role } from '../contexts/AppContext';

export interface UserRecord {
  id: string;
  nome: string;
  email: string;
  senha: string;
  perfil: Exclude<Role, 'PUBLICO' | null>;
}

const users: UserRecord[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function registerUser(data: Omit<UserRecord, 'id'>): Promise<UserRecord> {
  await delay(500);

  if (!data.nome || !data.email || !data.senha || !data.perfil) {
    throw new Error('Todos os campos são obrigatórios.');
  }

  const normalizedEmail = data.email.trim().toLowerCase();
  const existing = users.find(user => user.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('E-mail já cadastrado.');
  }

  const newUser: UserRecord = {
    id: String(Date.now()),
    nome: data.nome.trim(),
    email: normalizedEmail,
    senha: data.senha,
    perfil: data.perfil,
  };

  users.push(newUser);
  return newUser;
}

export async function loginUser(email: string, senha: string): Promise<UserRecord> {
  await delay(300);
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(item => item.email.toLowerCase() === normalizedEmail && item.senha === senha);
  if (!user) {
    throw new Error('E-mail ou senha inválidos.');
  }
  return user;
}

export async function getAllUsers(): Promise<UserRecord[]> {
  await delay(200);
  return [...users];
}
