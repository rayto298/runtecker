import { PrefecturesController } from "controllers/prefectures_controller";
import { memo, useCallback, useEffect, useState } from "react";

export const _PrefectureSelect = memo(({ selectPrefecture, setSelectPrefecture, addClass = "" }) => {
  const [prefectures, setPrefectures] = useState([]);

  const fetchData = useCallback(async () => {
    let prefecture = new PrefecturesController();
    await prefecture.getPrefectures().then((data) => {
      if (data) {
        setPrefectures(data);
      } else {
        setPrefectures([]);
      }
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <select className={`select select-bordered border-[#CED4DA] focus:outline-none focus:border-orange-500 rounded-sm w-full max-w-md ${addClass}`} id="search_term" value={selectPrefecture} onChange={(e) => setSelectPrefecture(e.target.value)}>
      <option value="">都道府県</option>
      {prefectures.map((term) =>
        <option key={term.id} value={term.id}>{term.name}</option>
      )}
    </select>
  )
});
