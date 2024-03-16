import { memo } from "react"

export const _InputText = memo(({ id, text, setText, placeholder, addClass = "" }) => {
  return (
    <input type="text" onChange={(e) => setText(e.target.value)} placeholder={placeholder} className={`input rounded border-[#CED4DA] focus:outline-none focus:border-orange-500 ${addClass}`} id={id} value={text} />
  )
})
