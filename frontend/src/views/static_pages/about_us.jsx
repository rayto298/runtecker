import React, { useEffect } from "react";

// 開発者データの例
const developersData = [
  {
    id: 1,
    name: "えふぐー",
    term: "50期B",
    avatar: "assets/developer/f_taka.png",
    role: "エンジニア",
  },
  {
    id: 2,
    name: "kzkio",
    term: "50期A",
    avatar: "assets/developer/kzkio.png",
    role: "エンジニア",
  },
  {
    id: 3,
    name: "SawaD",
    term: "50期A",
    avatar: "assets/developer/sawaD.png",
    role: "最近まで先生だった人",
  },
  {
    id: 4,
    name: "とぴ",
    term: "52期A",
    avatar: "assets/developer/topi.png",
    role: "エンジニア",
  },
  {
    id: 5,
    name: "ほのか",
    term: "50期B",
    avatar: "assets/developer/honoka.png",
    role: "エンジニア",
  },
  {
    id: 6,
    name: "MaTTa",
    term: "50期B",
    avatar: "assets/developer/MaTTa.png",
    role: "からあげデータサイエンティスト",
  },
  {
    id: 7,
    name: "rayto",
    term: "50期A",
    avatar: "assets/developer/rayto.png",
    role: "エンジニア",
  },
];

const DeveloperTeam = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="my-5 text-xl text-gray-800 font-bold tracking-tight">
        RUNTECKER 開発者一覧
      </h2>
      <div className="p-4 bg-white shadow rounded-lg">
        <nav className="flex space-x-4 justify-center p-4">
          <a
            href="#1"
            className="px-4 py-2 text-gray-700 hover:bg-orange-500 hover:text-white rounded-lg transition-colors duration-200"
          >
            すべて
          </a>
          <a
            href="#1"
            className="px-4 py-2 text-gray-700 hover:bg-orange-500 hover:text-white rounded-lg transition-colors duration-200"
          >
            チーム
          </a>
        </nav>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5 style={{ perspective: '1000px' }}">
          {developersData.map((developer) => (
            <div
              id={`${developer.id}`}
              className="flex flex-col items-center p-4"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                style={{
                  transition: "transform 0.5s",
                  transform: "rotateY(0deg)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "rotateY(180deg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "rotateY(0deg)")
                }
                className="w-36 h-36 rounded-full mb-4 shadow-xl"
                src={developer.avatar}
                alt={developer.name}
              />
              <p className="text-sm text-gray-600">{developer.role}</p>
              <p className="text-sm text-gray-600 font-semibold">
                {developer.term}
              </p>
              <h3 className="text-lg font-semibold">{developer.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DeveloperTeam;
