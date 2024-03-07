class SessionsController < ApplicationController
	skip_before_action :authenticate_request, only: [:create]
  def create
    # OmniAuthで提供される認証情報を取得
    user_info = request.env['omniauth.auth']
    user = UserAuthentication.find_or_create_from_auth_hash(user_info)

    # トークン生成（JWTなど）。このコードの後半で定義している
    token = generate_token_for_user(user)

    # フロントエンドにリダイレクトし、トークンをクエリパラメーターとして付加
		# フロントのURLに応じて変更
    redirect_to "http://localhost:8000/auth?token=#{token}"
  end

  private

  def generate_token_for_user(user)
    # トークンの有効期限を設定（例: 24時間）
    exp = Time.now.to_i + 24 * 3600

    # トークンに含めるペイロードの設定
    payload = { user_id: user.id, exp: exp }

    # 秘密鍵（環境変数やRailsの秘密情報から取得することを推奨）
    hmac_secret = ENV['JWT_SECRET_KEY']

    # JWTトークンの生成
    token = JWT.encode(payload, hmac_secret, 'HS256')
    token
  end
end