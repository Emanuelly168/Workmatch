import React, { createContext, useState, useContext } from 'react';


export type Role = 'PUBLICO' | 'LEITOR' | 'AUTOR' | 'EDITOR' | 'SUPERADMIN' | null;

interface AppContextData {
  role: Role;
  login: (selectedRole: Role) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [role, setRole] = useState<Role>('PUBLICO');

  const login = (selectedRole: Role) => setRole(selectedRole);
  const logout = () => setRole('PUBLICO');

  return (
    <AppContext.Provider value={{ role, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);