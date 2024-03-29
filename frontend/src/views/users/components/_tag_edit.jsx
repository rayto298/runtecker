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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Autocomplete, TextField, Button } from "@mui/material";
import { TagsController } from "controllers/tags_controller";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { BsList } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";

export const _UsersTagEdit = memo(({ userTags, setUserTags }) => {
  const [activeId, setActiveId] = useState(null);
  const [inputValue, setInputValue] = useState(''); // Autocomplete の入力値の状態変数
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [allTags, setAllTags] = useState([]); // 全件取得したタグの配列
  const [autocompleteTags, setAutocompleteTags] = useState([]);

  const fetchData = useCallback(async () => {
    const tagsController = new TagsController();
    // 全件取得
    let autoTags = [];
    let count = 1;
    await tagsController.getTagsAll().then((data) => {
      const tags = data.map((tag) => {
        return { id: count++, name: tag.name };
      });
      autoTags = tags;
    });
    setAllTags(autoTags);

    let newTags = autoTags.filter((tag) => {
      return !userTags.some((userTag) => userTag.name === tag.name);
    });
    setAutocompleteTags(newTags);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // userTagsのidの最大値を確認
    if (userTags.length === 0) return;
    let newTags = allTags.filter((tag) => {
      return !userTags.some((userTag) => userTag.name === tag.name);
    });
    setAutocompleteTags(newTags);
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
    let tagsId = getTagsId();
    newValueArray.forEach((value) => {
      if (!value.trim()) return; // trim()を追加して余分な空白を削除
      if (userTags.some(tag => tag.name === value.trim())) { // trim()を追加して余分な空白を削除
        alert(`${value}は既に登録されています`);
        return;
      }
      setUserTags((prevUserTags) => [...prevUserTags, { id: tagsId++, name: value }]);
    });
    resetForm();
  };

  // タグのidの最大値を設定
  // NOTE : タグのidはユーザータグのidと被らないように設定
  //        タグの数からid設定すると、最大値となるidがユーザータグのidと被る可能性があるため
  const getTagsId = () => {
    let count = 0;
    userTags.forEach((tag) => {
      if (tag.id >= count) {
        count = tag.id;
      }
    });
    return ++count;
  }

  // フォームリセット
  const resetForm = () => {
    setInputValue("");
  }

  // タグ削除ハンドル
  const handleDelete = (id) => {
    setUserTags((prevUserTags) => prevUserTags.filter((tag) => tag.id !== id));
  }

  return (
    <>
      {userTags?.length > 0 && <div
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
          <SortableContext items={userTags} strategy={verticalListSortingStrategy}>
            <div className="m-[20px]" >
              {userTags?.map((tag) => (
                <SortableItem key={tag.id} tag={tag} handleDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>}
      <div className="flex justify-center items-center">
        <div className="w-5/6">
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
            inputValue={inputValue}
          />
        </div>
        <button className="btn rounded bg-primary ml-2 text-white" onClick={handleAddTag} type="button">追加</button>
      </div>
    </>
  )
});

export const SortableItem = ({ tag, handleDelete }) => {
  const {
    attributes, //これによって要素がドラッグ可能に
    listeners, //ドラッグ中に発生したイベントリスナー
    isDragging, //ドラッグ中かどうかを示す真偽値
    setNodeRef, //ドラッグ可能な要素のDOMノードを設定するための関数
    transform, //ドラッグ中の要素の変換情報。ドラッグ中に移動させるためのスタイルを設定できる
    transition, //ドラッグ中の要素に対する遷移情報。要素の移動にトランジションを追加できる
  } = useSortable({ id: tag.id });

  return (
    <div
      className="bg-gray-200 text-s px-1 py-2 rounded-full m-1.5 hover:transform hover:-translate-y-0.5 flex justify-between items-center w-auto"
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform), //これで掴んで動かすアニメーションが実現
        transition: transition || undefined,
      }}
    >
      <button type="button" className={`px-2 text-gray-500 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        {...attributes}
        {...listeners}><BsList /></button>
      <span className="truncate text-start mx-3">{tag.name}</span>
      <button type="button" onClick={() => handleDelete(tag.id)} className="px-2 text-gray-500"><AiOutlineCloseCircle /></button>
    </div>
  );
};
