class Api::V1::UsersController < ApplicationController
  # GET /api/v1/users
  def index
    page = search_params[:page] || 1
    users = search_params_values_present? ? User.search(search_params) : User.all.order(created_at: :desc)
    render json: {users: users.per_page(page).map(&:as_custom_json_index), total: users.count}, status: :ok
  end

  # GET /api/v1/users/:id
  def show
    user = User.find(params[:id])
    render json: user, include: {
      past_nicknames: {
        only: [:id, :nickname]
      },
      user_social_services: {
        include: {
          social_service: {
            only: [:id, :name, :service_type]
          }
        },
        only: [:id, :account_name]
      },
      term: {
        only: [:id, :name]
      },
      prefecture: {
        only: [:id, :name]
      },
      user_tags:{
        only: [:position],
        include: {
          tag: {
            only: [:id, :name]
          }
        }
      }
    }, methods: [:pastname], only: [:id, :name, :nickname, :profile, :term_id, :github_account, :prefecture_id, :pastname, :avatar]
  end

  # PATCH/PUT /api/v1/users/:id
  def update
    @user = User.find(params[:id])

    # 設定されていたSNSアカウント名が空になっていた場合、UserSocialServiceから該当レコードを削除する処理
    if params[:user][:user_social_services_to_delete].present?
      params[:user][:user_social_services_to_delete].each do |id|
        user_social_service = @user.user_social_services.find_by(id: id)
        user_social_service.destroy if user_social_service
      end
    end
    
    if @user.update(update_params.except(:user_social_services_to_delete))
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

  # /api/v1/users/current

  def current
    if @current_user
      render json: { user: @current_user }
    else
      render json: { error: 'Not Authorized' }, status: :unauthorized
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def update_params
    params.require(:user).permit(
      :nickname, :prefecture_id, :avatar, :profile, 
      past_nicknames_attributes: [:nickname],
      user_social_services_attributes: [:id, :social_service_id, :account_name],
      user_social_services_to_delete: [:id]
    )
  end

  # 検索用のパラメータを取得
  def search_params
    params.delete(:user) # なぜかuserが入ってくるので削除
    params.permit(:nickname, :term, :prefecture, :tag_id, :tag_name, :page, :account_name)
  end

  # 検索用のパラメータが存在するか
  def search_params_values_present?
    # ページネーションのパラメータは除外
    search_params.except(:page).to_h.any?{ |_, value| value.present?}
  end
end