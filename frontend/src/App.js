import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { AuthProvider } from "providers/auth";
import ReactGA from 'react-ga4'; // ReactGA をインポート

export const App = () => {
  useEffect(() => {
    // GA4 のトラッキングID で初期化
    ReactGA.initialize('G-F7P97W3Z2VZ'); // 実際のトラッキングIDに置き換えてください
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};