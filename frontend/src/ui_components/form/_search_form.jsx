import { RoutePath } from "config/route_path";
import { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { _InputText } from "./_input_text";
import { _PrefectureSelect } from "./_prefecture_select";
import { _TermSelect } from "./_term_select";
import { TagsController } from "controllers/tags_controller";

export const _SearchForm = memo(({ query }) => {
  const [searchNickName, setSearchNickName] = useState("");
  const [searchTagByName, setSearchTagByName] = useState("");
  const [searchPrefecture, setSearchPrefecture] = useState();
  const [searchTerm, setSearchTerm] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const { nickname, term, prefecture, tag_id, tag_name } = query;

    setSearchNickName(nickname);
    setSearchPrefecture(prefecture);
    setSearchTerm(term);
    setSearchTagByName(tag_name);
    if (!tag_name && tag_id) {
      const tagController = new TagsController();
      tagController.getTagById(tag_id).then((data) => {
        if (data) {
          setSearchTagByName(data.name);
        }
      });
    }
  }, [query]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    let query = "?";
    if (searchNickName) {
      query += `nickname=${searchNickName}`
    }
    if (searchTagByName) {
      query += query === "?" ? `tagName=${searchTagByName}` : `&tagName=${searchTagByName}`
    }
    if (searchPrefecture) {
      query += query === "?" ? `prefecture=${searchPrefecture}` : `&prefecture=${searchPrefecture}`
    }
    if (searchTerm) {
      query += query === "?" ? `term=${searchTerm}` : `&term=${searchTerm}`
    }
    navigate(RoutePath.Users.path + query);
  }

  return (
    <form className="flex gap-2 w-full" onSubmit={handleOnSubmit}>
      <_InputText id="search_nickname" text={searchNickName} setText={setSearchNickName} placeholder="ニックネーム" />
      <_InputText id="search_tag" text={searchTagByName} setText={setSearchTagByName} placeholder="タグ" />
      <_PrefectureSelect selectPrefecture={searchPrefecture} setSelectPrefecture={setSearchPrefecture} />
      <_TermSelect selectTerm={searchTerm} setSelectTerm={setSearchTerm} />
      <SearchButton className="btn bg-[#5050D9] rounded text-white px-6 tracking-wider hover:bg-[#5050D9]">
        検索
      </SearchButton>
      <LinkButton to={RoutePath.Users.path}>
        クリア
      </LinkButton>
    </form>
  )
})

// TODO : コンポーネント化するかは他の実装を見て考える
const LinkButton = memo(({ to, children }) => {
  return (
    <Link
      to={to}
      className="btn text-[#5050D9] border-[#5050D9] bg-white rounded px-6 tracking-wider hover:bg-[#5050D9] hover:text-white"
    >
      {children}
    </Link>
  )
})

// TODO : コンポーネント化するかは他の実装見て考える
const SearchButton = memo(({ children, onClick = null, addClass = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`btn bg-[#5050D9] rounded text-white px-6 tracking-wider hover:bg-[#5050D9] ${addClass}`}
    >
      {children}
    </button>
  )
});