import { RoutePath } from "config/route_path";
import { Link, useNavigate } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from 'dompurify';

export const _UsersDetail = ({ user, toggleEdit }) => {

 function MarkdownToHtml({ markdownText }) {
  // マークダウンテキストが null または undefined の場合、空の文字列を使用
  const safeMarkdownText = markdownText ?? '';

  // マークダウンをHTMLに変換し、サニタイズ
  const rawHtml = marked(safeMarkdownText);
  const sanitizedHtml = DOMPurify.sanitize(rawHtml);

   // サニタイズされたHTMLをレンダリング
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}

  const navigate = useNavigate(); // useNavigateフックを使用してnavigate関数を取得
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
  
  // サービスの表示順序を指定
  const serviceDisplayOrder = ["Mattermost", "GitHub", "X", "Qiita", "Zenn", "note", "Notion"];

  // userがundefinedでないことを確認し、加工を行います。
  const processedUserSocialServices = user?.user_social_services?.map(service => {
     // service.social_service.name は存在しないため、socialType を直接使用
    const socialType = service.social_service?.name;
    return {
      name: socialType,
      account_name: service.account_name,
      url: getSocialServiceUrl(socialType, service.account_name),
    };
  }).sort((a, b) => {
    return serviceDisplayOrder.indexOf(a.name) - serviceDisplayOrder.indexOf(b.name);
  }) || [];

  // コンポーネントのUIを返します。
  return (
    <>
      <div className="w-full text-end">
        <button onClick={() => navigate('/users')} className="btn text-xs">戻る</button>
        <button onClick={toggleEdit} className="btn text-xs">編集</button>
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
          <img src={user?.avatar || 'https://placehold.jp/ff7300/ffffff/300x300.jpg?text=Avatar'} className="m-auto h-[300px] w-auto" />
        </figure>
      </div>
        <div className="w-full">
          <ul className="flex gap-3 w-full justify-center items-center">
          {processedUserSocialServices.map((service, index) => (
            <li key={index}>
              <a href={service.url} className="hover:opacity-50 transition-all text-blue-500" target="_blank" rel="noopener noreferrer">
               {service.name}
            </a>
          </li>
          ))}
        </ul>
      </div>
      {user?.user_tags?.length > 0 &&
        <div className="text-center my-2" style={{display: 'flex', flexWrap: 'wrap'}}>
          {user?.user_tags.map((tag, index) => (
            <Link to={`${RoutePath.Users.path}?tag=${tag.id}`} key={index} className="bg-gray-200 text-s px-2 py-1 rounded-full m-1">{tag.name}</Link>
          ))}
        </div>}
      {user?.profile &&
        <div className="my-5 bg-slate-100 p-4 rounded markdown-content">
          <MarkdownToHtml markdownText={user.profile} />     
        </div>}
    </>
  );
};