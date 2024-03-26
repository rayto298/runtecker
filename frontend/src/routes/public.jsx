import { Suspense } from "react";
import { MainLayout } from "views/layouts/main_layout";
import { _Loading } from "views/layouts/components/_loading";
import { Outlet } from "react-router-dom";
import { RoutePath } from "config/route_path";
import { CurriculumsIndex } from "views/curriculums";
import { EventsIndex } from "views/events";
import { EventsShow } from "views/events/show";
import { JobMeasuresIndex } from "views/job_measures";
import { JobMeasuresShow } from "views/job_measures/show";
import { RecruitsIndex } from "views/recruits";
import { RecruitsShow } from "views/recruits/show";
import { UsersIndex } from "views/users";
import { UsersNew } from "views/users/new";
import { UsersShow } from "views/users/show";
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

//  TODO : ユーザー認証確定するまでルーティングを暫定的に設定しています。
export const PUBLIC_ROUTES = [
  {
    path: RoutePath.Home.path,
    element: <App />,
    children: [
      { path: RoutePath.Login.path, element: <UserSessionsNew /> },
      { path: RoutePath.UsersNew.path, element: <UsersNew /> },
      { path: RoutePath.Home.path, element: <StaticPagesIndex /> },
      { path: RoutePath.AboutUs.path, element: <DeveloperTeam /> },
      {
        path: RoutePath.NotRuntecker.path,
        element: <StaticPagesNotRuntecker />,
      },
      {
        path: RoutePath.PrivacyPolicy.path,
        element: <StaticPagesPrivacyPolicy />,
      },
      {
        path: RoutePath.TermsOfUse.path,
        element: <StaticPagesTermsOfUse />,
      },
      { path: RoutePath.NotFound.path, element: <StaticPagesNotfound /> },
    ],
  },
];
