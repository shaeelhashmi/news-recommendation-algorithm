import { useState } from "react"
import MenuBtn from "../SVG/MenuBtn"
import NavLinks from "./NavLinks"
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className={`fixed top-0 w-full p-3 bg-[#2a17a4] flex xl:flex-row flex-col font-serif text-white xl:h-14 xl:scale-100 ${isOpen?'h-14':'h-[500px] overflow-auto'} transition-all duration-500 xl:overflow-visible`}>
      <div className="flex flex-row justify-between w-full xl:w-fit"><h1 className="mx-4 text-2xl xl:mr-5">News Master</h1>
      <div className="justify-end cursor-pointer xl:hidden" onClick={()=>{
        setIsOpen(!isOpen)
      }}><MenuBtn ></MenuBtn></div></div>
      <div className={`flex flex-col xl:flex-row ${isOpen?"scale-0":"scale-y-100"} origin-top transition-all duration-500 xl:scale-100`}>
      <div>
      <NavLinks link='/' text='Headlines'></NavLinks>
      </div>
      <div>
      <NavLinks link='/world' text='World' subLinks={['/world/africa','/world/americas','/world/asia','/world/australia','/world/china','/world/europe','/world/india','/world/middle-east','/world/united-kingdom']} subText={['Africa','Americas','Asia','Australia','China','Europe','India','Middle East','United Kingdom']}></NavLinks>
      </div>
      
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 xl:my-0 xl:block `}><a href="/politics">Politics</a></div>
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
    
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 xl:my-0 xl:block `}><a href="/business">Business</a></div>
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
  
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 xl:my-0 xl:block `}><a href="/health">Health</a></div>
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
    
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 xl:my-0 xl:block `}><a href="/entertainment">Entertainment</a></div>
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
     
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 xl:my-0 xl:block `}><a href="/style">Style</a></div>
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
     
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 xl:my-0 xl:block `}><a href="/travel">Travel</a></div>
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
   
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 xl:my-0 xl:block `}><a href="/sports">Sports</a></div> 
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
  
      </div>
    </div>
  )
}
