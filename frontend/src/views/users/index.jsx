import { Link, useLocation, useNavigate } from "react-router-dom"
import { RoutePath } from "config/route_path.js";
import { useEffect, useState } from "react";
import { PrefecturesController } from "controllers/prefectures_controller";
import { _User } from "./components/_user";

const usersData = [...Array(20).keys()].map((val) => {
  return {
    id: val,
    name: "とぴ",
    nickname: `とぴ${val}`,
    pastname: "とっぴ",
    term: "52期A",
    term_id: 52,
    github_account: "topi0247",
    prefecture: "長野県",
    prefecture_id: 20,
    avatar:
      "https://pbs.twimg.com/profile_images/1750171124573540352/19Gfg3oh_400x400.jpg",
    user_tags: [
      {
        id: 1,
        name: "Ruby",
        position: "1",
      },
      {
        id: 2,
        name: "Ruby on Rails",
        position: "2",
      },
      {
        id: 3,
        name: "JavaScript",
        position: "3",
      },
    ],
    user_social_service: [
      {
        name: "twitter",
        account_name: "topi_log",
      },
      {
        name: "times",
        account_name: "52a_nishina_kanae",
      },
    ],
  };
});

export const UsersIndex = () => {
  const [searchWord, setSearchWord] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [prefecture, setPrefecture] = useState([]);
  const [users, setUsers] = useState(usersData);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URLSearchParams(location.search);
    const token = url.get("token");
    // TODO : 認証周りとコンフリクト起こしそうなのでローカルストレージで保存してます。
    // useAuthとかで設定できたらいいなぁ
    if (token) {
      console.log(token);
      localStorage.setItem("token", token);
      navigate(RoutePath.Users.path);
    }

    let prefectures = new PrefecturesController();
    // prefectures.getPrefectures().then((data) => {
    //   setPrefecture(data);
    // });
    setPrefecture([{ id: 1, name: "北海道" }])

    return () => {
      // 明示的にメモリ解放
      prefectures = null;
      setPrefecture([]);
    }
  }, []);

  useEffect(() => {
    const url = new URLSearchParams(location.search);
    let queryWord = url.get("word") ?? "";
    let queryTerm = url.get("term") ?? "";
    let queryPrefecture = url.get("prefecture") ?? "";
    let queryTag = url.get("tag") ?? "";


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
            {prefecture.map((pref) =>
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
      <section className="flex flex-wrap">
        {users.map((user) => (
          <_User key={user.id} user={user} />
        ))}
      </section>
    </>
  );
};
