import { RoutePath } from "config/route_path";
import { useAuth } from "providers/auth";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { SiMattermost } from "react-icons/si";
import { Link } from "react-router-dom";

export const _UsersDetail = ({ user, toggleEdit }) => {
  const { currentUser } = useAuth();
  const serviceDisplayOrder = ["Mattermost", "GitHub", "X", "Qiita", "Zenn", "note", "Notion"];
  const [socialServiceLinks, setSocialServiceLinks] = useState([]);

  useEffect(() => {
    const processedUserSocialServices = user?.user_social_services?.map(service => {
      const socialType = service.social_service?.name;
      return {
        name: socialType,
        account_name: service.account_name,
        url: getSocialServiceUrl(socialType, service.account_name),
      };
    }).sort((a, b) => {
      return serviceDisplayOrder.indexOf(a.name) - serviceDisplayOrder.indexOf(b.name);
    }) || [];
    setSocialServiceLinks(processedUserSocialServices);
  }, []);

  // ソーシャルメディアのURLを取得する関数
  const getSocialServiceUrl = (social_type, account_name) => {
    switch (social_type) {
      case "Mattermost":
        return `${account_name}`;
      case "GitHub":
        return `https://github.com/${account_name}`;
      case "X":
        return `https://twitter.com/${account_name}`;
      case "Qiita":
        return `https://qiita.com/${account_name}`;
      case "Zenn":
        return `https://zenn.dev/${account_name}`;
      case "note":
        return `https://note.com/${account_name}`;
      default:
        return "";
    }
  };

  const getSocialService = (social_type, account_name) => {
    switch (social_type) {
      case "Mattermost":
        return <Link to={`https://chat.runteq.jp/runteq/channels/times_${account_name}`}><SiMattermost /></Link>;
      case "GitHub":
        return <Link to={`https://github.com/${account_name}`} className="hover:opacity-50 transition-all"><FaGithub /></Link>;
      case "X":
        return <Link to={`https://twitter.com/${account_name}`} className="hover:opacity-50 transition-all"><FaSquareXTwitter /></Link>;
      case "Qiita":
        return;
      case "Zenn":
        return;
      case "note":
        return;
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
              <a href={service.url} className="hover:opacity-50 transition-all text-blue-500" target="_blank" rel="noopener noreferrer">
                {service.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {user?.user_tags?.length > 0 &&
        <div className="text-center my-2" style={{ display: 'flex', flexWrap: 'wrap' }}>
          {user?.user_tags.map((tag, index) => (
            <Link to={`${RoutePath.Users.path}?tag=${tag.id}`} key={index} className="bg-gray-200 text-s px-2 py-1 rounded-full m-1">{tag.name}</Link>
          ))}
        </div>}
      {user?.profile &&
        <div className="my-5 bg-slate-100 p-4 rounded">
          <p className="text-start break-words">{user.profile}</p>
        </div>}
    </>
  );
};