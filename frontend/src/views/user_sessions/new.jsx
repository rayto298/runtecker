import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../providers/auth';

export const UserSessionsNew = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    console.log(token); // Ensure this logs the expected token

    if (token) {
      setAuth(token); // Update authentication state
      localStorage.setItem('auth', token); // Persist token for session or longer term
      navigate('/dashboard'); // Adjust as necessary for your routing
    }
  }, [setAuth, navigate]);
  

  const handleGitHubAuth = () => {
    // Rails APIの認証エンドポイントにリダイレクト
    window.location.href = "http://localhost:3000/auth/github";
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
