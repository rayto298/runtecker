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


# テストユーザーの作成
#user = User.create!(
 # email: "kzkio@examp.com",
 # name: "kzkio",
 # nickname: "かずちゃん",
 # profile: " スタバでは、春から冬も期間限定のフラペチーノを飲んでいます。3/13現在の期間限定は
 # キャラメリーミルクコーヒーフラペチーノです。
 # ちなみに、家からスタバまで3分ぐらいで行ける所にあります。私の住んでいる場所は山市でお茶が有名ですが
 # 実は、狭山茶の一番の産地は入間市になります。狭山茶は、三大銘茶に入っており味が良いと言われてます。
 # あとは、特に狭山市の紹介はないですね!!比較的に近くの市で有名なのは川越が有名で小江戸と言われ、
 # 昔からの建物や時の鐘などが見られ食べ物だとサツマイモが有名です。
 # そのほかにも、お菓子横丁などもあり観光には凄く良い所なので暇だったら行ってみてください！！
 # 全然、関係ない話になりますがゲームが好きで、最近はエルデンリングをプレイしていました。
 # エルデンリングは、ダークソウルのようなゲームで、難易度が高いですが、それがまた面白いです。
 # とりあえず、皆さんもエルデンリングをプレイしてみてください！！楽しいですよ！！",
 # term: Term.find_or_create_by(name: "50期A"),
 # github_account: "kzkio114",
 # prefecture: Prefecture.find_or_create_by(name: "埼玉県")
#)

# ソーシャルサービスの関連付け
#social_services_data = [
#  { name: "X", account_name: "kzkio_0114" },
#  { name: "Qiita", account_name: "kzkio" },
#  { name: "Zenn", account_name: "kzkio" },
#  { name: "Notion", account_name: "kzkio" },  
#  { name: "Mattermost", account_name: "ito_kazuki_50a" }  
#]

#PastNickname.create!(user: user, nickname: "kzkio")

#social_services_data.each do |social_service_data|
#  service = SocialService.find_by(name: social_service_data[:name])
#  UserSocialService.find_or_create_by(user: user, social_service: service, account_name: social_service_data[:account_name])
#end