import { RoutePath } from "config/route_path";
import { Link } from "react-router-dom";
import { _UsersEditService } from "./_edit_service";

export const _UsersEdit = ({ user, toggleEdit }) => {
  // プレビュー用
  const handleClickImagePreview = () => {
    let inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";
    inputElement.click();
    inputElement.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        // プレビュー用にデータを取得・表示
        setUser({ ...user, image: e.target.result });
      };
      reader.readAsDataURL(file);
    };
  };

  // サービス名をセット
  const serviceNames = ["X", "MatterMost", "Qiita", "note", "Zenn"];

  // アカウント名をセット
  const accountNames = ["rayto-x", "", "rayto-qiita", "", "rayto-zenn"];

  return (
    <>
      <div className="w-full text-end">
        <button onClick={toggleEdit} className="btn text-xs">
          戻る
        </button>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex w-1/2 flex-col items-center justify-center">
          <input
            type="text"
            placeholder={user.nickname}
            className="input text-center w-4/5 max-w-xs rounded-md text-2xl"
          />
          <p className="text-sm">（旧：{user.pastname}）</p>
        </div>
        <div className="w-1/2 flex justify-center items-center text-2xl gap-2">
          <p>{user.term}</p>
          <select className="ms-1 select text-center w-2/5 max-w-xs rounded-md text-lg">
            <option>長野県</option>
            <option>東京都</option>
            <option>大阪府</option>
            <option>愛知県</option>
            <option>北海道</option>
            <option>沖縄県</option>
          </select>
        </div>
      </div>
      <div className="py-4 w-full">
        <figure className="w-full">
          <div className="text-center flex justify-center items-center">
            <button
              className="bg-black bg-opacity-100 text-center hover:bg-opacity-100 transition-all w-auto h-auto relative flex justify-center items-center"
              onClick={handleClickImagePreview}
            >
              <img
                src={user.avatar}
                className="m-auto h-[300px] opacity-60 hover:opacity-40 transition-all"
              />
            </button>
          </div>
        </figure>
      </div>
      <div>
        {serviceNames.map((serviceName, index) => (
          <_UsersEditService
            key={index}
            serviceName={serviceName}
            accountName={accountNames[index]}
          />
        ))}
      </div>
      {user.user_tags?.length > 0 && (
        <div className="text-center my-2">
          {user.user_tags.map((tag, index) => (
            <Link
              to={`${RoutePath.Users.path}?tag=${tag.id}`}
              key={index}
              className="bg-gray-200 text-xs px-2 py-1 rounded-full m-1"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}
      <textarea
        className="textarea w-full rounded-md"
        rows={10}
        defaultValue={user.profile}
      />
      <div className="w-full text-center">
        <button onClick={toggleEdit} className="btn btn-primary text-xs mt-3">
          変更内容を保存
        </button>
      </div>
    </>
  );
};
