class StaticPagesController < ApplicationController
  def index
    tasks = Task.all
    render json: tasks,status: :ok
  end
end
