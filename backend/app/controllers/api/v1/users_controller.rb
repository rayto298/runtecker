class Api::V1::UsersController < ApplicationController
  # GET /api/v1/users
  def index
    users = search_params_values_present? ? User.search(search_params) : User.all.order(created_at: :desc)
    render json: users.map(&:as_custom_json_index), status: :ok
  end

  # GET /api/v1/users/:id
  def show
    @user = User.find(params[:id])
    render json: @user, include: {
      past_nicknames: {
        only: [:id, :nickname] # ここで必要なフィールドを指定
      },
      user_social_services: {
        include: {
          social_service: {
            only: [:id, :name, :service_type] # ここで必要なフィールドを指定
          }
        },
        only: [:id, :account_name] # ここで必要なフィールドを指定
      },
      term: {
        only: [:id, :name] # ここで必要なフィールドを指定
      },
      prefecture: {
        only: [:id, :name] # ここで必要なフィールドを指定
      }
    }, methods: [:pastname], only: [:id, :name, :nickname, :profile, :term_id, :github_account, :prefecture_id, :pastname, :avatar]
  end

  # PATCH/PUT /api/v1/users/:id
  def update
    @user = User.find(params[:id])
    if @user.update(update_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/users/:id
  def destroy
    @user = User.find(params[:id])
    @user.destroy
    head :no_content
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def update_params
    params.require(:user).permit(:nickname, :prefecture_id, :avatar, :profile)
  end

  # 検索用のパラメータを取得
  def search_params
    params.delete(:user) # なぜかuserが入ってくるので削除
    params.permit(:nickname, :term, :prefecture, :tag_id, :tag_name)
  end

  # 検索用のパラメータが存在するか
  def search_params_values_present?
    search_params.to_h.any?{ |_, value| value.present?}
  end
end