import { useState } from "react"
import MenuBtn from "../SVG/MenuBtn"
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="fixed top-0 w-full p-3 bg-[#2a17a4] flex lg:flex-row flex-col font-serif text-white overflow-auto">
      <div className="flex flex-row justify-between w-full lg:w-fit"><h1 className="mx-4 text-2xl lg:mr-5">News Master</h1>
      <div className="justify-end lg:hidden " onClick={()=>{
        setIsOpen(!isOpen)
      }}><MenuBtn ></MenuBtn></div></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block ${isOpen?"hidden":"block"}`}><a href="/">Headlines</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block ${isOpen?"hidden":"block"}`}><a href="/world">World</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block ${isOpen?"hidden":"block"}`}><a href="/politics">Politics</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block ${isOpen?"hidden":"block"}`}><a href="/business">Business</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block ${isOpen?"hidden":"block"}`}><a href="/health">Health</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block ${isOpen?"hidden":"block"}`}><a href="/entertainment">Entertainment</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block ${isOpen?"hidden":"block"}`}><a href="/style">Style</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block ${isOpen?"hidden":"block"}`}><a href="/travel">Travel</a></div>
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block ${isOpen?"hidden":"block"}`}><a href="/sports">Sports</a></div>   
    </div>
  )
}
