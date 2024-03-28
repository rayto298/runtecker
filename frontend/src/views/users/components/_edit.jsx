import { RoutePath } from "config/route_path";
import { _UsersEditService } from "./_edit_service";
import { useState, useEffect } from "react";
import { PrefecturesController } from "controllers/prefectures_controller";
import { SocialServicesController } from "controllers/social_services_controller";
import { _Avatar } from "./_avatar";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"
import { API_URL } from "config/settings";
import { _UsersTagEdit } from "./_tag_edit";

export const _UsersEdit = ({ user, toggleEdit, isEdit, setIsEdit, handleUserUpdated }) => {

  const { id } = useParams();
  // タグ
  const [userTags, setUserTags] = useState(() => {
    let newTags = [];
    // 既存のtagのidだと後から追加されたタグに対応しにくいため、idを振り直す
    let count = 1;
    if (user.user_tags?.length > 0) {
      newTags = user.user_tags.map((tag) => {
        return { id: count++, name: tag.tag.name };
      });
    } else {
      newTags = [];
    }
    return newTags;
  });

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
    let userSocialServicesToDelete = [];
    socialServicesInfo.forEach(({ serviceName, currentAccountName, initialAccountName }) => {
      const userSocialServiceId = getUserSocialServiceId(serviceName);
      // currentAccountNameが空、またはスペースのみの場合に対応
      const trimmedAccountName = currentAccountName.trim();
      if (initialAccountName !== trimmedAccountName) {
        if (trimmedAccountName === "") {
          // アカウント名が空になっている（またはスペースのみだった）場合、削除リストに追加
          if (userSocialServiceId) {
            userSocialServicesToDelete.push(userSocialServiceId);
          }
        } else {
          // 更新または新規追加の属性
          if (userSocialServiceId) {
            userSocialServicesAttributes.push({
              id: userSocialServiceId,
              account_name: trimmedAccountName
            });
          } else {
            userSocialServicesAttributes.push({
              social_service_id: getSocialServiceId(serviceName),
              account_name: trimmedAccountName
            });
          }
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

    // ユーザータグ更新用の配列
    let tag_names = userTags.map((tag) => tag.name);

    return {
      nickname: nickname !== initialUserState.nickname ? nickname : undefined,
      prefecture_id: Number(prefectureId) !== Number(initialUserState.prefecture_id) ? prefectureId : undefined,
      avatar: avatar !== initialUserState.avatar ? avatar : undefined,
      profile: profile !== initialUserState.profile ? profile : undefined,
      past_nicknames_attributes: pastNicknameAttributes.length > 0 ? pastNicknameAttributes : undefined,
      user_social_services_attributes: userSocialServicesAttributes.length > 0 ? userSocialServicesAttributes : undefined,
      user_social_services_to_delete: userSocialServicesToDelete.length > 0 ? userSocialServicesToDelete : undefined,
      tag_names: tag_names.length > 0 ? tag_names : undefined,
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
        const token = localStorage.getItem("authToken");
        console.log(updatedFields);

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
        <_UsersTagEdit userTags={userTags} setUserTags={setUserTags} />

        {/* 自己紹介 */}
        <textarea
          className="textarea w-full rounded-md"
          rows={10}
          value={profile}
          onChange={handleProfileChange}
        />
        <div className="w-full text-center">
          <button type="submit" className="btn bg-runteq-primary text-white text-xs mt-3">
            変更内容を保存
          </button>
        </div>
      </form>
    </>
  );
};
