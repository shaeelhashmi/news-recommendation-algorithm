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
      <NavLinks link='/politics' text='Politics'></NavLinks>
      </div>
      <div>
      <NavLinks link='/business' text='Business'></NavLinks>
      </div>
      <div>
      <NavLinks link='/health' text='Health'></NavLinks>
      </div>
      <div>
      <NavLinks link='/world' text='World' subLinks={['/world/africa','/world/americas','/world/asia','/world/australia','/world/china','/world/europe','/world/india','/world/middle-east','/world/united-kingdom']} subText={['Africa','Americas','Asia','Australia','China','Europe','India','Middle East','United Kingdom']}></NavLinks>
      </div>
      <div>
        <NavLinks text='More' subLinks={['/entertainment','/style','/travel','/sports']} subText={['Entertainment','Style','Travel','Sports']}></NavLinks>
      </div>
      </div>
    </div>
  )
}
