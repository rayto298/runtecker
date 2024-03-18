class Api::V1::TermsController < ApplicationController
  skip_before_action :authenticate_request
  
  def index
    terms = Term.all
    render json: terms, status: :ok
  end

  def term
    term = Term.find(params[:id])
    render json: term, status: :ok
  end
end
