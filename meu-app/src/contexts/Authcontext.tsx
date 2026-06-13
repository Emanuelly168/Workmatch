import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Usuario {
  id: number;
  email: string;
  nome: string;
  tipo: 'cliente' | 'freelancer';
  telefone?: string;
  descricao?: string;
  foto?: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (u: Usuario | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  setUsuario: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const logout = () => setUsuario(null);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
