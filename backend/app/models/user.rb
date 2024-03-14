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

  scope :tags_joins , -> { joins(:tags) }
  scope :all_includes, -> { includes(:prefecture, :term, :tags, :past_nicknames, :user_social_services) }
  scope :all_joins, -> { joins(:prefecture, :term, :tags, :past_nicknames, :user_social_services) }

  def pastname
    past_nicknames.last.nickname unless past_nicknames.empty? # past_nicknamesが空でなければ最新のnicknameを返す
  end

  def self.search(params)
    # 検索条件を受け取る
    words = params[:word].present? ? params[:word].split(/,/).map(&:strip) : []
    term = params[:term]
    prefecture = params[:prefecture]
    tag = params[:tag]

    return User.all.order(created_at: :desc) unless words.present? || term.present? || prefecture.present? || tag.present?

    users = User.all.order(created_at: :desc).all_includes
    # 入学期フィルター
    users = users.where(term_id: term) if term.present?
    # 都道府県フィルター
    users = users.where(prefecture_id: prefecture) if prefecture.present?
    # タグフィルター
    users = users.joins(:tags).where(tags: { id: tag }) if tag.present?
    users
  end
end