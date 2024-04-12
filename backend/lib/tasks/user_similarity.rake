namespace :user_similarity do
  desc "ユーザー同士の類似度を計算し，UserSimilarityのsimilarityに保存する"
  task update_similarity: :environment do
    users = User.all

    users.each do |user|
      users.each do |target_user|
        next if user.id == target_user.id # 同一ユーザーは処理をスキップ

        user_similarity = UserSimilarity.find_or_create_by(user_id: user.id, target_user_id: target_user.id)

        similarity = 0 #初期値はゼロ

        similarity += 1 if user.prefecture == target_user.prefecture # 都道府県が一致すれば+1
        
        if user.tags.present? && target_user.tags.present?  # 両方のユーザーがタグを持っているとき
          matching_tags = user.tags.map(&:id) & target_user.tags.map(&:id) #一致するタグの配列を積算で求める
          similarity += matching_tags.length # 一致数を加算
        end

        user_similarity.update(similarity: similarity)
      end
    end
  end
end