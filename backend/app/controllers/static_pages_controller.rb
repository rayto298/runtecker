class StaticPagesController < ApplicationController
  skip_before_action :authenticate_request
  def index
    tasks = Task.all
    render json: tasks,status: :ok
  end
end
