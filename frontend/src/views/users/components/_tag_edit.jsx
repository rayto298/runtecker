import {
  //ここからdnd-kit
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  useSortable,
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Autocomplete, TextField, Button } from "@mui/material";
import { TagsController } from "controllers/tags_controller";
import { memo, useCallback, useEffect, useState } from "react";

export const _UsersTagEdit = memo(({ userTags, setUserTags }) => {
  const [activeId, setActiveId] = useState(null);
  const [inputValue, setInputValue] = useState(''); // Autocomplete の入力値の状態変数
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [autocompleteTags, setAutocompleteTags] = useState([]);
  const [tagsCount, setTagsCount] = useState(0);
  const TAGS_LIMIT = 20; // 一度に取得するタグの数

  const fetchData = useCallback(() => {
    const tagsController = new TagsController();
    let count = 1000; // 既存のタグidと被らないように大きな数値を初期値に設定

    // 全取得はタグが増えれば増えるほど通信が重くなるので、制限してタグを取得
    // tagsController.getTagsLimit(TAGS_LIMIT).then((data) => {
    //   const tags = data.map((tag) => {
    //     return { id: count++, name: tag.name };
    //   });
    //   setAutocompleteTags(tags);
    // });

    // 全件取得
    tagsController.getTagsAll().then((data) => {
      const tags = data.map((tag) => {
        return { id: count++, name: tag.name };
      });
      setAutocompleteTags(tags);
    });

  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // userTagsのidの最大値を確認
    let count = 0;
    userTags.forEach((tag) => {
      if (tag.id > count) {
        count = tag.id;
      }
    });
    setTagsCount(count + 1);
  }, [userTags]);

  //ドラッグが始まったときの処理
  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  //ドラッグが終わる時の処理
  const handleDragEnd = useCallback((event) => {
    // console.log(activeId); //⭐activeIdは非同期に更新されるのでここではnullのまま。処理で使うならactive.idにする
    if (event.active && event.over) { //よりセーフティに。これナシだと，掴まず軽くタップした時にエラーになる
      const { active, over } = event; //イベントハンドラーからドラッグ中の要素と重なった先の要素を取得

      if (active.id !== over?.id) { //2つが一致しないとき（?.でoverがnullでもエラーを吐かない）
        setUserTags((userTags) => {
          const activeTag = userTags.findIndex((tag) => tag.id === active.id);
          const overTag = userTags.findIndex((tag) => tag.id === over.id);
          const newTags = arrayMove(userTags, activeTag, overTag);

          newTags.forEach((tags) => console.log(tags.id + " : " + tags.name));
          return newTags;
        })
        //dnd-kit/sortableからインポートしたarrayMove()を呼び出して入れ替え処理を行う
      }
    }
    setActiveId(null); //activeIdをリセット
  }, []);

  //ドラッグがキャンセルされた時の処理（activeIdをリセットするだけ）
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleAddTag = () => {
    if (!inputValue) return;
    // 新しい値がuserTagsにすでに存在するかどうかをチェック
    const newValueArray = inputValue.split(/[,、]/);
    let count = tagsCount;
    newValueArray.forEach((value) => {
      if (userTags.some(tag => tag.name === value.trim())) { // trim()を追加して余分な空白を削除
        alert(`${value}は既に登録されています`);
        return;
      }
      setUserTags((prevUserTags) => [...prevUserTags, { id: count++, name: value }]);
      setTagsCount(count);
    });

    setInputValue("");
  };

  return (
    <>
      <div
        className="sortable-item-wrapper"
        style={{ margin: "4px", width: "auto" }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={userTags} strategy={rectSortingStrategy}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                margin: "20px",
              }}
            >
              {userTags?.map((tag, index) => (
                <SortableItem key={tag.id} tag={tag} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <div>
        <Autocomplete
          id="tag-form"
          freeSolo
          options={autocompleteTags.map((tag) => tag.name)} // optionsをtagオブジェクトのname配列に変更
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField
              {...params}
              label="タグを新規作成"
              variant="outlined"
            />
          )}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
        />
        <Button onClick={handleAddTag}>登録</Button>
      </div>
    </>
  )
});

export const SortableItem = ({ tag }) => {
  const {
    attributes, //これによって要素がドラッグ可能に
    isDragging, //現在の要素がドラッグ中かどうかを示すbool値
    listeners, //ドラッグ中に発生したイベントリスナー
    setNodeRef, //ドラッグ可能な要素のDOMノードを設定するための関数
    transform, //ドラッグ中の要素の変換情報。ドラッグ中に移動させるためのスタイルを設定できる
    transition, //ドラッグ中の要素に対する遷移情報。要素の移動にトランジションを追加できる
  } = useSortable({ id: tag.id });

  return (
    <div
      className="bg-gray-200 text-s text-center px-2 py-1 rounded-full m-1 hover:transform hover:-translate-y-0.5"
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform), //これで掴んで動かすアニメーションが実現
        transition: transition || undefined,
        cursor: isDragging ? "grabbing" : "grab",
        width: "auto",
        padding: "4px 8px",
        margin: "6px",
        justifyContent: "center",
        alignItems: "center",

        overflow: "hidden", //以下3つで長い文字列を省略する形に
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      {...attributes}
      {...listeners}
    >
      {tag.name}
    </div>
  );
};
