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


# ユーザーの作成
user = User.create!(
  email: "aexample@example.com",
  name: "とぴ",
  nickname: "とぴ",
  profile: "春～夏はダークモカチップフラペチーノ、秋～冬はカフェモカを飲んでいます。ただ近くにスタバがないので、月一に大きい街へ行くときのとっておきです。もっと近くにあったら嬉しいのですが、残念ながら最短でも車で40分近くかかりそうで気軽にいけません。非常に残念です。そこそこ田舎の山際に住んでいるので、最寄りのコンビニまで徒歩1時間超え、スーパーも徒歩40分ほど、最寄り駅まで徒歩1時間30分（自転車だと行きは15分、帰りは30分）と、車社会の世界で生きています。その世界に生きているにも関わらず、私は自分の車をもっていません。RUNTEQに入るお金で中古車1台帰ると気づいたのは、入学して1ヶ月経ったときのことでした。給付金制度でお金が返ってはきますが、そのお金でMacを買うか悩んでいます。業界標準がMacだと聞いて入るものの、普段がWindowsなので業務でしか使わなそうな気がしており、それはそれで良いのですが会社支給があれば嬉しいなと下心満載です。いぇあ",
  term: Term.find_or_create_by(name: "52期A"),
  github_account: "topi0247",
  prefecture: Prefecture.find_or_create_by(name: "長野県"),
  # avatar を削除しました
)

# ソーシャルサービスの関連付け
social_services = [
  { name: "X", account_name: "topi_log" },
  { name: "Times", account_name: "52a_nishina_kanae" },
  { name: "Qiita", account_name: "topi_log" },
  { name: "Note", account_name: "topi_log" },
  { name: "Zenn", account_name: "topi_log" }
]

PastNickname.create!(user: user, nickname: "とっぴ")

social_services.each do |social_service|
  service = SocialService.find_or_create_by(name: social_service[:name])
  if service.persisted? && user.persisted?
    UserSocialService.create(user: user, social_service: service, account_name: social_service[:account_name])
  else
    Rails.logger.warn "Failed to create UserSocialService for #{social_service[:name]}"
  end
end