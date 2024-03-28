class Api::V1::TagsController < ApplicationController
  def index
    tags = Tag.all
    render json: tags.as_json(only: %i[id name]), status: :ok
  end

  def show
    tag = Tag.find(params[:id])
    render json: tag.as_json, status: :ok
  end

  def index_limit
    # ============================================ #
    # よく使われているタグを制限付きで取得する場合 #
    # ============================================ #
    limit = params[:limit].to_i || 20
    # 制限有りの場合は下記を使う
    # user_tags = UserTag.group(:tag_id).count.sort_by { |_, v| -v }.first(limit)
    # 制限なしバージョン
    user_tags = UserTag.group(:tag_id).count.sort_by { |_, v| -v }
    # nameを取得
    tags = Tag.where(id: user_tags.map(&:first))
    render json: tags.as_json(only: %i[id name]), status: :ok
  end
end
