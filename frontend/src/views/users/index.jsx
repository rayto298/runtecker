import { Link, useLocation, useNavigate } from "react-router-dom"
import { RoutePath } from "config/route_path.js";
import { useEffect, useState } from "react";
import { _User } from "./components/_user";
import { TermsController } from "controllers/terms_controller";
import { UsersController } from "controllers/users_controller";
import { useAuth } from "providers/auth";

export const UsersIndex = () => {
  const { setToken } = useAuth();
  const [searchWord, setSearchWord] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [term, setTerm] = useState([]);
  const [users, seUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URLSearchParams(location.search);
    const token = url.get("token");
    // TODO : 認証周りとコンフリクト起こしそうなのでローカルストレージで保存してます。
    // useAuthとかで設定できたらいいなぁ
    if (token) {
      console.log(token);
      setToken(token);
      localStorage.setItem("authToken", token);
      navigate(RoutePath.Users.path);
    }

    let terms = new TermsController();
    terms.getPrefectures().then((data) => {
      if (data) {
        setTerm(data);
      } else {
        setTerm([]);
      }
    });

    return () => {
      // 明示的にメモリ解放
      terms = null;
      setTerm([]);
    }
  }, []);

  useEffect(() => {
    const url = new URLSearchParams(location.search);
    let queryWord = url.get("word") ?? "";
    let queryTerm = url.get("term") ?? "";
    let queryPrefecture = url.get("term") ?? "";
    let queryTag = url.get("tag") ?? "";

    let users = new UsersController();
    users.getPrefectures().then((data) => {
      if (data) {
        seUsers(data);
      } else {
        seUsers([]);
      }
    });

    // TODO : 検索でのユーザー取得処理
    console.log(queryWord, queryTerm, queryPrefecture, queryTag);

    setSearchWord(queryWord);
    setSearchTerm(queryTerm);

  }, [location]);


  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (searchWord === "" && searchTerm === "") {
      navigate(RoutePath.Users.path);
      return;
    }

    let query = "?";
    if (searchWord !== "") {
      // カンマ、読点、半角スペース、全角スペースで分割
      // filter(Boolean)は空文字削除用
      const splitWord = searchWord
        .trim()
        .split(/[,、\s\u3000]+/g)
        .filter(Boolean);
      query += `word=${splitWord.join(",")}`;
    }
    if (searchTerm !== "") {
      query += query === "?" ? `term=${searchTerm}` : `&term=${searchTerm}`;
    }
    navigate(RoutePath.Users.path + query);

  }


  const handleSearchWord = (e) => {
    setSearchWord(e.target.value);
  };

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);

  }


  return (
    <>
      <section className="flex flex-col justify-center items-end m-7 mr-20">
        <form className="flex gap-2" onSubmit={handleOnSubmit}>
          <input type="text" onChange={handleSearchWord} placeholder="Rails React" className="input rounded  border-orange-300 focus:outline-orange-500" id="search_word" value={searchWord} />
          <select className="select select-bordered border-runteq-primary focus:outline-orange-500 rounded-sm w-full max-w-xs" id="search_term" value={searchTerm} onChange={handleSearchTerm}>
            <option value="">未選択</option>
            {term.map((pref) =>
              <option key={pref.id} value={pref.id}>{pref.name}</option>
            )}
          </select>
          <button className="btn bg-runteq-primary text-white px-6 tracking-wider">
            検索
          </button>
          <Link
            to={RoutePath.Users.path}
            className="btn bg-runteq-primary text-white px-6 tracking-wider"
          >
            リセット
          </Link>
        </form>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-auto-flow justify-center items-center m-auto">
        {users.map((user) => (
          <_User key={user.id} user={user} />
        ))}
      </section>
    </>
  );
};
