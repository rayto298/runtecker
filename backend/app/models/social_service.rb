class SocialService < ApplicationRecord
  has_many :user_social_services

  validates :name, presence: true
  validates :service_type, presence: true
  # nameとtypeの組み合わせのユニーク性など、必要に応じてバリデーションを追加
end
