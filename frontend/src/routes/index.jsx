import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../providers/auth";
import { PROTECTED_ROUTES } from "./protected";
import { PUBLIC_ROUTES } from "./public";
import { useRoutes } from "react-router-dom";
import ReactGA from 'react-ga4'; // ReactGA をインポート

export const AppRoutes = () => {
  const location = useLocation();
  const { auth } = useAuth(); // 認証状態をuseAuthフックから取得
  const routes = auth ? PROTECTED_ROUTES : PUBLIC_ROUTES; // 認証状態に応じてルートを切り替え
  const element = useRoutes([...routes]);

  useEffect(() => {
    // ページ遷移があるたびにページビューイベントをGA4に送信
    const pagePath = location.pathname + location.search;
    ReactGA.send({ hitType: "pageview", page: pagePath });
  }, [location]);

  return <>{element}</>;
};
