import { Suspense } from "react";
import { MainLayout } from "views/layouts/main_layout";
import { _Loading } from "views/layouts/components/_loading";
import { Outlet } from "react-router-dom";
import { RoutePath } from "config/route_path";
import { UsersNew } from "views/users/new";
import { StaticPagesIndex } from "views/static_pages";
import { StaticPagesNotfound } from "views/static_pages/not_found";
import { UserSessionsNew } from "views/user_sessions/new";
import { StaticPagesNotRuntecker } from "views/static_pages/not_runtecker";
import DeveloperTeam from "views/static_pages/about_us";
import { StaticPagesPrivacyPolicy } from "views/static_pages/privacy_policy";
import { StaticPagesTermsOfUse } from "views/static_pages/terms_of_use";

const App = () => {
  return (
    <MainLayout>
      <Suspense fallback={<_Loading />} />
      <Outlet />
    </MainLayout>
  );
};

export const PUBLIC_ROUTES = [
  {
    path: RoutePath.Home.path,
    element: <App />,
    children: [
      { path: RoutePath.Login.path, element: <UserSessionsNew /> },
      { path: RoutePath.UsersNew.path, element: <UsersNew /> },
      { path: RoutePath.Home.path, element: <StaticPagesIndex /> },
      { path: RoutePath.AboutUs.path, element: <DeveloperTeam /> },
      { path: RoutePath.NotRuntecker.path, element: <StaticPagesNotRuntecker />, },
      { path: RoutePath.PrivacyPolicy.path, element: <StaticPagesPrivacyPolicy />, },
      { path: RoutePath.TermsOfUse.path, element: <StaticPagesTermsOfUse />, },
      { path: RoutePath.NotFound.path, element: <StaticPagesNotfound /> },
    ],
  },
];
