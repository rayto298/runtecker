import { _Headers } from "./components/_headers";
import { _Footers } from "./components/_footers";

export const AdminLayout = ({ children }) => {
  return (
    <div className='w-screen h-screen flex flex-col'>
      <_Headers />
      <main className='container w-full max-w-7xl m-auto flex-1'>{children}</main>
      <_Footers />
    </div>
  )
};