import NavLinks from "./NavLinks"
import MenuBtn from "../SVG/MenuBtn"
import { useState } from "react"
export default function SideBar() {
  const [show, setShow] = useState(false)
  return (
    <>
    <div className="sticky flex flex-row justify-between pl-8 text-white xl:hidden top-14 bg-[#2a17a4] h-11 w-full">
           <div>More</div><button className="mr-[3.8rem]" onClick={()=>{
            setShow(!show)
           }}><MenuBtn></MenuBtn></button>
      </div>
    <aside className={`fixed xl:top-14 top-24 left-0 xl:w-[250px] xl:h-screen bg-[#2a17a4]  flex flex-col text-white overflow-auto pl-8 sidebar w-full ${show?'h-72':'h-0'} duration-500 transition-all overflow-x-hidden`}>  
      <div>
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
      <NavLinks link='/health' text='Health' ></NavLinks>
      </div>
      <div>
      <NavLinks link='/world' text='World' subLinks={['/world/africa','/world/americas','/world/asia','/world/australia','/world/china','/world/europe','/world/india','/world/middle-east','/world/united-kingdom']} subText={['Africa','Americas','Asia','Australia','China','Europe','India','Middle East','United Kingdom']}></NavLinks>
      </div>
      <div>
    <div>
      <NavLinks text='Entertainment' link='/entertainment'></NavLinks>
    </div>
    <div>
      <NavLinks text='Style' link='/style'></NavLinks>
    </div>
    <div>
      <NavLinks text='Travel' link='/travel'></NavLinks>
    </div>
    <div>
      <NavLinks text='Sports' link='/sports'></NavLinks>
    </div>
    <div>
      <NavLinks text='Weather' link='/weather'></NavLinks>
    </div>
    <div>
      <NavLinks text='Science' link='/science'></NavLinks>
    </div>
      </div>
      </div>
    </aside>
    </>
  )
}
