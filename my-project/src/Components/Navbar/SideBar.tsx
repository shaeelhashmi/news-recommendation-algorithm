import NavLinks from "./NavLinks"
import MenuBtn from "../SVG/MenuBtn"
import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
export default function SideBar() {
  const [show, setShow] = useState(false)
  const [links, setLinks] = useState<any[]>([])
 
  useEffect(() => {
    const fetchData = async () => { 
      try {
        const response = await axios.get('http://localhost:8080/links')
        setLinks(response.data.Links)
         
    } catch (error) {
        console.error(error)
    }
  }
  fetchData()
  console.log(links)

  },[])
 
  return (
    <>
    <div className="sticky flex flex-row justify-between pl-8 text-white xl:hidden sm:top-14 top-10 bg-[#2a17a4] h-11 w-full">
           <div>More</div><button className="mr-[3.8rem]" onClick={()=>{
            setShow(!show)
           }}><MenuBtn></MenuBtn></button>
      </div>
    <aside className={`fixed xl:top-14 sm:top-24 top-20 left-0 xl:w-[250px] xl:h-screen bg-[#2a17a4]  flex flex-col text-white overflow-auto pl-8 sidebar w-full ${show?'h-72':'h-0'} duration-500 transition-all overflow-x-hidden`}>  
      <div>
      {links.map((link, index) => {
        console.log(link.SubLinks)
        return <NavLinks key={index} link={link.Links.URL} text={link.Links.Text} subLinks={link.SubLinks} ></NavLinks>
      })}
      </div>
    </aside>
    </>
  )
}
