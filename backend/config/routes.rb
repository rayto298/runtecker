Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # post '/auth/:provider', to: 'omniauth_callbacks#redirect_to_provider', as: :auth_provider
  get '/auth/:provider/callback', to: 'sessions#create'
  mount ActionCable.server => '/ws'
  post '/registrations', to: 'registrations#create'
  
  # Defines the root path route ("/")
  # root "articles#index"
  root "static_pages#index"
  # OmniAuthのルート
 
end
