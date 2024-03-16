import { TermsController } from "controllers/terms_controller";
import { memo, useCallback, useEffect, useState } from "react";

export const _TermSelect = memo(({ selectTerm, setSelectTerm, addClass = "" }) => {
  const [terms, setTerms] = useState([]);

  const fetchData = useCallback(async () => {
    let terms = new TermsController();
    await terms.getTerms().then((data) => {
      if (data) {
        setTerms(data);
      } else {
        setTerms([]);
      }
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <select className={`select select-bordered border-[#CED4DA] focus:outline-none focus:border-orange-500 rounded-sm w-full max-w-xs ${addClass}`} id="search_term" value={selectTerm} onChange={(e) => setSelectTerm(e.target.value)}>
      <option value="">入学期</option>
      {terms.map((term) =>
        <option key={term.id} value={term.id}>{term.name}</option>
      )}
    </select>
  )
});
