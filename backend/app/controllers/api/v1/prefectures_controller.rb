class Api::V1::PrefecturesController < ApplicationController
  def index
    prefectures = Prefecture.all
    render json: prefectures, status: :ok
  end
end
