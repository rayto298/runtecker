import { Link, useLocation, useNavigate } from "react-router-dom"
import { RoutePath } from "config/route_path.js";
import { useEffect, useState } from "react";
import { PrefecturesController } from "controllers/prefectures_controller";

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
    avatar: "https://pbs.twimg.com/profile_images/1750171124573540352/19Gfg3oh_400x400.jpg",
    user_tags: [
      {
        id: 1,
        name: "Ruby",
        position: "1"
      },
      {
        id: 2,
        name: "Ruby on Rails",
        position: "2"
      },
      {
        id: 3,
        name: "JavaScript",
        position: "3"
      }
    ],
    user_social_service: [
      {
        name: "twitter",
        account_name: "topi_log"
      },
      {
        name: "times",
        account_name: "52a_nishina_kanae"
      },
    ]
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
    let prefectures = new PrefecturesController();
    prefectures.getPrefectures().then((data) => {
      setPrefecture(data);
    });

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
      const splitWord = searchWord.trim().split(/[,、\s\u3000]+/g).filter(Boolean);
      query += `word=${splitWord.join(",")}`;
    }
    if (searchTerm !== "") {
      query += query === "?" ? `term=${searchTerm}` : `&term=${searchTerm}`;
    }
    navigate(RoutePath.Users.path + query);
  }

  const handleSearchWord = (e) => {
    setSearchWord(e.target.value);
  }

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
          <button className="btn bg-runteq-primary text-white px-6 tracking-wider">検索</button>
          <Link to={RoutePath.Users.path} className="btn bg-runteq-primary text-white px-6 tracking-wider">リセット</Link>
        </form>
      </section>
      <section className="flex flex-wrap">
        {users.map((user) => (
          <div key={user.id} className="card w-96 border border-black m-4 shadow-xl overflow-hidden hover:shadow-2xl group rounded-xl p-5 transition-all duration-200 transform">
            <Link to={`${RoutePath.Users.path}?term=${user.term_id}`} className="text-xl px-2 ml-auto hover:opacity-50 transition-all">{user.term}</Link>
            <div className="flex px-2 items-center gap-4">
              <img src={user.avatar}
                className="w-32 group-hover:w-36 group-hover:h-36 h-32 object-center object-cover rounded-full transition-all duration-200 delay-200 transform"
                alt="Avatar"
              />
              <div className="p-4 transition-all transform duration-200">
                <h1 className="card-title font-bold">
                  <Link to={RoutePath.UsersShow.path(user.id)} className="hover:opacity-50 transition-all">{user.nickname}</Link>
                </h1>
                <p className="text-sm">（旧：{user.pastname}）</p>
                <Link to={`${RoutePath.Users.path}?prefecture=${user.prefecture_id}`} className="inline-flex item-center text-sm py-4 hover:opacity-50 transition-all">
                  <svg className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path
                      d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                  </svg>
                  {user.prefecture}
                </Link>
              </div>
            </div>
            <ul className="flex gap-3 justify-end items-center px-2">
              <li><Link to='#' className="hover:opacity-50 transition-all">X<i className="fa-brands fa-x-twitter fa-xl" /></Link></li>
              <li><Link to='#' className="hover:opacity-50 transition-all">MattermostLogo</Link></li>
            </ul>
            <div className="px-2 pt-2 ml-auto group-hover:opacity-100 opacity-0 transform transition-all delay-300 duration-200">
              <Link to={RoutePath.UsersShow.path(user.id)}>詳細 →</Link>
            </div>
            {user.user_tags?.length > 0 &&
              <div className="p-2 m-4 border-t border-black">
                {user.user_tags.map((tag, index) => (
                  <Link to={`${RoutePath.Users.path}?tag=${tag.id}`} key={index} className="badge badge-outline hover:opacity-50 transition-all mr-2">{tag.name}</Link>
                ))}
              </div>
            }
          </div>
        ))}
      </section>
    </>
  )
}
