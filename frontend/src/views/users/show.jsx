import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { _UsersEdit } from "./components/_edit"
import { _UsersDetail } from "./components/_user_detail"
import { useNavigate } from 'react-router-dom';
import { RoutePath } from "config/route_path.js"; // RoutePathのインポートパスに置き換えてください

export const UsersShow = () => {
  const navigate = useNavigate(); // useNavigateフックからnavigate関数を取得
  const [error, setError] = useState(''); // エラーメッセージを保持する状態
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    
    const fetchUserData = async () => {
      try {
        // 環境変数からAPI URLを取得し、ローカルストレージからトークンを取得
        const apiUrl = process.env.REACT_APP_API_URL ;
        const token = localStorage.getItem("authToken");
  
        const response = await fetch(`${apiUrl}/api/v1/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // トークンをヘッダーに含める
          },
        });
        if (!response.ok) {
          throw new Error('ネットワークレスポンスがOKではありません');
        }
        const data = await response.json();
  
        // 既存の加工処理
      const processedData = {
        ...data,
        term: data.term.name, // term情報を名前のみに加工
        prefecture: data.prefecture.name, // prefecture情報を名前のみに加工
        user_social_services: data.user_social_services.map(service => {
          // ソーシャルサービス情報がundefinedでないことを確認し、加工してオブジェクトの配列に
          return {
             name: service.social_service ? service.social_service.name : null, 
             account_name: service.account_name
          };
         })
        };

        console.log(processedData); // ここで加工後のデータをコンソールに出力
  
        // 足りない部分をダミーデータで補完
        const supplementedData = {
          ...processedData,
          // ここで足りない部分をダミーデータや既に定義されているuserDataから補完
          avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/ed28808e-3784-4b35-a4cf-dc378a3cb987-profile_image-300x300.png",
          user_tags: [{id: 1, name: 'タグ1'}, 
                      {id: 2, name: 'タグ2'},
                      {id: 3, name: 'タグ3'},
                      {id: 4, name: 'タグ4'},
                    ]
          // 他に足りないデータがあれば、同様に補完
          
        };
  
        setUser({
          ...supplementedData,
          user_social_service: supplementedData.user_social_services // ここでプロパティ名を調整
        });// 加工後のデータをセット
      } catch (err) {
        console.error("ユーザーデータの取得中にエラーが発生しました:", err);
        setError(err.message); // エラーメッセージを状態にセット
        setTimeout(() => navigate(RoutePath.Users.path), 3000); // 3秒後にユーザー一覧画面に遷移
      }
    };
  
    fetchUserData();
  }, [id, navigate]);  // idが変わったときに再度フェッチするために依存配列にidを含める// idが変わったときに再度フェッチするために依存配列にidを含める

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  }

  return (
    <div>
      {error && (
        <div>
          {/* ここでエラーメッセージを表示 */}
          <p>エラーが発生しました: {error}</p>
          <p>3秒後にユーザー一覧画面に戻ります...</p>
        </div>
      )}
      <article className="max-w-screen-lg w-full m-auto my-10">
        <section className="bg-white rounded p-12 w-full max-w-screen-md m-auto">
          {isEdit ?
            <_UsersEdit user={user} setUser={setUser} toggleEdit={toggleEdit} />
            : <_UsersDetail user={user} toggleEdit={toggleEdit} />
          }
        </section>
      </article>
    </div>
  );
};