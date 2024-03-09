import React, { useEffect, useState } from "react";
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from "./routes";
import { AppProvider } from 'providers/auth';

export const App = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    // URLからクエリパラメーターを解析してトークンを取得
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    if (token) {
      setToken(token);
      console.log(token)
      // トークンを使用してユーザー状態を管理するロジックは別途検討
      // 例: APIリクエストのヘッダーにトークンを追加する、状態管理ライブラリにトークンを保存する等
    }
  }, []);
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}