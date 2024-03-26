import { Suspense } from "react";
import { MainLayout } from "views/layouts/main_layout";
import { _Loading } from "views/layouts/components/_loading";
import { Outlet } from "react-router-dom";
import { RoutePath } from "config/route_path";
import { UserSessionsNew } from "views/user_sessions/new";
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
import { StaticPagesPrivacyPolicy } from "views/static_pages/privacy_policy";
import { StaticPagesTermsOfUse } from "views/static_pages/terms_of_use";
import { ContactUs } from "views/static_pages/contact_us";

const App = () => {
  return (
    <MainLayout>
      <Suspense fallback={<_Loading />} />
      <Outlet />
    </MainLayout>
  );
};

export const PROTECTED_ROUTES = [
  {
    path: RoutePath.Home.path,
    element: <App />,
    children: [
      { path: RoutePath.Login.path, element: <UserSessionsNew /> },
      { path: RoutePath.Home.path, element: <StaticPagesIndex /> },
      { path: RoutePath.Curriculums.path, element: <CurriculumsIndex /> },
      { path: RoutePath.Events.path, element: <EventsIndex /> },
      { path: RoutePath.EventsShow.path(), element: <EventsShow /> },
      { path: RoutePath.JobMeasures.path, element: <JobMeasuresIndex /> },
      { path: RoutePath.JobMeasuresShow.path(), element: <JobMeasuresShow /> },
      { path: RoutePath.Recruits.path, element: <RecruitsIndex /> },
      { path: RoutePath.RecruitsShow.path(), element: <RecruitsShow /> },
      { path: RoutePath.Users.path, element: <UsersIndex /> },
      { path: RoutePath.UsersNew.path, element: <UsersNew /> },
      { path: RoutePath.UsersShow.path(), element: <UsersShow /> },
      { path: RoutePath.NotFound.path, element: <StaticPagesNotfound /> },
      {
        path: RoutePath.PrivacyPolicy.path,
        element: <StaticPagesPrivacyPolicy />,
      },
      {
        path: RoutePath.TermsOfUse.path,
        element: <StaticPagesTermsOfUse />,
      },
      { path: RoutePath.ContactUs.path, element: <ContactUs /> },
    ],
  },
];
