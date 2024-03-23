import { RoutePath } from "config/route_path";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/auth";
import { TermsController } from "controllers/terms_controller";
import { PrefecturesController } from "controllers/prefectures_controller";
import { _Avatar } from "./components/_avatar";
import { API_URL } from "config/setting";

export const UsersNew = () => {
  const [avatar, setAvatar] = useState(); // アバター用のstate
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [term, setTerm] = useState([]); // 入学時期用のstate
  const [prefecture, setPrefecture] = useState([]); // 都道府県用のstate
  const [prefectureId, setPrefectureId] = useState(""); // 都道府県ID用のstate
  const navigate = useNavigate();
  const [termId, setTermId] = useState(""); // 入学時期ID用のstate
  const { token } = useAuth();

  // 各フォームのonChangeイベントハンドラ
  const onChangeName = (e) => setName(e.target.value);
  const onChangeNickname = (e) => setNickname(e.target.value);
  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangeTerm = (e) => setTermId(e.target.value);
  const onChangePrefectureId = (e) => setPrefectureId(e.target.value);

  useEffect(() => {
    let terms = new TermsController();
    terms.getTerms().then((data) => {
      if (data) {
        setTerm(data);
      } else {
        setTerm([]);
      }
    });

    let prefectures = new PrefecturesController();
    prefectures.getPrefectures().then((data) => {
      if (data) {
        setPrefecture(data);
      } else {
        setPrefecture([]);
      }
    })

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ

    const user = {
      name,
      nickname,
      email,
      term_id: termId,
      prefecture_id: prefectureId,
      avatar
    };

    try {
      const response = await fetch(`${API_URL}/registrations`, {
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
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white shadow-md rounded-md p-6">
            <h2 className="my-3 text-center text-3xl font-bold tracking-tight">
              プロフィール作成
            </h2>
            <p className="p-2 form-red-600">
              ※がついているものは全て入力してください
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <_Avatar avatar={avatar} setAvatar={setAvatar} />
              <div>
                <div className="mt-1">
                  <label htmlFor="name" className="block text-sm font-medium">
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
                  <label htmlFor="nickname" className="block text-sm font-medium">
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
                  <label htmlFor="email" className="block text-sm font-medium">
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
                  onChange={onChangeTerm}
                  className="h-10 px-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                >
                  <option value="">選択してください</option>
                  {term.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
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
                  onChange={onChangePrefectureId}
                  className="h-10 px-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                >
                  <option value="">選択してください</option>
                  {prefecture.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
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
