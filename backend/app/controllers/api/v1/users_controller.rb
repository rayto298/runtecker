class Api::V1::UsersController < ApplicationController    
    
   # GET /api/v1/users
    def index
      @users = User.all
      render json: @users
    end
  
    # GET /api/v1/users/:id
    def show
      @user = User.find(params[:id])
      render json: @user, include: {
        past_nicknames: {},
        user_social_services: {
          include: :social_service # これでUserSocialService経由でSocialServiceのデータを含める
        },
        term: {},
        prefecture: {}
      }, methods: [:pastname]
    end
  
    # POST /api/v1/users
    def create
      @user = User.new(user_params)
      if @user.save
        render json: @user, status: :created
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    # PATCH/PUT /api/v1/users/:id
    def update
      @user = User.find(params[:id])
      if @user.update(user_params)
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
end