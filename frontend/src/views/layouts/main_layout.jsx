import { _Headers } from "./components/_headers";
import { _Footers } from "./components/_footers";

export const MainLayout = ({ children }) => {
  return (
    <div className='w-screen min-h-screen flex flex-col'>
      <_Headers />
      <main className='container w-full max-w-7xl m-auto flex-1 px-4'>{children}</main>
      <_Footers />
    </div>
  )
};