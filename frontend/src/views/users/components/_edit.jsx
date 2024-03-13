import { RoutePath } from "config/route_path";
import { Link } from "react-router-dom";
import { _UsersEditService } from "./_edit_service";
import { useState } from "react";

export const _UsersEdit = ({ user, setUser, toggleEdit }) => {
  // 都道府県の仮データ
  const prefectures = [
    { id: 1, name: "北海道" },
    { id: 2, name: "青森県" },
    { id: 3, name: "岩手県" },
    { id: 4, name: "宮城県" },
    { id: 5, name: "長野県" },
    { id: 6, name: "山形県" },
    { id: 7, name: "福島県" },
    { id: 8, name: "茨城県" },
    { id: 9, name: "栃木県" },
    { id: 10, name: "群馬県" },
  ];

  // ニックネーム
  const [nickname, setNickname] = useState(user.nickname);
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  // 都道府県
  const [prefecture, setPrefecture] = useState(user.prefecture);
  const handlePrefectureChange = (e) => {
    setPrefecture(e.target.value);
  };

  // アバター
  const [avatar, setAvatar] = useState(user.avatar);
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
        // 読み込まれた画像データを状態にセット
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    };
  };

  // 自己紹介
  const [profile, setProfile] = useState(user.profile);
  const handleProfileChange = (e) => {
    setProfile(e.target.value);
  };

  return (
    <>
      <div className="w-full text-end">
        <button onClick={toggleEdit} className="btn text-xs">
          戻る
        </button>
      </div>

      {/* ニックネーム */}
      <div className="flex justify-between w-full">
        <div className="flex w-1/2 flex-col items-center justify-center">
          <input
            type="text"
            placeholder="ニックネーム"
            value={nickname}
            onChange={handleNicknameChange}
            className="input text-center w-4/5 max-w-xs rounded-md text-2xl"
          />
          <p className="text-sm">（旧：{user.pastname}）</p>
        </div>

        {/* 都道府県 */}
        <div className="w-1/2 flex justify-center items-center text-2xl gap-2">
          <p>{user.term}</p>
          <select
            className="ms-1 select text-center w-2/5 max-w-xs rounded-md text-lg"
            value={prefecture}
            onChange={handlePrefectureChange}
          >
            {prefectures.map((prefecture) => (
              <option key={prefecture.id} value={prefecture.name}>
                {prefecture.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* アバター */}
      <div className="py-4 w-full">
        <figure className="w-full">
          <div className="text-center flex justify-center items-center">
            <button
              className="bg-black bg-opacity-100 text-center hover:bg-opacity-100 transition-all w-auto h-auto relative flex justify-center items-center"
              onClick={handleClickImagePreview}
            >
              <img
                src={avatar}
                className="m-auto h-[300px] opacity-60 hover:opacity-40 transition-all"
                alt="プロフィール画像"
              />
            </button>
          </div>
        </figure>
      </div>

      {/* サービスのリンク */}
      <div>
        {user.user_social_service.map((service, index) => (
          <_UsersEditService
            key={index}
            serviceName={service.name}
            accountName={service.account_name}
          />
        ))}
      </div>

      {/* タグ */}
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

      {/* 自己紹介 */}
      <textarea
        className="textarea w-full rounded-md"
        rows={10}
        value={profile}
        onChange={handleProfileChange}
      />
      <div className="w-full text-center">
        <button onClick={toggleEdit} className="btn btn-primary text-xs mt-3">
          変更内容を保存
        </button>
      </div>
    </>
  );
};
