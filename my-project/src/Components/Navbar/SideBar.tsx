import NavLinks from "./NavLinks"
import MenuBtn from "../SVG/MenuBtn"
import { useState } from "react"
import { useEffect } from "react"
export default function SideBar() {
  const [show, setShow] = useState(false)
  const [links, setLinks] = useState<any[]>([])
 
  useEffect(() => {
    let data=
      [
        {
          "URL": "/",
          "Text": "Home",
        },
        {
          "URL": "/world",
          "Text": "World",
        },
        {
          "URL": "/entertainment",
          "Text": "Entertainment",
        },
        {
          "URL": "/business",
          "Text": "Business",
        },
        {
          "URL": "/sports",
          "Text": "Sports",
        },
        {
          "URL":"/health",
          "Text":"Health"
        },
        {
          "URL":"/science",
          "Text":"Science"
        },
        {
          "URL":"/setting",
          "Text":"Settings"
        }
        
      ]
    
    setLinks(data)

  },[])
 
  return (
    <>
    <div className="sticky flex flex-row justify-between pl-8 text-white lg:hidden sm:top-14 top-10  bg-[#20194a] xl:bg-[#322586] h-16 w-full">
           <div></div>
           <button className="mr-[2rem]" onClick={()=>{
            setShow(!show)
           }}><MenuBtn></MenuBtn></button>
      </div>
    <aside className={`fixed sm:top-28 top-24 lg:top-14 left-0 lg:w-[180px] lg:h-screen bg-[#090622]  flex flex-col text-white overflow-auto pl-4  w-full ${show?'h-72':'h-0'} duration-500 transition-all overflow-x-hidden`}   
    >  
      <div>
      {links.map((link, index) => {
        return <NavLinks key={index} link={link.URL} text={link.Text}  ></NavLinks>
      })}
      </div>
    </aside>
    </>
  )
}
