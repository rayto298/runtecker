import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/auth";
import { RoutePath } from "config/route_path";

export const UserSessionsNew = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log(token); // TO DO 本番時は削除　確認用

    if (token) {
      setAuth(token);
      localStorage.setItem("auth", token);
      navigate(RoutePath.UsersNew.path);
    }
  }, [setAuth, navigate]);

  const handleGitHubAuth = () => {
    // Rails APIの認証エンドポイントにリダイレクト
    const apiUrl = process.env.REACT_APP_API_URL;
    window.location.href = `${apiUrl}/auth/github`;
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
              <button
                className="bg-black text-white py-2.5 px-5 rounded my-4"
                onClick={handleGitHubAuth}
              >
                <div className="flex items-center justify-center">
                  {/* GitHubアイコンを追加する場合は次の行のコメントを解除 */}
                  {/* <FaGithub className="text-xl" /> */}
                  <span>RUNTECKERを利用する</span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
};
