class UserAuthentication < ApplicationRecord
  # belongs_to :user

  validates :provider, presence: true
  validates :uid, presence: true, uniqueness: { scope: :provider }
  # tokensに関するバリデーションが必要な場合は追加してください
end
