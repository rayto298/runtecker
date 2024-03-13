import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// auth.jsx 内

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    // URLからクエリパラメータを解析してトークンを取得
    const query = new URLSearchParams(window.location.search);
    const tokenFromUrl = query.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem("authToken", tokenFromUrl); // トークンをlocalStorageに保存
    }
  }, []);

  const logout = () => {
    setToken(""); // トークンをクリア
    localStorage.removeItem("authToken"); // localStorageからトークンを削除
  };

  return (
    <AuthContext.Provider value={{ token, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
