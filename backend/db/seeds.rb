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
  "Qiita", "Zenn", "X", "Notion", "Mattermost"
]
social_services.each do |service_name|
  SocialService.find_or_create_by(name: service_name, service_type: "default")
end
