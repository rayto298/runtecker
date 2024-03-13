class User < ApplicationRecord
  has_many :past_nicknames, dependent: :destroy
  has_many :user_tags, dependent: :destroy
  has_many :tags, through: :user_tags
  has_many :user_social_services, dependent: :destroy
  belongs_to :term
  belongs_to :prefecture
  has_one :user_authentication    
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  # 他にも必要に応じてバリデーションを追加してください
def pastname
    past_nicknames.last.nickname unless past_nicknames.empty? #past_nicknamesが空でなければ最新のnicknameを返す
  end
end

