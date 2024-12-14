import SideBar from "./SideBar"
import {useDispatch} from 'react-redux'
import axios from "axios"
export default function Navbar() {
  const dispatch = useDispatch()
  return (
    <>
    <nav className={`fixed top-0 w-full p-3 bg-[#2a17a4] flex flex-col font-serif text-white xl:h-14  transition-all duration-500 `}>
      <div className="flex flex-row justify-between w-full ">
        <h1 className="ml-4 text-xl sm:mx-4 sm:text-2xl xl:mr-5 sm:ml-0">News Master</h1>
  <div >
  <label className="text-sm sm:mr-9 sm:text-md">
    <input type="checkbox" name="sortOption" onClick={(e:any) => {
      dispatch({type:'SortState/setShow',payload:e.target.checked})
    }} />
    <span className="sm:ml-5">Sort A-Z</span>
  </label>
  <button className="bg-blue-700 sm:w-[150px] h-[30px]  hover:bg-blue-800 mx-5 transition-all duration-500 rounded-sm w-[60px]" onClick={async()=>{
   try{
     await axios.get('http://localhost:8080/logout',{withCredentials:true});
    location.reload()
   }catch(e){
    console.log(e)
   }
  }}>Logout</button>
  </div>
     </div>
     </nav>
    <SideBar></SideBar>
    </>
  )
}
