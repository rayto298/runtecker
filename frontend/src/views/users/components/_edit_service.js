export const _UsersEditService = ({ serviceName, accountName }) => {
  return (
    <div className="mt-1 flex rounded-md shadow-sm w-1/2 m-auto">
      <label
        htmlFor="mattermost"
        className="block text-sm font-medium flex m-auto"
      >
        【ロゴ】
      </label>
      <span className="w-1/4 inline-flex h-10 items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
        {serviceName === "MatterMost" ? "times_" : serviceName}
      </span>
      <input
        id="userID"
        name="userID"
        placeholder={
          serviceName === "MatterMost"
            ? "times_以降を入力"
            : "アカウント名を入力"
        }
        type="text"
        required
        defaultValue={accountName}
        className="flex-1 form-input pl-3 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out border"
      />
    </div>
  );
};
