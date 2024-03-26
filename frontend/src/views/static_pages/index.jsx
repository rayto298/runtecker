import { RoutePath } from "config/route_path";
import { useAuth } from "providers/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const StaticPagesIndex = () => {
  const { currentUser } = useAuth();
  const router = useNavigate();
  useEffect(() => {
    if (currentUser) {
      router(RoutePath.Users.path);
    } else {
      router(RoutePath.Login.path);
    }
  }, [currentUser]);
}
