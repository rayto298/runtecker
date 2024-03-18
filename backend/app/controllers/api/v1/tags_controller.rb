class Api::V1::TagsController < ApplicationController
  def show
    tag = Tag.find(params[:id])
    render json: tag.as_json, status: :ok
  end
end
