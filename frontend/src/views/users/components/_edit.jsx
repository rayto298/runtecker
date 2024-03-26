import { RoutePath } from "config/route_path";
import { Link } from "react-router-dom";
import { _UsersEditService } from "./_edit_service";
import { useState, useEffect, useCallback } from "react";
import { PrefecturesController } from "controllers/prefectures_controller";
import { SocialServicesController } from "controllers/social_services_controller";
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
import { API_URL } from "config/settings";
import { Autocomplete, TextField, Button } from "@mui/material";


export const _UsersEdit = ({ user, toggleEdit, isEdit, setIsEdit, handleUserUpdated }) => {

  const { id } = useParams();

  const getAccountName = (serviceName) => {
    const service = user.user_social_services.find(service => service.social_service.name === serviceName);
    return service ? service.account_name : "";
  };

  // 編集画面に遷移した時のユーザ情報を保持（ユーザが編集したかを判定するために使用）
  const initialUserState = {
    nickname: user.nickname,
    prefecture_id: user.prefecture_id,
    avatar: user.avatar,
    profile: user.profile,
  };

  // 編集画面に遷移した時のUserSocialServiceのアカウント名の情報を保持（ユーザが編集したかを判定するために使用）
  const initialAccountName = {
    mattermostAccount: getAccountName("Mattermost"),
    githubAccount: getAccountName("GitHub"),
    xAccount: getAccountName("X"),
    qiitaAccount: getAccountName("Qiita"),
    zennAccount: getAccountName("Zenn"),
    noteAccount: getAccountName("note"),
  }

  //タグの仮データ
  const tagData = [ //タグ全てのデータ
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
  const initUserTags = [ //ユーザーの編集前状態のタグ
    { id: 2, name: "Ruby on Railssssssssssssssss" },
    { id: 4, name: "TypeScript" },
    { id: 6, name: "Nuxt.js" },
    { id: 9, name: "Docker" },
    { id: 12, name: "Laravel" },
  ];

  const [tags, setTags] = useState(tagData);
  const [userTags, setUserTags] = useState(initUserTags);
  const [activeId, setActiveId] = useState(null);
  const [inputValue, setInputValue] = useState(''); // Autocomplete の入力値の状態変数
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    const otherTags = tags.filter(tag => !userTags.some(userTag => userTag.id === tag.id));
    setTags(otherTags);
  },[userTags])

  //ドラッグが始まったときの処理
  const handleDragStart = useCallback((event) => {
    console.log("つかんだタグ: " + event.active.id);
    setActiveId(event.active.id);
  }, []);

  //ドラッグが終わる時の処理
  const handleDragEnd = useCallback((event) => {
    // console.log(activeId); //⭐activeIdは非同期に更新されるのでここではnullのまま。処理で使うならactive.idにする
    if(event.active && event.over){ //よりセーフティに。これナシだと，掴まず軽くタップした時にエラーになる
      const { active, over } = event; //イベントハンドラーからドラッグ中の要素と重なった先の要素を取得
  
      if (active.id !== over?.id) { //2つが一致しないとき（?.でoverがnullでもエラーを吐かない）
        setUserTags((userTags) => {
          const activeTag = userTags.findIndex((tag) => tag.id === active.id);
          const overTag = userTags.findIndex((tag) => tag.id === over.id);
          const newTags = arrayMove(userTags, activeTag, overTag);
          
          newTags.forEach((tags) => console.log(tags.id + " : " + tags.name));
          return newTags;
        })
        //dnd-kit/sortableからインポートしたarrayMove()を呼び出して入れ替え処理を行う
      }
      console.log('activeIdは非同期なのでnullのまま: ' + activeId)
    }
    setActiveId(null); //activeIdをリセット      
  }, []);

  //ドラッグがキャンセルされた時の処理（activeIdをリセットするだけ）
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleAddTag = () => {
    if (inputValue.trim() !== '') {
      setUserTags((prevUserTags) => [...prevUserTags, inputValue.trim()]);
      if (!tags.includes(inputValue.trim())) {
        setTags((prevTags) => [...prevTags, inputValue.trim()]);
      }
      setInputValue(null);
    }
  };

  const customIsOptionEqualToValue = (option, value) => {
    // 空文字列の場合は無視する
    if (value === '') {
      return true; // trueを返すことで一致とみなされず、無視されます
    }
    // それ以外の場合はデフォルトの比較を行う
    return option === value;
  };

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

  // ソーシャルサービス
  const [socialServices, setSocialServices] = useState([]);

  useEffect(() => {
    let socialServices = new SocialServicesController();
    socialServices.getSocialServices().then((data) => {
      if (data) {
        setSocialServices(data);
      } else {
        setSocialServices([]);
      }
    });
  }, []);

  const getUserSocialServiceId = (serviceName) => {
    const service = user.user_social_services.find(service => service.social_service.name === serviceName);
    return service ? service.id : "";
  };

  const getSocialServiceId = (serviceName) => {
    const socialService = socialServices.find(socialService => socialService.name === serviceName);
    return socialService ? socialService.id : "";
  }

  // Mattermost
  const [mattermostAccount, setMattermostAccount] = useState(getAccountName("Mattermost"));
  const handleMattermostAccountChange = (e) => {
    setMattermostAccount(e.target.value);
  };

  // GitHub
  const [githubAccount, setGithubAccount] = useState(getAccountName("GitHub"));
  const handleGithubAccountChange = (e) => {
    setGithubAccount(e.target.value);
  };

  // X
  const [xAccount, setXAccount] = useState(getAccountName("X"));
  const handleXAccountChange = (e) => {
    setXAccount(e.target.value);
  };

  // Qiita
  const [qiitaAccount, setQiitaAccount] = useState(getAccountName("Qiita"));
  const handleQiitaAccountChange = (e) => {
    setQiitaAccount(e.target.value);
  };

  // Zenn
  const [zennAccount, setZennAccount] = useState(getAccountName("Zenn"));
  const handleZennAccountChange = (e) => {
    setZennAccount(e.target.value);
  };

  // note
  const [noteAccount, setNoteAccount] = useState(getAccountName("note"));
  const handleNoteAccountChange = (e) => {
    setNoteAccount(e.target.value);
  };

  // フォーム内でユーザが編集したフィールドを取得する関数
  const generateUpdatedFields = () => {

    const socialServicesInfo = [
      { serviceName: "Mattermost", currentAccountName: mattermostAccount, initialAccountName: initialAccountName.mattermostAccount },
      { serviceName: "GitHub", currentAccountName: githubAccount, initialAccountName: initialAccountName.githubAccount },
      { serviceName: "X", currentAccountName: xAccount, initialAccountName: initialAccountName.xAccount },
      { serviceName: "Qiita", currentAccountName: qiitaAccount, initialAccountName: initialAccountName.qiitaAccount },
      { serviceName: "Zenn", currentAccountName: zennAccount, initialAccountName: initialAccountName.zennAccount },
      { serviceName: "note", currentAccountName: noteAccount, initialAccountName: initialAccountName.noteAccount },
    ];
  
    let userSocialServicesAttributes = [];
  
    socialServicesInfo.forEach(({ serviceName, currentAccountName, initialAccountName }) => {
      const userSocialServiceId = getUserSocialServiceId(serviceName);
      if (initialAccountName !== currentAccountName) {
        if (userSocialServiceId) {
          userSocialServicesAttributes.push({
            id: userSocialServiceId,
            account_name: currentAccountName
          });
        } else {
          userSocialServicesAttributes.push({
            social_service_id: getSocialServiceId(serviceName),
            account_name: currentAccountName
          });
        }
      }
    });

    // PastNickname更新用の配列
    let pastNicknameAttributes = [];

    if (nickname !== initialUserState.nickname) {
      pastNicknameAttributes.push({
        nickname: initialUserState.nickname
      });
    }

    return {
      nickname: nickname !== initialUserState.nickname ? nickname : undefined,
      prefecture_id: Number(prefectureId) !== Number(initialUserState.prefecture_id) ? prefectureId : undefined,
      avatar: avatar !== initialUserState.avatar ? avatar : undefined,
      profile: profile !== initialUserState.profile ? profile : undefined,
      user_social_services_attributes: userSocialServicesAttributes.length > 0 ? userSocialServicesAttributes : undefined,
      past_nicknames_attributes: pastNicknameAttributes.length > 0 ? pastNicknameAttributes : undefined,
    };
  }

  // フォーム送信処理
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ

    // フォーム内でユーザが編集したフィールドを取得
    const updatedFields = generateUpdatedFields();

    // 変更がある場合のみAPIコールを実行
    if (Object.keys(updatedFields).filter(key => updatedFields[key] !== undefined).length > 0) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
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
          alert("ユーザ情報を更新しました");
        } else {
          alert("ユーザ情報の更新に失敗しました");
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

  // 戻るボタンが押された時の処理
  const toggleEditConfirm = () => {

    // フォーム内でユーザが編集したフィールドを取得
    const updatedFields = generateUpdatedFields();

      // 編集されたフィールドがあるかを判定
    if (Object.keys(updatedFields).filter(key => updatedFields[key] !== undefined).length > 0) {

      // 編集されたフィールドがあったら、確認メッセージを出す
      const isConfirmed = window.confirm('変更内容が破棄されますがよろしいですか？');
      if (isConfirmed) {
        setIsEdit(!isEdit);
      }
    } else {
      setIsEdit(!isEdit);
    }
  }

  return (
    <>
      <div className="w-full text-end">
        <button onClick={toggleEditConfirm} className="btn text-xs">
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
            <_UsersEditService serviceName="Mattermost" account={mattermostAccount} handleAccountChange={handleMattermostAccountChange} />
            <_UsersEditService serviceName="GitHub" account={githubAccount} handleAccountChange={handleGithubAccountChange} />
            <_UsersEditService serviceName="X" account={xAccount} handleAccountChange={handleXAccountChange} />
          </div>
          <div className="w-5/12 pe-8">
            <_UsersEditService serviceName="Qiita" account={qiitaAccount} handleAccountChange={handleQiitaAccountChange} />
            <_UsersEditService serviceName="Zenn" account={zennAccount} handleAccountChange={handleZennAccountChange} />
            <_UsersEditService serviceName="note" account={noteAccount} handleAccountChange={handleNoteAccountChange} />
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
            <SortableContext items={userTags} strategy={rectSortingStrategy}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  margin: "20px",
                }}
              >
                {userTags.map((tag) => (
                  <SortableItem key={tag.id} tag={tag} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        {/* タグ登録フォーム */}
        <div>
          <Autocomplete
          id="tag-form"
          freeSolo
          options={tags}
          getOptionLabel={(option) => option.name} // オブジェクトから表示する値を指定
          isOptionEqualToValue={customIsOptionEqualToValue}
          renderInput={(params) => <TextField {...params} label="タグを選択または新規作成" />}
          ></Autocomplete>
          <Button onClick={handleAddTag}>登録</Button>
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
