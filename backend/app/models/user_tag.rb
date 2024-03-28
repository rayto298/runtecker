class UserTag < ApplicationRecord
  belongs_to :user
  belongs_to :tag
  
  # validates :position, numericality: { only_integer: true }
  # user_idとtag_idの組み合わせのユニーク性など、必要に応じてバリデーションを追加
end