class ApplicationController < ActionController::Base
  # User登録処理が固まるまでの暫定
  before_action :authenticate_request
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token
  
  protected
  
  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    begin
      @decoded = JwtService.decode(header)
      @current_user = User.find(@decoded[:user_id])
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError => e
      Rails.logger.error "Authentication error: #{e.message}"
      render json: { errors: e.message }, status: :unauthorized
    end
  end
end

