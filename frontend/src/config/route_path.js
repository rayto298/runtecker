export const RoutePath = {
  Home: {
    path: "/",
    name: "ホーム",
  },
  Login: {
    path: "/login",
    name: "ログイン",
  },
  Users: {
    path: "/users",
    name: "一覧",
  },
  UsersNew: {
    path: "/users/new",
    name: "新規登録",
  },
  UsersShow: {
    path: (id = ":id") => `/users/${id}`,
    name: "プロフィール",
  },
  Curriculums: {
    path: "/curriculums",
    name: "カリキュラム",
  },
  JobMeasures: {
    path: "/job_measures",
    name: "就活対策",
  },
  JobMeasuresShow: {
    path: (id = ":id") => `/job_measures/:${id}`,
    name: "就活対策詳細",
  },
  Events: {
    path: "/events",
    name: "イベント",
  },
  EventsShow: {
    path: (id = ":id") => `/events/:${id}`,
    name: "イベント詳細",
  },
  Recruits: {
    path: "/recruits",
    name: "求人",
  },
  RecruitsShow: {
    path: (id = ":id") => `/recruits/:${id}`,
    name: "求人詳細",
  },
  NotFound: {
    path: "*",
    name: "NotFound",
  },
  NotRuntecker: {
    path: "/not_runtecker",
    name: "Runteq案内",
  },
  AboutUs: {
    path: "/about_us",
    name: "開発者紹介",
  },
  PrivacyPolicy: {
    path: "/privacy_policy",
    name: "privacyポリシー",
  },
  TermsOfUse: {
    path: "/terms_of_use",
    name: "利用規約",
  },
  ContactUs: {
    path: "/contact_us",
    name: "お問い合わせ"
  },
};
