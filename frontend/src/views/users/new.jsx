import { RoutePath } from "config/route_path";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const UsersNew = () => {
  const [matterMostID, setMatterMostID] = useState("");
  const onChangeMatterMostID = (e) => setMatterMostID(e.target.value);
  const navigate = useNavigate();

  const handleClick = () => {
    alert('登録しました');
    navigate(RoutePath.Users.path);
    // テスト段階で認証をture/falseで行ってた時のものです。不要であれば削除してください。
    // setAuth(true);
    // localStorage.setItem('auth', true);
  }

  return (
    <article>
      <div className="flex h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white shadow-md rounded-md p-6">
            <h2 className="my-3 text-center text-3xl font-bold tracking-tight">
              プロフィール作成
            </h2>
            <p className="p-2 form-red-600">※がついているものは全て入力してください</p>
            <form className="space-y-6" onSubmit={handleClick}>
              <div> 
                <div className="mt-1">
                  <label for="name" className="block text-sm font-medium">名前※</label>
                  <input name="name" type="name" required
                    className="h-10 px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                    placeholder="フルネームで入力してください" />
                </div>
              </div>
              <div>  
                <div className="mt-1">
                  <label for="nickname" className="block text-sm font-medium">ニックネーム※</label>
                  <input name="nickname" type="name" required
                    className="h-10 px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                    placeholder="RUNTECKERで表示したい名前を入力してください" />
                </div>
              </div>
              <div>  
                <div className="mt-1">
                  <label for="prefecture" className="block text-sm font-medium">居住地※</label>
                  <select
                    id="type"
                    className="h-10 px-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                    >
                    <option value="" disabled selected>選択してください</option>
                      {/* 暫定的に直接選択肢を入力してます。実際はprefectureテーブルからデータを取得すると思います。 */}
                      <option>愛知県</option>
                      <option>静岡県</option>
                      <option>岐阜県</option>
                  </select>
                </div>
              </div>
              <div>  
                <div className="mt-1">
                  <label for="email" className="block text-sm font-medium">メールアドレス※</label>
                  <input name="email" type="email" required
                    className="h-10 px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                    placeholder="メールアドレスを入力してください" />
                </div>
              </div>
              {/* マタモのIDだけ入力必須 */}
              <div>
                <label for="mattermost" className="text-sm font-medium flex">MatterMost※</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex h-10 items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    times_
                  </span>
                  <input id="mattermost" name="mattermost" placeholder="times_以降を入力してください" type="text" required value={matterMostID} onChange={onChangeMatterMostID} className="flex-1 form-input pl-3 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out border" />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-runteq-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75">
                  登録
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  )
}
