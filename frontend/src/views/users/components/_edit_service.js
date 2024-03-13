import { useState } from "react";

export const _UsersEditService = ({ serviceName, accountName }) => {
 
  const [account, setAccount] = useState(accountName);
  
  const handleAccountChange = (e) => {
    setAccount(e.target.value);
  };

  const getServiceLogo = (serviceName) => {
    switch (serviceName) {
      case "twitter":
        return "ロゴA";
      case "times":
        return "ロゴB";
      case "qiita":
        return "ロゴC";
      case "note":
        return "ロゴD";
      case "zenn":
        return "ロゴE";
      default:
        return "ロゴ";
    }
  }

  return (

    <div className="mt-1 flex rounded-md w-5/12 m-auto">
      <div className="w-1/4 inline-flex h-10 items-center px-3 rounded-md">
        {getServiceLogo(serviceName)}
      </div>
      <input
        id="userID"
        name="userID"
        placeholder={
          serviceName === "times"
            ? "times_以降を入力"
            : "アカウント名を入力"
        }
        type="text"
        required
        value={account}
        onChange={handleAccountChange}
        className="flex-1 form-input pl-3 block w-full rounded-md transition duration-150 ease-in-out border"
      />
    </div>
  );
};
