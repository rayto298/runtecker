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

  scope :with_nickname, ->(nickname) {
    return if nickname.blank?
    where('name LIKE ?', "%#{nickname}%")
  }

  scope :with_term, ->(term_id) {
    return if term_id.blank?
    where(term_id: term_id)
  }

  scope :with_prefecture, ->(prefecture_id) {
    return if prefecture_id.blank?
    where(prefecture_id: prefecture_id)
  }

  scope :with_tag_by_id, ->(tag_id) {
    return if tag.blank?
    joins(:tags).where(tags: { id: tag_id })
  }

  scope :with_tag_by_name, ->(tag_name) {
    return if tag_name.blank?
    joins(:tags).where(tags: { name: tag_name })
  }

  def pastname
    past_nicknames.last.nickname unless past_nicknames.empty? # past_nicknamesが空でなければ最新のnicknameを返す
  end

  # TODO : 検索用クラスを別途設ける
  def self.search(params)
    # 検索条件を受け取る
    nickname = params[:nickname]
    term = params[:term]
    prefecture = params[:prefecture]
    tag_id = params[:tag_id]
    tag_name = params[:tag_name]

    users = User.includes(:tags, :prefecture, :term)

    # ニックネームの検索
    return users.with_nickname(nickname).order(created_at: :desc) if nickname.present?

    # タグネームの検索
    return users.with_tag_by_name(tag_name).order(created_at: :desc) if tag_name.present?

    # 都道府県のid検索
    return users.with_prefecture(prefecture) if prefecture.present?

    # 入学期のid検索
    return users = users.with_term(term) if term.present?

    # タグidの検索
    users.with_tag(tag_id).order(created_at: :desc) if tag_id.present?
  end
end