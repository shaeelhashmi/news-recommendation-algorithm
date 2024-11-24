import { useState } from "react"
import MenuBtn from "../SVG/MenuBtn"
interface NavLinksProps {
    link:string,
    text:string
    subLinks?:string[]
    subText?:string[]
}
export default function NavLinks(props:NavLinksProps) {
    const [isOpen, setIsOpen] = useState(true)
  return (
    <>
      <div className="flex justify-between w-full">
      <div className={`my-4 font-serif mx-4 lg:my-0 lg:block `}><a href={props.link}>{props.text}</a></div>
    
      {props.subLinks &&<div className="justify-end cursor-pointer"
      onClick={()=>{
        setIsOpen(!isOpen)
      }}><MenuBtn></MenuBtn></div>
    }
      </div>
    {  props.subLinks &&<div className={` bg-[#2a17a4] w-full ${isOpen?'scale-y-100 h-52':'scale-y-0 h-2'}  transition-all duration-500 origin-top lg:h-fit `}>
        {
            props.subLinks?.map((link, index)=>{ 
                return (
                    <div className="my-4 lg:my-0" onMouseEnter={(e: React.MouseEvent<HTMLDivElement>)=>{
                        const secondChild = e.currentTarget.children[1];
                        secondChild.classList.add('opacity-75')
                      }}
                      onMouseLeave={(e:React.MouseEvent<HTMLDivElement>)=>{
                        const secondChild = e.currentTarget.children[1];
                        secondChild.classList.remove('opacity-75')
                      }}
                      key={index}>
                        <div className="z-50 w-full mx-4 text-center lg:mx-0"><a href={link}>{props.subText ? props.subText[index] : ''}</a></div>
                        <div className="w-full h-1 transition-all duration-500 bg-white opacity-15"></div>
                       </div>
                )
            })
        }
      </div>
}
    </>
  )
}
