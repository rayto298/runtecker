Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # post '/auth/:provider', to: 'omniauth_callbacks#redirect_to_provider', as: :auth_provider
  get '/auth/:provider/callback', to: 'sessions#create'
  mount ActionCable.server => '/ws'
  
  # Defines the root path route ("/")
  # root "articles#index"
  root "static_pages#index"
  # OmniAuthのルート

  # ユーザー登録のルート(API)
  namespace :api do
    namespace :v1 do
      resources :users
      # 他のリソースもここに追加
    end
  end
 
end
