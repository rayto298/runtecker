import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../providers/auth"; 
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "./routes";
import { useRoutes } from "react-router-dom";
import ReactGA from 'react-ga4';

export const AppRoutes = () => {
  const location = useLocation();
  const { auth } = useAuth();
  const routes = auth ? PROTECTED_ROUTES : PUBLIC_ROUTES;
  const element = useRoutes([...routes]);

  useEffect(() => {
    // ページ遷移があるたびにページビューイベントをGA4に送信
    const pagePath = location.pathname + location.search;
    ReactGA.send({ hitType: "pageview", page: pagePath });
  }, [location]);

  return <>{element}</>;
};
