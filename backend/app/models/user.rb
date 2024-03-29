class User < ApplicationRecord
  has_many :past_nicknames, dependent: :destroy
  has_one :user_authentication
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  has_many :user_tags, dependent: :destroy
  has_many :tags, through: :user_tags
  has_many :user_social_services, dependent: :destroy
  has_many :social_services, through: :user_social_services
  belongs_to :term
  belongs_to :prefecture
  # ユーザ更新時にuser以外のテーブルも更新できるようにするための設定
  accepts_nested_attributes_for :user_social_services
  accepts_nested_attributes_for :past_nicknames

  scope :with_nickname, ->(nickname) {
    sanitized_nickname = ActiveRecord::Base.sanitize_sql_like(nickname)
    where('nickname LIKE ?', "%#{sanitized_nickname}%")
  }

  scope :with_term, ->(term_id) {
    where(term_id: term_id)
  }

  scope :with_prefecture, ->(prefecture_id) {
    where(prefecture_id: prefecture_id)
  }

  scope :by_tag_id, ->(tag_id) {
    where(tags: { id: tag_id }).references(:tags)
  }

  scope :by_tag_name, ->(tag_name) {
    where(tags: { name: tag_name }).references(:tags)
  }

  scope :per_page, ->(page) {
    page = page.to_i
    page = 1 if page < 1
    # 12件ずつ表示する
    limit(12).offset(12 * (page - 1))
  }

  def pastname
    past_nicknames.last.nickname unless past_nicknames.empty? # past_nicknamesが空でなければ最新のnicknameを返す
  end

  def update_user_tags(user_id, tag_names)
    # 既存のユーザータグを削除
    user_tags = UserTag.where(user_id: user_id)
    user_tags.destroy_all

    # 新しいユーザータグを登録
    tag_names.each do |tag_name|
      tag = Tag.find_or_create_by(name: tag_name)
      UserTag.create!(user_id: user_id, tag_id: tag.id)
    end
  end

  # デフォルトのソーシャルサービスを取得
  def default_social_services
    social_services.where(service_type: 'default')
  end

  # TODO : 検索用クラスを別途設ける
  def self.search(params)
    # 検索条件を受け取る
    nickname = params[:nickname]
    term = params[:term]
    prefecture = params[:prefecture]
    tag_id = params[:tag_id]
    tag_name = params[:tag_name]
    account_name = params[:account_name]

    users = User.distinct.includes(:tags, :prefecture, :term)

    # ニックネームの検索
    users = users.with_nickname(nickname) if nickname.present?

    # 都道府県のid検索
    users = users.with_prefecture(prefecture) if prefecture.present?

    # 入学期のid検索
    users = users.with_term(term) if term.present?

    # SNSアカウント名の検索
    users = users.joins(:user_social_services).where(user_social_services: { account_name: account_name }) if account_name.present?

    # タグ検索がない場合はそのまま返す
    # タグ検索のとき、ユーザーデータを再度取得しているのが重くなる可能性があったため、
    # タグ検索以外はここで返却するようにしています
    if tag_id.blank? && tag_name.blank?
      users.order(created_at: :desc)
    else
      # タグidの検索
      users = users.by_tag_id(tag_id) if tag_id.present?

      # タグネームの検索
      users = users.by_tag_name(tag_name) if tag_name.present?

      # タグ検索したときに、ユーザーが持つタグを全て取得するためにこのように書きました
      User.includes(:tags).where(id: users.map(&:id)).order(created_at: :desc)
    end
  end

  # ユーザーの一覧用情報をカスタムJSON形式で返す
  # ソーシャルサービスはデフォルトタイプだけ返却するようにしています
  def as_custom_json_index
    as_json(
      only: %i[id nickname avatar],
      include: {
        prefecture: {
          only: %i[id name]
        },
        term: {
          only: %i[id name]
        },
        tags: {
          only: %i[id name]
        }
      }
    ).merge(social_services: default_social_services.map do |service|
      user_social_service = user_social_services.find_by(social_service: service)
      service.as_json(only: %i[id name]).merge(
        account_name: user_social_service ? user_social_service.account_name : nil
      )
    end)
  end
end