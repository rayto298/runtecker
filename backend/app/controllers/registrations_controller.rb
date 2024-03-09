class RegistrationsController < ApplicationController
  # User登録処理が固まるまでの暫定
  # authenticate_requestはJWTトークンをデコードし、@decodedに情報を格納
  before_action :authenticate_request, only: [:create]

  def create
    # ユーザー情報をリクエストパラメータから取得
    # TO DO ユーザー登録の実装時に精緻化
    user_params = params.require(:user).permit(:name, :email, :password)

    ActiveRecord::Base.transaction do
      # Userモデルの作成または更新
      @user = User.create!(user_params)

      # UserAuthenticationモデルの作成または更新
      @user_authentication = UserAuthentication.find_or_initialize_by(uid: @decoded[:uid], provider: @decoded[:provider])
      @user_authentication.user = @user
      @user_authentication.save!
    end

    render json: { success: true, user: @user }
  rescue => e
    render json: { errors: e.message }, status: :unprocessable_entity
  end


  # TO DO ユーザー登録実装時にストロングパラメータを追加
end
