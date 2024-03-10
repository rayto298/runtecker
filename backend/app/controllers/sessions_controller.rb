class SessionsController < ApplicationController
  skip_before_action :authenticate_request, only: [:create]

  def create
    # OmniAuthで提供される認証情報を取得
    user_info = request.env['omniauth.auth']
    
    # GitHubのユーザーIDを取得
    github_user_id = user_info.uid
    provider = "github"

    # GitHubのユーザーIDを使ってトークンを生成
    token = generate_token_with_github_user_id(github_user_id, provider)

    # GitHubのユーザーIDを使ってUserAuthenticationテーブルを検索
    user_authentication = UserAuthentication.find_by(uid: github_user_id, provider: provider)
    Rails.logger.info(user_authentication)

    if user_authentication
      # 既に存在する場合は、特定のページにリダイレクト
      redirect_to "http://localhost:8000/users?token=#{token}"
    else
      # ユーザー登録フォームページにリダイレクト
      redirect_to "http://localhost:8000/users/new?token=#{token}"
    end
  end

  private

  # トークンを暗号化の上で生成する
  def generate_token_with_github_user_id(github_user_id, provider)
    exp = Time.now.to_i + 24 * 3600
    payload = { github_user_id: github_user_id, provider: provider, exp: exp }
    hmac_secret = ENV['JWT_SECRET_KEY']
    JWT.encode(payload, hmac_secret, 'HS256')
  end

end
