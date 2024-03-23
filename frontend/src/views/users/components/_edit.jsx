import { RoutePath } from "config/route_path";
import { Link } from "react-router-dom";
import { _UsersEditService } from "./_edit_service";
import { useState, useEffect, useCallback } from "react";
import { PrefecturesController } from "controllers/prefectures_controller";
import {
  //ここからdnd-kit
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  useSortable,
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { _Avatar } from "./_avatar";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"
import { API_URL } from "config/setting";

export const _UsersEdit = ({ user, toggleEdit, handleUserUpdated }) => {

  const { id } = useParams();

  // 編集画面に遷移した時の初期状態を取得
  const initialUserState = {
    nickname: user.nickname,
    prefecture_id: user.prefecture_id,
    avatar: user.avatar,
    profile: user.profile,
  };

  //タグの仮データ
  const tagData = [
    { id: 1, name: "Ruby" },
    { id: 2, name: "Ruby on Railssssssssssssssss" },
    { id: 3, name: "JavaScript" },
    { id: 4, name: "TypeScript" },
    { id: 5, name: "Vue.js" },
    { id: 6, name: "Nuxt.js" },
    { id: 7, name: "React" },
    { id: 8, name: "Next.js" },
    { id: 9, name: "Docker" },
    { id: 10, name: "AWS" },
    { id: 11, name: "php" },
    { id: 12, name: "Laravel" },
    { id: 13, name: "Python" },
  ];
  const [tags, setTags] = useState(tagData);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  //ドラッグが始まったときの処理
  const handleDragStart = useCallback((event) => {
    console.log("つかんだタグ: " + event.active.id);
    setActiveId(event.active.id);
  }, []);

  //ドラッグが終わる時の処理
  const handleDragEnd = useCallback((event) => {
    if (event.active && event.over) {
      //これナシだと，掴まず軽くタップした時にエラーになる
      const { active, over } = event;
      if (active.id !== over?.id) {
        console.log("active.id = " + active.id);
        console.log("over.id = " + over.id);
        setTags((tags) => {
          const activeTag = tags.findIndex((tag) => tag.id === active.id);
          const overTag = tags.findIndex((tag) => tag.id === over.id);
          const newTags = arrayMove(tags, activeTag, overTag);
          newTags.forEach((tags) => console.log(tags.id + " : " + tags.name));
          return newTags;
        });
      }
    }
    setActiveId(null); //activeIdをリセット
  }, []);

  //ドラッグがキャンセルされた時の処理（activeIdをリセットするだけ）
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  // ニックネーム
  const [nickname, setNickname] = useState(user.nickname);
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  // 都道府県
  const [prefectures, setPrefectures] = useState([]);
  const [prefectureId, setPrefectureId] = useState(user.prefecture.id);
  const handlePrefectureChange = (e) => {
    setPrefectureId(e.target.value);
  }

  useEffect(() => {
    let prefectures = new PrefecturesController();
    prefectures.getPrefectures().then((data) => {
      if (data) {
        setPrefectures(data);
      } else {
        setPrefectures([]);
      }
    });
  }, []);

  // アバター
  const [avatar, setAvatar] = useState(user.avatar); // アバター用のstate

  // 自己紹介
  const [profile, setProfile] = useState(user.profile);
  const handleProfileChange = (e) => {
    setProfile(e.target.value);
  };

  // フォーム送信
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ

    const updatedFields = {};
    if (nickname !== initialUserState.nickname) updatedFields.nickname = nickname;
    if (prefectureId !== initialUserState.prefecture_id) updatedFields.prefecture_id = prefectureId;
    if (avatar !== initialUserState.avatar) updatedFields.avatar = avatar;
    if (profile !== initialUserState.profile) updatedFields.profile = profile;

    // 変更がある場合のみAPIコールを実行
    if (Object.keys(updatedFields).length > 0) {
      try {
        const token = localStorage.getItem("authToken");
        
        const response = await fetch(`${API_URL}/api/v1/users/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user: updatedFields }),
        });

        if (response.ok) {
          // DBに保存されたユーザを取得する処理
          handleUserUpdated();
          alert("更新しました");
        } else {
          alert("更新に失敗しました");
        }

      } catch (error) {
        console.error("更新エラー", error);
        alert("更新処理中にエラーが発生しました");
      }

      // ユーザ更新処理実行後（成功/失敗に関わらず）、ユーザ詳細画面に遷移する処理
      navigate(RoutePath.UsersShow.path(id));
      toggleEdit();
      window.scrollTo(0, 0);

    } else {
      // 変更がない場合
      alert("変更点がありません");
    }
  };

  return (
    <>
      <div className="w-full text-end">
        <button onClick={toggleEdit} className="btn text-xs">
          戻る
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
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
            <p>{user.term.name}</p>
            <select
              className="ms-1 select text-center w-2/5 max-w-xs rounded-md text-lg"
              id="prefecture"
              name="prefecture"
              required
              value={prefectureId}
              onChange={handlePrefectureChange}
            >
              {prefectures.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* アバター */}
        <_Avatar avatar={avatar} setAvatar={setAvatar} />

        {/* サービスのリンク */}
        <div className="flex justify-center">
          <div className="w-5/12 pe-8">
            <_UsersEditService serviceName="Mattermost" user={user} />
            <_UsersEditService serviceName="GitHub" user={user} />
            <_UsersEditService serviceName="X" user={user} />
          </div>
          <div className="w-5/12">
            <_UsersEditService serviceName="Qiita" user={user} />
            <_UsersEditService serviceName="Zenn" user={user} />
            <_UsersEditService serviceName="note" user={user} />
          </div>
        </div>

        {/* タグ */}
        {/* {user.user_tags?.length > 0 && (
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
        )} */}
        {/* タグ（仮データ） */}
        <div
          className="sortable-item-wrapper"
          style={{ margin: "4px", width: "auto" }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={tags} strategy={rectSortingStrategy}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  margin: "20px",
                }}
              >
                {tags.map((tag) => (
                  <SortableItem key={tag.id} tag={tag} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        {/* 自己紹介 */}
        <textarea
          className="textarea w-full rounded-md"
          rows={10}
          value={profile}
          onChange={handleProfileChange}
        />
        <div className="w-full text-center">
          <button type="submit" className="btn btn-primary text-xs mt-3">
            変更内容を保存
          </button>
        </div>
      </form>
    </>
  );
};

export const SortableItem = ({ tag }) => {
  const {
    attributes, //これによって要素がドラッグ可能に
    isDragging, //現在の要素がドラッグ中かどうかを示すbool値
    listeners, //ドラッグ中に発生したイベントリスナー
    setNodeRef, //ドラッグ可能な要素のDOMノードを設定するための関数
    transform, //ドラッグ中の要素の変換情報。ドラッグ中に移動させるためのスタイルを設定できる
    transition, //ドラッグ中の要素に対する遷移情報。要素の移動にトランジションを追加できる
  } = useSortable({ id: tag.id });

  return (
    <div
      className="bg-gray-200 text-s text-center px-2 py-1 rounded-full m-1 hover:transform hover:-translate-y-0.5"
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform), //これで掴んで動かすアニメーションが実現
        transition: transition || undefined,
        cursor: isDragging ? "grabbing" : "grab",
        width: "auto",
        padding: "4px 8px",
        margin: "6px",
        justifyContent: "center",
        alignItems: "center",

        overflow: "hidden", //以下3つで長い文字列を省略する形に
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      {...attributes}
      {...listeners}
    >
      {tag.name}
    </div>
  );
};
