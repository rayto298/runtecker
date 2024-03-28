import { useAuth } from "providers/auth";
import { RoutePath } from "config/route_path";
import { Link, useNavigate } from "react-router-dom";
import { memo, useEffect } from "react";
import { SiGoogleforms } from "react-icons/si";


export const _Headers = memo(() => {
  const { setToken, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // TODO : 暫定処理
    // もっといい方法あったら教えてください
    setToken(localStorage.getItem("authToken"));
  }, [localStorage.getItem("authToken")])

  const handleClickLogout = () => {
    logout(); // トークンをクリアしてログアウト処理
    navigate(RoutePath.Login.path); // ログインページにリダイレクト
  };

  return (
    <header className="bg-white h-16 flex justify-between items-center drop-shadow-md z-50">
      <div className="flex gap-3 m-4 items-center">
        <h1 className="text-runteq-primary text-xl font-semibold">
          {/* ログイン済みであればユーザー一覧を表示するようにしています */}
          <Link to={currentUser ? RoutePath.Users.path : RoutePath.Home.path}>RUNTECKER</Link>
        </h1>
        <nav className="m-7">
          <ul className="flex gap-7">
            <li>
              <p to={RoutePath.Curriculums.path} className="text-gray-400">
                {RoutePath.Curriculums.name}
              </p>
            </li>
            <li>
              <p to={RoutePath.JobMeasures.path} className="text-gray-400">
                {RoutePath.JobMeasures.name}
              </p>
            </li>
            <li>
              <p to={RoutePath.Events.path} className="text-gray-400">{RoutePath.Events.name}</p>
            </li>
            <li>
              <p to={RoutePath.Recruits.path} className="text-gray-400">
                {RoutePath.Recruits.name}
              </p>
            </li>
            <li>
              <Link to={RoutePath.Users.path}>{RoutePath.Users.name}</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center h-full">
        <Link to={RoutePath.ContactUs.path} className="flex justify-center items-center bg-runteq-primary px-4 h-full text-white text-sm">
          <span className="text-xl mr-2"><SiGoogleforms /></span>お問い合わせ
        </Link>
        {currentUser ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="flex flex-col justify-center items-center w-24 gap-2 hover:opacity-80" type="button">
              <img src={currentUser.avatar ?? "https://placehold.jp/ff7300/ffffff/300x300.jpg?text=Avatar"} className="w-6 rounded-full icon" />
              <span className="text-xs">マイページ</span>
            </div>
            <ul tabIndex={0} className="menu dropdown-content z-[1] shadow bg-white rounded mt-2 p-0 py-2 text-base w-36">
              <li><Link to={RoutePath.UsersShow.path(currentUser.id)} className="rounded-none hover:rounded-none hover:bg-runteq-primary px-6">マイページ</Link></li>
              <li><button onClick={handleClickLogout} className="rounded-none hover:rounded-none hover:bg-runteq-primary px-6">ログアウト</button></li>
            </ul>
          </div>
        ) : (
          <Link to={RoutePath.Login.path} className="px-4">{RoutePath.Login.name}</Link>
        )}
      </div>
    </header>
  );
});
