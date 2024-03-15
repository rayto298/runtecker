import { RoutePath } from "config/route_path";
import { Link } from "react-router-dom";
import { _UsersEditService } from "./_edit_service";
import { useState, useCallback } from "react";
import { //ここからdnd-kit
  DndContext,
  closestCenter, 
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors } from "@dnd-kit/core";
import { 
  useSortable,
  arrayMove, 
  SortableContext, 
  rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'

export const _UsersEdit = ({ user, originalData, setUser, toggleEdit }) => {
  console.log(user); // ここで受け取ったuserオブジェクトを確認
  console.log(originalData); // ここで受け取ったoriginalDataオブジェクトを確認
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

  //タグの仮データ
  const tagData = [
    { id: 1, name: "Ruby"},
    { id: 2, name: "Ruby on Railssssssssssssssss"}, 
    { id: 3, name: "JavaScript"},
    { id: 4, name: "TypeScript"},
    { id: 5, name: "Vue.js"},
    { id: 6, name: "Nuxt.js"},
    { id: 7, name: "React"},
    { id: 8, name: "Next.js"},
    { id: 9, name: "Docker"},
    { id: 10, name: "AWS"}, 
    { id: 11, name: "php"}, 
    { id: 12, name: "Laravel"},
    { id: 13, name: "Python"},
  ]
  const [tags, setTags] = useState(tagData);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  //ドラッグが始まったときの処理
  const handleDragStart = useCallback((event) => {
    console.log('つかんだタグ: ' + event.active.id);
    setActiveId(event.active.id);
  }, []);

  //ドラッグが終わる時の処理
  const handleDragEnd = useCallback((event) => {
    if(event.active && event.over){ //これナシだと，掴まず軽くタップした時にエラーになる
      const { active, over } = event; 
      if (active.id !== over?.id) {
        console.log('active.id = ' + active.id)
        console.log('over.id = ' + over.id)
        setTags((tags) => {
          const activeTag = tags.findIndex(tag => tag.id === active.id);
          const overTag = tags.findIndex(tag => tag.id === over.id);
          const newTags = arrayMove(tags, activeTag, overTag);
          newTags.forEach(tags => console.log(tags.id + ' : ' + tags.name));
          return newTags;
        })
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
      <div className="sortable-item-wrapper" style={{ margin: '4px', width: 'auto' }}>
        <DndContext
          sensors={sensors} 
          collisionDetection={closestCenter}
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd} 
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={tags} strategy={rectSortingStrategy}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(5, 1fr)',
                margin: '20px', 
                }}>
                  {tags.map((tag) => (
                    <SortableItem  key={tag.id} tag={tag}/>
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
        <button onClick={toggleEdit} className="btn btn-primary text-xs mt-3">
          変更内容を保存
        </button>
      </div>
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
    transition //ドラッグ中の要素に対する遷移情報。要素の移動にトランジションを追加できる
  } = useSortable({ id: tag.id });

  return (
    <div className="bg-gray-200 text-s text-center px-2 py-1 rounded-full m-1 hover:transform hover:-translate-y-0.5"
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform), //これで掴んで動かすアニメーションが実現
        transition: transition || undefined,
        cursor: isDragging ? 'grabbing' : 'grab',
        width: 'auto',
        padding: '4px 8px',
        margin: '6px',
        justifyContent: 'center',
        alignItems: 'center',

        overflow: 'hidden', //以下3つで長い文字列を省略する形に
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}
      
      {...attributes}
      {...listeners}
    >
      { tag.name } 
    </div>
  )
}

