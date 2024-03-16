import { Link, useLocation, useNavigate } from "react-router-dom"
import { RoutePath } from "config/route_path.js";
import { useEffect, useState } from "react";
import { _User } from "./components/_user";
import { UsersController } from "controllers/users_controller";
import { useAuth } from "providers/auth";
import { _SearchForm } from "ui_components/form/_search_form"

export const UsersIndex = () => {
  const { setToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState(new URLSearchParams());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const url = location.search
    const params = new URLSearchParams(url);
    const token = params.get("token");

    if (token) {
      setToken(token);
      localStorage.setItem("authToken", token);
      navigate(RoutePath.Users.path);
    }
    // 初期ロード時にデータを取得
    setUsersData();
  }, []);

  useEffect(() => {
    // URLパラメータが変更されたらデータを再取得
    setUsersData();
  }, [location]);

  // ユーザー一覧取得
  const setUsersData = async () => {
    const query = getQuery(location.search);
    const users = new UsersController();
    await users.getUsers(query.toString()).then((data) => {
      if (data) {
        setUsers(data);
      }
    });
  };

  // URLパラメータを取得
  const getQuery = (url) => {
    const params = new URLSearchParams(url);
    const queryNickName = params.get("nickname") ?? "";
    const queryTerm = params.get("term") ?? "";
    const queryPrefecture = params.get("prefecture") ?? "";
    const queryTagById = params.get("tagId") ?? "";
    const queryTagByName = params.get("tagName") ?? "";

    const query = new URLSearchParams({
      nickname: queryNickName,
      term: queryTerm,
      prefecture: queryPrefecture,
      tag_id: queryTagById,
      tag_name: queryTagByName
    });
    setQuery(query);

    return query;
  }

  return (
    <>
      <div className="relative flex flex-col">
        <div className="mb-32">
          <section className="flex flex-col justify-center items-end m-7 mr-20">
            <_SearchForm />
          </section>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-auto-flow justify-center items-center m-auto">
            {users.map((user) => (
              <_User key={user.id} user={user} />
            ))}
          </section>
        </div>
        {/* TODO : ページネーションは今後追加できたらいいな */}
        <section className="flex justify-start items-center text-md mb-12">
          <div className="join rounded">
            <span className="join-item btn cursor-text hover:bg-[#5050D9] bg-[#5050D9] text-white font-normal min-h-0 h-auto px-3 py-3">1</span>
            <Link className="join-item btn bg-white text-[#5050D9] font-normal min-h-0 h-auto px-3 py-3">2</Link>
            <Link className="join-item btn bg-white text-[#5050D9] font-normal min-h-0 h-auto px-3 py-3">3</Link>
            <Link className="join-item btn bg-white text-[#5050D9] font-normal min-h-0 h-auto px-3 py-3">4</Link>
            <Link className="join-item btn bg-white text-[#5050D9] font-normal min-h-0 h-auto px-3 py-3">5</Link>
            <Link className="join-item btn bg-white text-[#5050D9] font-normal min-h-0 h-auto px-3 py-3">...</Link>
            <Link className="join-item btn bg-white text-[#5050D9] font-normal min-h-0 h-auto px-3 py-3">次へ</Link>
            <Link className="join-item btn bg-white text-[#5050D9] font-normal min-h-0 h-auto px-3 py-3">最後</Link>
          </div>
        </section >
      </div >
    </>
  );
};
