import { RoutePath } from "config/route_path"
import { Link } from "react-router-dom";

export const _UsersDetail = ({ user, toggleEdit }) => {
  const getSocialServiceUrl = (social_type, account_name) => {
    switch (social_type) {
      case "twitter":
        return `https://twitter.com/${account_name}`;
      case "times":
        return `https://chat.runteq.jp/runteq/channels/times_${account_name}`;
      case "qiita":
        return `https://qiita.com/${account_name}`;
      case "zenn":
        return `https://zenn.dev/${account_name}`;
      case "note":
        return `https://note.com/${account_name}`;
      default:
        return "";
    }
  }

  return (
    <>
      <div className="w-full text-end">
        <button onClick={toggleEdit} className="btn text-xs">編集</button>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex w-1/2 flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold">{user.nickname}</h2>
          <p className="text-sm">（旧：{user.pastname}）</p>
        </div>
        <div className="w-1/2 flex justify-center items-center text-2xl gap-2">
          <Link to={`${RoutePath.Users.path}?term=${user.term_id}`}>{user.term}</Link>
          <Link to={`${RoutePath.Users.path}?prefecture=19`}>
            {user.prefecture}
          </Link>
        </div>
      </div>
      <div className="py-4 w-full">
        <figure className="w-full">
          <img src={user.avatar} className="m-auto h-[300px] w-auto" />
        </figure>
      </div>
      {user.user_social_service &&
        <div className="w-full">
          <ul className="flex gap-3 w-full justify-center items-center">
            {user.user_social_service.map((social, index) => (
              <li key={index}>
                <Link to={getSocialServiceUrl(social.name, social.account_name)} className="hover:opacity-50 transition-all text-blue-500" target="_blank">
                  {social.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      }
      {user.user_tags?.length > 0 &&
        <div className="text-center my-2">
          {user.user_tags.map((tag, index) => (
            <Link to={`${RoutePath.Users.path}?tag=${tag.id}`} key={index} className="bg-gray-200 text-xs px-2 py-1 rounded-full m-1">{tag.name}</Link>
          ))}
        </div>}
      {user.profile &&
        <div className="my-5 bg-slate-100 p-4 rounded">
          <p className="text-start break-words">{user.profile}</p>
        </div>}
    </>
  )
}
