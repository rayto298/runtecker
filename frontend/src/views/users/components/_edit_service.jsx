import { SiMattermost } from "react-icons/si";
import { RiTwitterXFill } from "react-icons/ri";
import { FaGithub } from "react-icons/fa";
import { QiitaLogo } from "ui_components/icons/QiitaLogo";
import { ZennLogo } from "ui_components/icons/ZennLogo";
import { NoteLogo } from "ui_components/icons/NoteLogo";

export const _UsersEditService = ({ serviceName, account, handleAccountChange }) => {
 
  const getServiceLogo = (serviceName) => {
    switch (serviceName) {
      case "Mattermost":
        return <SiMattermost />;
      case "GitHub":
        return <FaGithub />;
      case "X":
        return <RiTwitterXFill />;
      case "Qiita":
        return <QiitaLogo />;
      case "Zenn":
        return <ZennLogo />;
      case "note":
        return <NoteLogo />;
    }
  }

  const getPlaceholderText = (serviceName) => {
    switch (serviceName) {
      case "Mattermost":
        return "timesのリンクを入力";
      case "GitHub":
        return "github.com/以降を入力";
      default:
        return "アカウント名を入力";
    }
  };

  return (
    <div className="flex pb-3">
      <div className="w-1/5 flex h-12 items-center justify-center pe-1">
        {getServiceLogo(serviceName)}
      </div>
      <input
        placeholder={getPlaceholderText(serviceName)}
        type="text"
        value={account}
        onChange={handleAccountChange}
        className="input w-4/5 rounded-md"
      />
    </div>
  );
};
