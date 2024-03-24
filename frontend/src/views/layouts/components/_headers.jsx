import { useAuth } from "providers/auth";
import { RoutePath } from "config/route_path";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SiGoogleforms } from "react-icons/si";


export const _Headers = () => {
  const { token, setToken, logout ,currentUser} = useAuth();
  const navigate = useNavigate();
  
  console.log(currentUser)

  useEffect(() => {
    // TODO : 暫定処理
    // もっといい方法あったら教えてください
    setToken(localStorage.getItem("authToken"));
  }, [localStorage.getItem("authToken")])

  const handleClick = () => {
    logout(); // トークンをクリアしてログアウト処理
    navigate(RoutePath.Login.path); // ログインページにリダイレクト
  };

  return (
    <header className="bg-white h-16 flex justify-between items-center drop-shadow-md">
      <div className="flex gap-3 m-4 items-center">
        <h1 className="text-runteq-primary text-xl font-semibold">
          {/* ログイン済みであればユーザー一覧を表示するようにしています */}
          <Link to={token ? RoutePath.Users.path : RoutePath.Home.path}>RUNTECKER</Link>
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
        <Link className="flex justify-center items-center bg-runteq-primary px-4 h-full text-white text-sm">
          <span className="text-xl mr-2"><SiGoogleforms /></span>お問い合わせ
        </Link>
        {token ? (
          <button onClick={handleClick} className="px-4">ログアウト</button>
        ) : (
          <Link to={RoutePath.Login.path} className="px-4">{RoutePath.Login.name}</Link>
        )}
      </div>
    </header>
  );
};
