import SideBar from "./SideBar"
import {useDispatch} from 'react-redux'
export default function Navbar() {
  const dispatch = useDispatch()
  return (
    <>
    <nav className={`fixed top-0 w-full p-3 bg-[#2a17a4] flex flex-col font-serif text-white xl:h-14  transition-all duration-500 `}>
      <div className="flex flex-row justify-between w-full ">
        <h1 className="mx-4 text-2xl xl:mr-5">News Master</h1>
  <div className="justify-self-end">
  <label className="mr-9">
    <input type="checkbox" name="sortOption" onClick={(e:any) => {
      dispatch({type:'SortState/setShow',payload:e.target.checked})
    }} />
    <span className="ml-5">Sort A-Z</span>
  </label>
  </div>
     </div>
     </nav>
    <SideBar></SideBar>
    </>
  )
}
