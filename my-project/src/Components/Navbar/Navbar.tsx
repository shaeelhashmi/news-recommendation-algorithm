import SideBar from "./SideBar"
import {useDispatch} from 'react-redux'
import axios from "axios"
export default function Navbar() {
  const dispatch = useDispatch()
  return (
    <>
    <nav className={`fixed top-0 w-full p-3 bg-[#20194a] flex flex-col font-serif text-white xl:h-14 `}>
    <div className="flex flex-row justify-between w-full ">
      <div>
    <h1 className="ml-4 text-xl sm:mx-4 sm:text-2xl xl:mr-5 sm:ml-0">News Master</h1>
    </div>
  <div  className="flex flex-row items-center">
 {!(window.location.pathname === '/setting') &&   
  <><input type="checkbox" name="sortOption" onClick={(e:any) => {
      dispatch({type:'SortState/setShow',payload:e.target.checked})
    }} />
    <span className="sm:ml-5">Sort A-Z</span>
    </>}
  <button className="bg-blue-900 sm:w-[120px] h-[30px]  hover:bg-blue-800 mx-5 transition-all duration-500 rounded-sm w-[60px]" onClick={async()=>{
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
