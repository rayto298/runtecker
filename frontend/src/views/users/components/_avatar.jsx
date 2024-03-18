import Compressor from "compressorjs";

export const _Avatar = memo(({ avatar, setAvatar }) => {
  // プレビュー画像
  const handleClickImagePreview = () => {
    let inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";
    inputElement.click();
    inputElement.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      compressAvatar(file).then((result) => {
        setAvatar(result);
      });
    };
  };

  // アバター画像の圧縮
  const compressAvatar = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,           // 画質
        maxHeight: 300,         // 最大高さ
        convertSize: 0,         // 変換サイズ、このサイズを超えると変換される
        mimeType: "image/webp", // 画像形式
        success(result) {
          // 画像データを読み込んで状態にセット
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = (err) => {
            console.log(err.message);
            reject(err);
          }
          reader.readAsDataURL(result);
        },
        error(err) {
          console.log(err.message);
          reject(err);
        },
      });
    });
  };
  return (
    <div className="py-4 w-full">
      <figure className="w-full">
        <div className="text-center flex justify-center items-center">
          <button
            className="bg-opacity-100 text-center hover:bg-opacity-100 transition-all w-auto h-auto relative flex justify-center items-center"
            onClick={handleClickImagePreview}
          >
            <img
              src={avatar ?? "https://placehold.jp/ff7300/ffffff/300x300.jpg?text=Avatar"}
              className="m-auto h-[300px] opacity-60 hover:opacity-40 transition-all"
              alt="プロフィール画像"
            />
          </button>
        </div>
      </figure>
    </div>
  );
});
