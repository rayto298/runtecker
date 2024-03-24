import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { AuthProvider } from "providers/auth";
import ReactGA from 'react-ga4'; // ReactGA をインポート


export const App = () => {
    useEffect(() => {
      ReactGA.initialize('G-F7P97W3Z2VZ'); // GA4のトラッキングIDで初期化
    }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};
