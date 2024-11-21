import { useState } from "react"
import MenuBtn from "../SVG/MenuBtn"
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className={`fixed top-0 w-full p-3 bg-[#2a17a4] flex lg:flex-row flex-col font-serif text-white lg:h-fit lg:scale-100 ${isOpen?'h-14':'h-[500px] overflow-auto'} transition-all duration-500`}>
      <div className="flex flex-row justify-between w-full lg:w-fit"><h1 className="mx-4 text-2xl lg:mr-5">News Master</h1>
      <div className="justify-end cursor-pointer lg:hidden" onClick={()=>{
        setIsOpen(!isOpen)
      }}><MenuBtn ></MenuBtn></div></div>
      <div className={`flex flex-col lg:flex-row ${isOpen?"scale-0":"scale-y-100"} origin-top transition-all duration-500 lg:scale-100`}>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/">Headlines</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/world">World</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/politics">Politics</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/business">Business</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/health">Health</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/entertainment">Entertainment</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/style">Style</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/travel">Travel</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href="/sports">Sports</a></div> 
      </div>
    </div>
  )
}
