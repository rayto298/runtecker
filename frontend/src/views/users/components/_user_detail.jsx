import { RoutePath } from "config/route_path";
import { useAuth } from "providers/auth";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { SiMattermost } from "react-icons/si";
import { Link } from "react-router-dom";
import { NoteLogo } from "ui_components/icons/NoteLogo";
import { QiitaLogo } from "ui_components/icons/QiitaLogo";
import { ZennLogo } from "ui_components/icons/ZennLogo";

export const _UsersDetail = ({ user, toggleEdit }) => {
  const { currentUser } = useAuth();
  const serviceDisplayOrder = ["Mattermost", "GitHub", "X", "Qiita", "Zenn", "note", "Notion"];
  const [socialServiceLinks, setSocialServiceLinks] = useState([]);

  useEffect(() => {
    if (!user) return;
    const userSocialServices = user?.user_social_services?.map(service => {
      const socialType = service.social_service?.name;
      return {
        name: socialType,
        account_name: service.account_name,
      };
    }).sort((a, b) => {
      return serviceDisplayOrder.indexOf(a.name) - serviceDisplayOrder.indexOf(b.name);
    }) || [];
    setSocialServiceLinks(userSocialServices);
  }, [user]);

  // ソーシャルサービスの種類に応じてアイコンを返す関数
  const getSocialService = (social_type, account_name) => {
    switch (social_type) {
      case "Mattermost":
        return <Link to={`https://chat.runteq.jp/runteq/channels/times_${account_name}`} target="_blank"><SiMattermost /></Link>;
      case "GitHub":
        return <Link to={`https://github.com/${account_name}`} target="_blank" className="hover:opacity-50 transition-all"><FaGithub /></Link>;
      case "X":
        return <Link to={`https://twitter.com/${account_name}`} target="_blank" className="hover:opacity-50 transition-all"><RiTwitterXFill /></Link>;
      case "Qiita":
        return <Link to={`https://qiita.com/${account_name}`} target="_blank" className="hover:opacity-50 transition-all"><QiitaLogo /></Link>;
      case "Zenn":
        return <Link to={`https://zenn.dev/${account_name}`} target="_blank" className="hover:opacity-50 transition-all"><ZennLogo /></Link>;
      case "note":
        return <Link to={`https://note.com/${account_name}`} target="_blank" className="hover:opacity-50 transition-all"><NoteLogo /></Link>;
      default:
        return;
    }
  };

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <Link to={RoutePath.Users.path} className="text-blue-500 text-xs hover:opacity-60 transition-all">戻る</Link>
        {currentUser.id === user.id && <button onClick={toggleEdit} className="btn text-xs">編集</button>}
      </div>
      <div className="flex justify-between w-full">
        <div className="flex w-1/2 flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold">{user?.nickname}</h2>
          <p className="text-sm">（旧：{user?.pastname}）</p>
        </div>

        <div className="w-1/2 flex justify-center items-center text-2xl gap-2">
          {user?.term && <Link to={`${RoutePath.Users.path}?term=${user.term.id}`}>{user.term.name}</Link>}
          {user?.prefecture && <Link to={`${RoutePath.Users.path}?prefecture=${user.prefecture.id}`}>{user.prefecture.name}</Link>}
        </div>
      </div>
      <div className="py-4 w-full">
        <figure className="w-full">
          <img src={user?.avatar} className="m-auto h-[300px] w-auto" />
        </figure>
      </div>
      <div className="w-full">
        <ul className="flex gap-3 w-full justify-center items-center">
          {socialServiceLinks.map((service, index) => (
            <li key={index}>
              {getSocialService(service.name, service.account_name)}
            </li>
          ))}
        </ul>
      </div>
      {user?.user_tags?.length > 0 &&
        <div className="text-center my-2 flex flex-wrap">
          {user?.user_tags.map((tag, index) => (
            <Link to={`${RoutePath.Users.path}?tagId=${tag.id}`} key={index} className="bg-gray-200 text-s px-2 py-1 rounded-full m-1">{tag.name}</Link>
          ))}
        </div>}
      {user?.profile &&
        <div className="my-5 bg-slate-100 p-4 rounded">
          <p className="text-start break-words">{user.profile}</p>
        </div>}
    </>
  );
};