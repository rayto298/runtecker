class Api::V1::TagsController < ApplicationController
  def show
    tag = Tag.find(params[:id])
    render json: tag, status: :ok
  end

  private
end
