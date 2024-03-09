class UserSocialService < ApplicationRecord
  belongs_to :user
  belongs_to :social_service

  validates :account_name, presence: true
  # user_idとsocial_service_idの組み合わせのユニーク性など、必要に応じてバリデーションを追加
end
