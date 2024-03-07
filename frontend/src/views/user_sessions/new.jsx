export const UserSessionsNew = () => {

  const handleGitHubAuth = () => {
    // TODO : ボタンを押したあとの処理をここに書く
    console.log("ボタンが押されました");
  };

  return (
    <article className="pt-12 pb-12 max-w-[65%] m-auto">
      <div className="bg-white rounded p-[50px]">
        <div className="p-5">
          <section className="text-center">
            <div className="block mb-3">
              <h2 className="text-2xl font-semibold">GitHub認証</h2>
            </div>
            <div className="text-center">
              <button className="bg-black text-white py-2.5 px-5 rounded my-4" onClick={handleGitHubAuth}>
                <div className="flex items-center">
                  {/* TODO : GitHubアイコンがfont awesomeを利用しており、こちらのプロジェクトにまだ入れていないので一旦アイコン削除しています */}
                  RUNTECKERを利用する
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
