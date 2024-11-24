import { useState } from "react"
import MenuBtn from "../SVG/MenuBtn"
import NavLinks from "./NavLinks"
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className={`fixed top-0 w-full p-3 bg-[#2a17a4] flex lg:flex-row flex-col font-serif text-white lg:h-14 lg:scale-100 ${isOpen?'h-14':'h-[500px] overflow-auto'} transition-all duration-500 lg:overflow-visible`}>
      <div className="flex flex-row justify-between w-full lg:w-fit"><h1 className="mx-4 text-2xl lg:mr-5">News Master</h1>
      <div className="justify-end cursor-pointer lg:hidden" onClick={()=>{
        setIsOpen(!isOpen)
      }}><MenuBtn ></MenuBtn></div></div>
      <div className={`flex flex-col lg:flex-row ${isOpen?"scale-0":"scale-y-100"} origin-top transition-all duration-500 lg:scale-100`}>
      <div>
      <NavLinks link='/' text='Headlines'></NavLinks>
      </div>
      <div>
      <NavLinks link='/world' text='World' subLinks={['/world/africa','/world/africa','/world/africa']} subText={['Africa','Africa','Africa']}></NavLinks>
      </div>
      
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/politics">Politics</a></div>
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
    
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/business">Business</a></div>
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
  
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/health">Health</a></div>
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
    
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/entertainment">Entertainment</a></div>
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
     
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/style">Style</a></div>
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
     
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/travel">Travel</a></div>
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
   
      <div className="flex justify-between w-full ">
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/sports">Sports</a></div> 
      <div className="justify-end cursor-pointer"><MenuBtn></MenuBtn></div>
      </div>
  
      </div>
    </div>
  )
}
