import { useAuth } from "providers/auth";
import { PROTECTED_ROUTES } from "./protected";
import { PUBLIC_ROUTES } from "./public";
import { useRoutes } from "react-router-dom";

export const AppRoutes = () => {
  // TODO : 認証実装されたらuseAuthを使う
  const auth = true; //useAuth();
  const routes = auth ? PROTECTED_ROUTES : PUBLIC_ROUTES;
  const element = useRoutes([...routes]);
  return <>{element}</>
};