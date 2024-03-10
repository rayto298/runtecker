class RegistrationsController < ApplicationController
  skip_before_action :authenticate_request, only: [:create]

  def create
    # フロントからヘッダを介して届いたトークン情報をRailsで読み取る
    token = request.headers['Authorization']&.split(' ')&.last
    Rails.logger.info("Token: #{token}") # データが届いていることを確認
    # トークンをデコード
    decoded_token = JwtService.decode(token)
    Rails.logger.info("フロントから送信されたToken: #{decoded_token}")

    # フロントのユーザー登録フォームから送信されたパラメーターを受け取る
    user_params = params.require(:registration).require(:user).permit(:name, :nickname, :email, :term_id, :prefecture_id)
    Rails.logger.info("フロントから送信されたuser_params")
    Rails.logger.info(user_params)
    
    # トランザクションの開始
    # User,User_authenticationの順にテーブルを作成
    ActiveRecord::Base.transaction do
      # User モデルの作成
      user = User.new(user_params)
      if user.save
        # UserAuthentication モデルの作成
        user_authentication = UserAuthentication.new(
          user_id: user.id,
          uid: decoded_token["github_user_id"], 
          provider: decoded_token["provider"]
        )
        Rails.logger.info("Userテーブル更新成功")
        if user_authentication.save
          Rails.logger.info("User_authenticationテーブル更新成功")
          # 成功時の処理
          render json: { success: true, user: user.as_json.merge(authentication: user_authentication.as_json) }, status: :created
        else
          # user_authenticationの保存に失敗した場合
          render json: { errors: user_authentication.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
      else
        # userの保存に失敗した場合
        render json: { errors: user.errors.full_messages.join(", ") }, status: :unprocessable_entity
      end
    end
  rescue => e
    # 例外発生時のエラーハンドリング
    render json: { errors: e.message }, status: :unprocessable_entity
  end
end


