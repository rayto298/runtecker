import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { _UsersEdit } from "./components/_edit"
import { _UsersDetail } from "./components/_user_detail"
import { useNavigate } from 'react-router-dom';
import { RoutePath } from "config/route_path";
import { UsersController } from "controllers/users_controller";

export const UsersShow = () => {
  const navigate = useNavigate(); // useNavigateフックからnavigate関数を取得
  const [error, setError] = useState(''); // エラーメッセージを保持する状態
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const fetchUserData = async () => {
    try {
      const userController = new UsersController();
      const { user } = await userController.getUserById(id);
      setUser(user);
    } catch (err) {
      setError(err.message);
      //setTimeout(() => navigate(RoutePath.Users.path), 3000);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id, navigate]);  // idが変わったときに再度フェッチするために依存配列にidを含める// idが変わったときに再度フェッチするために依存配列にidを含める

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  }

  // ユーザの更新を検知してユーザ情報を取得し直すハンドラ
  const handleUserUpdated = () => {
    // ユーザー情報の再取得などの処理をここに記述
    fetchUserData(); // ユーザー情報を再取得する関数
  };

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
            <_UsersEdit user={user} toggleEdit={toggleEdit} isEdit={isEdit} setIsEdit={setIsEdit} handleUserUpdated={handleUserUpdated} />
            : <_UsersDetail user={user} toggleEdit={toggleEdit} />
          }
        </section>
      </article>
    </div>
  );
};