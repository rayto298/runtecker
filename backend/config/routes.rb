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

  # ユーザー登録のルート(API)
  namespace :api do
    namespace :v1 do
      get 'users/current', to: 'users#current'
      get 'tags/index_limit', to: 'tags#index_limit'
      resources :users
      resources :prefectures, only: %i[index]
      resources :terms, only: %i[index show]
      resources :tags, only: %i[index show]
      resources :social_services, only: %i[index]
    end
  end
end
