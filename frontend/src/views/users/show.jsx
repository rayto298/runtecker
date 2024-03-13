import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { _UsersEdit } from "./components/_edit"
import { _UsersDetail } from "./components/_user_detail"

export const UsersShow = () => {
  // ここでuseParamsを使ってURLからidを取得します
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const userData = {
    id: id,
    name: "とぴ",
    nickname: "とぴ",
    pastname: "とっぴ",
    profile: "春～夏はダークモカチップフラペチーノ、秋～冬はカフェモカを飲んでいます。ただ近くにスタバがないので、月一に大きい街へ行くときのとっておきです。もっと近くにあったら嬉しいのですが、残念ながら最短でも車で40分近くかかりそうで気軽にいけません。非常に残念です。そこそこ田舎の山際に住んでいるので、最寄りのコンビニまで徒歩1時間超え、スーパーも徒歩40分ほど、最寄り駅まで徒歩1時間30分（自転車だと行きは15分、帰りは30分）と、車社会の世界で生きています。その世界に生きているにも関わらず、私は自分の車をもっていません。RUNTEQに入るお金で中古車1台帰ると気づいたのは、入学して1ヶ月経ったときのことでした。給付金制度でお金が返ってはきますが、そのお金でMacを買うか悩んでいます。業界標準がMacだと聞いて入るものの、普段がWindowsなので業務でしか使わなそうな気がしており、それはそれで良いのですが会社支給があれば嬉しいなと下心満載です。いぇあ",
    term: "52期A",
    term_id: 52,
    github_account: "topi0247",
    prefecture: "長野県",
    prefecture_id: 20,
    avatar: "https://pbs.twimg.com/profile_images/1750171124573540352/19Gfg3oh_400x400.jpg",
    user_tags: [
      {
        id: 1,
        name: "Ruby",
        position: "1"
      },
      {
        id: 2,
        name: "Ruby on Rails",
        position: "2"
      },
      {
        id: 3,
        name: "JavaScript",
        position: "3"
      }
    ],
    user_social_service: [
      {
        name: "twitter",
        account_name: "topi_log"
      },
      {
        name: "times",
        account_name: "52a_nishina_kanae"
      },
      {
        name: "qiita",
        account_name: "topi_log"
      },
      {
        name: "note",
        account_name: "topi_log"
      },
      {
        name: "zenn",
        account_name: "topi_log"
      },
    ]
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${id}`);
        if (!response.ok) {
          throw new Error('ネットワークレスポンスがOKではありません');
        }
        const data = await response.json();
  
        // 既存の加工処理
      const processedData = {
        ...data,
        term: data.term.name, // term情報を名前のみに加工
        prefecture: data.prefecture.name, // prefecture情報を名前のみに加工
        user_social_services: data.user_social_services.map(service => {
          // ソーシャルサービス情報がundefinedでないことを確認し、加工してオブジェクトの配列に
          return {
             name: service.social_service ? service.social_service.name : 'Unknown Service', // social_serviceがundefinedの場合はデフォルト値を使用
             account_name: service.account_name
          };
         })
        };

        console.log(processedData); // ここで加工後のデータをコンソールに出力
  
        // 足りない部分をダミーデータで補完
        const supplementedData = {
          ...processedData,
          // ここで足りない部分をダミーデータや既に定義されているuserDataから補完
          // 例: user_tagsが足りない場合
          user_tags: processedData.user_tags || userData.user_tags,
          avatar: processedData.avatar || userData.avatar,
          // 他に足りないデータがあれば、同様に補完
        };
  
        setUser({
          ...supplementedData,
          user_social_service: supplementedData.user_social_services // ここでプロパティ名を調整
        });// 加工後のデータをセット
      } catch (error) {
        console.error("ユーザーデータの取得中にエラーが発生しました:", error);
        setUser(userData); // エラー時のフォールバックデータ
      }
    };
  
    fetchUserData();
  }, [id]); // idが変わったときに再度フェッチするために依存配列にidを含める// idが変わったときに再度フェッチするために依存配列にidを含める

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  }

  return (
    <article className="max-w-screen-lg w-full m-auto my-10">
      <section className="bg-white rounded p-12 w-full max-w-screen-md m-auto">
        {isEdit ?
          <_UsersEdit user={user} setUser={setUser} toggleEdit={toggleEdit} />
          : <_UsersDetail user={user} toggleEdit={toggleEdit} />
        }
      </section>
    </article >
  )
}
