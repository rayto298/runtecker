class PastNickname < ApplicationRecord
  belongs_to :user
  
  validates :nickname, presence: true
  # changed_atに関するバリデーションが必要な場合は追加してください
end