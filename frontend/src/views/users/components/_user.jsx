import { RoutePath } from "config/route_path"
import { memo } from "react";
import { Link } from "react-router-dom"
import { IconContext } from 'react-icons'
import { FaGithub } from "react-icons/fa";
import { SiMattermost } from "react-icons/si";
import { RiTwitterXFill } from "react-icons/ri";

export const _User = memo((user) => {
  const userData = user.user;
  // ソーシャルサービスの並び順
  const matterMost = userData.social_services?.find((social) => social.name === "Mattermost");
  const twitter = userData.social_services?.find((social) => social.name === "X");
  const github = userData.social_services?.find((social) => social.name === "GitHub");
  const socialServices = [matterMost, github, twitter];

  const socialService = (name, account_name) => {
    switch (name) {
      case "Mattermost":
        return <Link to={`https://chat.runteq.jp/runteq/channels/times_${account_name}`} className="hover:opacity-50 transition-all" target="_blank"><SiMattermost /></Link>;
      case "GitHub":
        return <Link to={`https://github.com/${account_name}`} className="hover:opacity-50 transition-all" target="_blank"><FaGithub /></Link>;
      case "X":
        return <Link to={`https://twitter.com/${account_name}`} className="hover:opacity-50 transition-all" target="_blank"><RiTwitterXFill /></Link>;
      default:
        return null;
    }
  }

  // タグの最大表示数を設定
  const maxTagsToShow = 7;

  // 最大表示文字数を設定
  const maxTagLength = 10;

  return (
    <div
      key={userData.id}
      className="card w-96 border border-[#CED4DA] m-4 shadow-xl overflow-hidden hover:shadow-2xl group rounded-xl p-5 transition-all duration-200 transform bg-white"
      style={{ height: '400px' }}
    >
      <Link
        to={`${RoutePath.Users.path}?term=${userData.term.id}`}
        className="text-xl px-2 ml-auto hover:opacity-50 transition-all"
      >
        {userData.term.name}
      </Link>
      <div className="flex px-2 items-center gap-4">
        <img src={userData.avatar ?? "https://placehold.jp/ff7300/ffffff/300x300.jpg?text=Avatar"}
          className="w-32 group-hover:w-36 group-hover:h-36 h-32 object-center object-cover rounded-full transition-all duration-200 delay-200 transform"
          alt="Avatar"
        />
        <div className="p-4 transition-all transform duration-200">
          <h1 className="card-title font-bold">
            <Link to={RoutePath.UsersShow.path(userData.id)} className="hover:opacity-50 transition-all">{userData.nickname}</Link>
          </h1>
          {userData.pastname ? <p className="text-sm">（旧：{userData.pastname}）</p> : ""}
          <Link
            to={`${RoutePath.Users.path}?prefecture=${userData.prefecture.id}`}
            className="inline-flex item-center text-sm py-4 hover:opacity-50 transition-all"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            </svg>
            {userData.prefecture.name}
          </Link>
        </div>
      </div>
      {
        userData.social_services.length > 0 &&
        <IconContext.Provider value={{ size: "25px" }}>
          <ul className="flex gap-3 justify-end items-center px-2">
            {socialServices.map((social, index) => (
              <li key={index}>{socialService(social?.name, social?.account_name)}</li>
            ))}
          </ul>
        </IconContext.Provider>
      }
      <div className="px-2 pt-2 ml-auto group-hover:opacity-100 opacity-0 transform transition-all delay-300 duration-200">
        <Link to={RoutePath.UsersShow.path(userData.id)}>詳細 →</Link>
      </div>
      {userData.tags?.length > 0 &&
        <div className="p-2 m-4 border-t border-black">
          {userData.tags.slice(0, maxTagsToShow).map((tag, index) => (
            <Link
              to={`${RoutePath.Users.path}?tagId=${tag.id}`}
              key={index}
              className="badge badge-outline hover:opacity-50 transition-all mr-2"
              title={tag.name.length > maxTagLength ? tag.name : null} // タグが長すぎる場合に省略
            >
              {tag.name.length > maxTagLength ? `${tag.name.slice(0, maxTagLength)}...` : tag.name}
            </Link>
          ))}
          {userData.tags.length > maxTagsToShow && (
            <p className="text-gray-500 text-sm text-right mt-2">(他 {userData.tags.length - maxTagsToShow} 個タグ有)</p>
          )}
        </div>
      }
    </div>
  )
})