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

    if (token) {
      console.log(token);
      setToken(token);
      localStorage.setItem("authToken", token);
      navigate(RoutePath.Users.path);
    }

    let terms = new TermsController();
    terms.getTerms().then((data) => {
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
    const queryWord = url.get("word") ?? "";
    const queryTerm = url.get("term") ?? "";
    //const queryPrefecture = url.get("term") ?? "";
    //const queryTag = url.get("tag") ?? "";

    // TODO : 検索結果をもとにしたユーザーデータ取得は未実装
    let users = new UsersController();
    users.getPrefectures().then((data) => {
      if (data) {
        seUsers(data);
      }
    });

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
      <div className="relative flex flex-col">
        <div className="mb-32">
          <section className="flex flex-col justify-center items-end m-7 mr-20">
            <form className="flex gap-2" onSubmit={handleOnSubmit}>
              <input type="text" onChange={handleSearchWord} placeholder="Rails React" className="input rounded border-[#CED4DA] focus:outline-none focus:border-orange-500" id="search_word" value={searchWord} />
              <select className="select select-bordered focus:outline-none focus:border-orange-500 rounded-sm w-full max-w-xs" id="search_term" value={searchTerm} onChange={handleSearchTerm}>
                <option value="">未選択</option>
                {term.map((pref) =>
                  <option key={pref.id} value={pref.id}>{pref.name}</option>
                )}
              </select>
              <button className="btn bg-[#5050D9] rounded text-white px-6 tracking-wider hover:bg-[#5050D9]">
                検索
              </button>
              <Link
                to={RoutePath.Users.path}
                className="btn text-[#5050D9] border-[#5050D9] bg-white rounded px-6 tracking-wider hover:bg-[#5050D9] hover:text-white"
              >
                クリア
              </Link>
            </form>
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
