class Api::V1::TermsController < ApplicationController
  def index
    terms = Term.all
    render json: terms, status: :ok
  end

  def term
    term = Term.find(params[:id])
    render json: term, status: :ok
  end
end
