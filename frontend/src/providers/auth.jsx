import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState(localStorage.getItem('auth') || false);

  useEffect(() => {
    // URLからクエリパラメーターを解析してトークンを取得
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    if (token) {
      setAuth(token);
      localStorage.setItem('auth', token); // トークンをlocalStorageに保存
    }
  }, []);

  // setAuth関数をラップして、localStorageにもトークンを保存する
  const updateAuth = (newAuth) => {
    setAuth(newAuth);
    localStorage.setItem('auth', newAuth);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth: updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
