class UserSocialService < ApplicationRecord
  belongs_to :user
  belongs_to :social_service

  validates :account_name, presence: true

  # account_nameのセッターオーバーライド
  def account_name=(value)
    self[:account_name] = extract_account_name(value)
  end

  # account_nameのゲッターオーバーライド
  def account_name
    return self[:account_name] unless self[:account_name].start_with?("http")
    extract_account_name(self[:account_name])
  end

  private

  # URLから名前を抽出する
  def extract_account_name(value)
    # RUNTEQのtimes
    if value.start_with?(ENV['RUNTEQ_MATTERMOST_URL'])
      value.split('/').dig(-1)&.split('times_')&.dig(-1)
    else
      value.split('/').dig(-1)
    end
  end
end
