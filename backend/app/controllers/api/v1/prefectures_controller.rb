class Api::V1::PrefecturesController < ApplicationController
  skip_before_action :authenticate_request
  def index
    prefectures = Prefecture.all
    render json: prefectures, status: :ok
  end
end
