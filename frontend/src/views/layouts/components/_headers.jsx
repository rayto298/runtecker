import { useAuth } from "providers/auth";
import { RoutePath } from "config/route_path";
import { Link, useNavigate } from "react-router-dom";

export const _Headers = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    logout(); // トークンをクリアしてログアウト処理
    navigate(RoutePath.Login.path); // ログインページにリダイレクト
  };

  return (
    <header className="bg-white pt-0 pb-0 h-16 flex justify-between items-center drop-shadow-md">
      <div className="flex gap-3 m-4 items-center">
        <h1 className="text-runteq-primary text-xl font-semibold">
          <Link to={RoutePath.Home.path}>RUNTECKER</Link>
        </h1>
        <nav className="m-7">
          <ul className="flex gap-7">
            <li>
              <Link to={RoutePath.Curriculums.path}>
                {RoutePath.Curriculums.name}
              </Link>
            </li>
            <li>
              <Link to={RoutePath.JobMeasures.path}>
                {RoutePath.JobMeasures.name}
              </Link>
            </li>
            <li>
              <Link to={RoutePath.Events.path}>{RoutePath.Events.name}</Link>
            </li>
            <li>
              <Link to={RoutePath.Recruits.path}>
                {RoutePath.Recruits.name}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex gap-3 m-4 items-center">
        <button className="bg-runteq-primary p-2 px-4 rounded text-white">
          無料体験
        </button>
        {token ? (
          <button onClick={handleClick}>ログアウト</button>
        ) : (
          <Link to={RoutePath.Login.path}>{RoutePath.Login.name}</Link>
        )}
      </div>
    </header>
  );
};
