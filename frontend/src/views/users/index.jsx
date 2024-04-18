import { useLocation, useNavigate } from "react-router-dom"
import { RoutePath } from "config/route_path.js";
import { memo, useEffect, useRef, useState } from "react";
import { _User } from "./components/_user";
import { UsersController } from "controllers/users_controller";
import { useAuth } from "providers/auth";
import { _SearchForm } from "ui_components/form/_search_form"

export const UsersIndex = () => {
  const { setToken } = useAuth();
  const [users, setUsers] = useState([]);
  const total = useRef(0);
  const currentPage = useRef(1);
  const location = useLocation();
  const navigate = useNavigate();

  // // 並び順を制御するuseStateを仮置き
  const [orderBy, setOrderBy] = useState(''); // 初期値は新着順

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
    currentPage.current = query.get("page") || 1;
    const users = new UsersController();
    await users.getUsersAndTotalCount(query.toString()).then((data) => {
      if (data) {
        setUsers(data.users);
        total.current = data.total;
        window.scrollTo({
          top: 0,
        });
      } else {
        setUsers([]);
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
    const queryAccountName = params.get("accountName") ?? "";
    const queryPage = params.get("page") ?? "";
    const queryOrderBy = params.get("orderBy") ?? "";

    const query = new URLSearchParams({
      nickname: queryNickName,
      term: queryTerm,
      prefecture: queryPrefecture,
      tag_id: queryTagById,
      tag_name: queryTagByName,
      account_name: queryAccountName,
      page: queryPage,
      order_by: queryOrderBy //新たに並び順パラメータを追加
    });

    return query;
  }

  // 並び順の変更
  // const changeOrder = (e) => {
  //   setOrderBy(e.target.value);
  //   // URLパラメータを更新
  //   const query = getQuery(location.search);
  //   query.set("orderBy", e.target.value);
  //   console.log(query)
  // }

  return (
    <>
      <div className="relative flex flex-col">
        <div className="mb-32">
          {/* 検索フォーム */}
          <section className="flex flex-col justify-center items-end m-7 mr-20">
            <_SearchForm />
          </section>

          {/* ページネーション */}
          <div className="ml-12">
            <Pagination navigate={navigate} total={total.current} currentPage={currentPage.current} location={location} />
          </div>

          {/* 並び順設定 */} 
          <div className="ml-12">
            <select value={orderBy} onChange={(e)=>setOrderBy(e.target.value)}>
              <option value="desc">新着順</option>
              <option value="asc">おすすめ</option>
              <option value="asc">ランダム</option>
            </select>
          </div> 

          {/* ユーザー一覧 */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-auto-flow justify-center items-center m-auto">
            {users.map((user) => (
              <_User key={user.id} user={user} />
            ))}
          </section>
        </div>

        {/* ページネーション */}
        <div className="ml-12 mb-12">
          <Pagination navigate={navigate} total={total.current} currentPage={currentPage.current} location={location} />
        </div>
      </div >
    </>
  );
};

// 他のページで使用予定であれば切り離す
const Pagination = memo(({ navigate, total, currentPage, location }) => {

  const handleClickPagination = (index) => {
    const newUrl = new URLSearchParams(location.search);
    newUrl.set("page", index + 1);
    navigate(`${location.pathname}?${newUrl.toString()}`);
  }

  return (
    <section className="flex justify-start items-center">
      <ul className="join rounded">
        {total > 12 &&
          Array.from({ length: Math.ceil(total / 12) }, (_, index) => {
            return index === currentPage - 1 ? (
              <li key={index} className="join-item btn cursor-text hover:bg-[#5050D9] bg-[#5050D9] text-white font-normal min-h-0 h-auto py-3 px-4 leading-5 text-xl">{index + 1}</li>
            ) : (
              <li
                key={index}><button
                  className="join-item btn bg-white text-[#5050D9] font-normal min-h-0 h-auto p-3 leading-5 py-3 px-4 text-xl"
                  onClick={() => handleClickPagination(index)}
                >
                  {index + 1}
                </button>
              </li>
            )
          }
          )
        }
      </ul>
    </section >);
});