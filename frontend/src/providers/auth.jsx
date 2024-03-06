import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AppProvider = ({ children }) => {
  // TODO : 認証周りは後で実装
  const [auth, setAuth] = useState(localStorage.getItem('auth') || false);
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);