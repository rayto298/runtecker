# "1期" から "60期"、"Pro-1" から "Pro-5" までのTermを作成し、"運営" を追加
terms = (1..60).map { |i| "#{i}期" } + (1..5).map { |i| "Pro-#{i}" } + ["運営"]
terms.each do |term_name|
  Term.find_or_create_by(name: term_name)
end


# Prefecture のシードデータ作成
prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県",
  "山形県", "福島県", "茨城県", "栃木県", "群馬県",
  "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県",
  "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県",
  "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県",
  "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県",
  "鹿児島県", "沖縄県", "その他", "-"
]
prefectures.each do |pref_name|
  Prefecture.find_or_create_by(name: pref_name)
end


# social_services のシードデータ作成
social_services = [
  "Mattermost", "GitHub", "X", "Qiita", "Zenn", "note",
]
social_services.each do |service_name|
  SocialService.find_or_create_by(name: service_name, service_type: "default")
end


# ==================================== #
# 以下は本環境で実行されると困るシード #
# ==================================== #

# タグのダミーデータ作成
# tags = [
#   "Ruby", "Ruby on Rails", "JavaScript", "TypeScript", "Vue.js","Nuxt.js",  "React", "Next.js", "Docker", "AWS", "php", "Laravel", "Python",
# ]
# tags.each do |tag_name|
#   Tag.find_or_create_by(name: tag_name)
# end

# # ユーザーのダミーデータ作成
# 75.times do |i|
#   user = User.find_or_create_by(
#     email: "test#{i + 1}@example.com",
#     name: "ユーザー#{i + 1}",
#     nickname: "ダミー#{i + 1}",
#     profile: "ダミーユーザー#{i+1}です。よろしくお願いします！",
#     term_id: Term.find_by(name: terms.sample).id,
#     prefecture_id:  Prefecture.find_by(name: prefectures.sample).id,
#   )

#   # ユーザーのソーシャルサービスのダミー
#   social_services.each do |service_name|
#     UserSocialService.find_or_create_by(
#       user_id: user.id,
#       social_service_id: SocialService.find_by(name: service_name).id,
#       account_name: "test_account_#{service_name}_#{i + 1}"
#     )
#   end

#   # ユーザータグのダミーデータ作成
#   count = rand(1..5)
#   tags = Tag.find(Tag.pluck(:id).sample(count))
#   count.times do |j|
#     UserTag.find_or_create_by(
#       user_id: user.id,
#       tag_id: tags[j].id,
#       position: j + 1
#     )
#   end
# end