class Api::V1::SocialServicesController < ApplicationController
  skip_before_action :authenticate_request, only: %i[index]
  def index
    socialServices = SocialService.all
    render json: socialServices, status: :ok
  end
end
