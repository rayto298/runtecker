// UsersNew.js
import { RoutePath } from "config/route_path";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/auth";

// 都道府県のデータ
const prefectures = [
  { id: 1, name: "北海道" },
  { id: 2, name: "青森県" },
  { id: 3, name: "岩手県" },
  { id: 47, name: "沖縄県" },
  { id: 48, name: "その他" },
];

const terms = [
  { id: 1, name: "運営" },
  { id: 2, name: "48期" },
  { id: 3, name: "49期" },
  { id: 4, name: "50期" },
  { id: 5, name: "51期" },
  { id: 6, name: "52期" },
  { id: 7, name: "pro1期" },
  { id: 8, name: "pro2期" },
];

export const UsersNew = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [term, setTerm] = useState(""); // 入学時期用のstate
  const [prefectureId, setPrefectureId] = useState(""); // 都道府県ID用のstate
  const navigate = useNavigate();
  const [termId, setTermId] = useState("");
  const { token } = useAuth();

  // 各フォームのonChangeイベントハンドラ
  const onChangeName = (e) => setName(e.target.value);
  const onChangeNickname = (e) => setNickname(e.target.value);
  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangeTerm = (e) => setTerm(e.target.value);
  const onChangePrefectureId = (e) => setPrefectureId(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ

    const user = {
      name,
      nickname,
      email,
      term_id: termId,
      prefecture_id: prefectureId,
    };

    try {
      const response = await fetch("http://localhost:3000/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // トークンをヘッダーに含める
        },
        body: JSON.stringify({ user }),
      });

      if (response.ok) {
        alert("登録しました");
        navigate(RoutePath.Users.path);
      } else {
        alert("登録に失敗しました");
      }
    } catch (error) {
      console.error("登録エラー", error);
      alert("登録処理中にエラーが発生しました");
    }
  };

  return (
    <article>
      <div className="flex h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white shadow-md rounded-md p-6">
            <h2 className="my-3 text-center text-3xl font-bold tracking-tight">
              プロフィール作成
            </h2>
            <p className="p-2 form-red-600">
              ※がついているものは全て入力してください
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* 入学時期入力フォーム */}
              <div>
                <div className="mt-1">
                  <label for="name" className="block text-sm font-medium">
                    名前※
                  </label>
                  <input
                    name="name"
                    type="name"
                    required
                    value={name}
                    onChange={onChangeName}
                    className="h-10 px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                    placeholder="フルネームで入力してください"
                  />
                </div>
              </div>
              <div>
                <div className="mt-1">
                  <label for="nickname" className="block text-sm font-medium">
                    ニックネーム※
                  </label>
                  <input
                    name="nickname"
                    type="name"
                    required
                    value={nickname}
                    onChange={onChangeNickname}
                    className="h-10 px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                    placeholder="RUNTECKERで表示したい名前を入力してください"
                  />
                </div>
              </div>
              <div>
                <div className="mt-1">
                  <label for="email" className="block text-sm font-medium">
                    メールアドレス※
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={onChangeEmail}
                    className="h-10 px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                    placeholder="メールアドレスを入力してください"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="term" className="block text-sm font-medium">
                  入学時期※
                </label>
                <select
                  id="term"
                  name="term_id"
                  required
                  value={termId}
                  onChange={(e) => setTermId(e.target.value)}
                  className="h-10 px-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                >
                  <option value="">選択してください</option>
                  {terms.map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 都道府県選択フォーム */}
              <div>
                <label
                  htmlFor="prefecture"
                  className="block text-sm font-medium"
                >
                  居住地※
                </label>
                <select
                  id="prefecture"
                  name="prefecture_id"
                  required
                  value={prefectureId}
                  onChange={(e) => setPrefectureId(e.target.value)}
                  className="h-10 px-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                >
                  <option value="">選択してください</option>
                  {prefectures.map((prefecture) => (
                    <option key={prefecture.id} value={prefecture.id}>
                      {prefecture.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-runteq-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75"
                >
                  登録
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
};
