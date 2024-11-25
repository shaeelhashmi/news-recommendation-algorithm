import { useEffect, useState } from "react"
import MenuBtn from "../SVG/MenuBtn"
interface NavLinksProps {
    link?:string,
    text:string
    subLinks?:string[]
    subText?:string[]
}
export default function NavLinks(props:NavLinksProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [height, setHeight] = useState(0)
    useEffect(() => {
      let counter=1;
      if(props.subLinks)
      {
      for (let i = 0; i < props.subLinks?.length; i++) {
        counter++;
      }
    }
    setHeight(40*counter)
    },[])
  return (
    <>
      <div className="flex justify-between w-full transition-all duration-500">
      <div className={`my-4 font-serif `}>{props.link?<a href={props.link}>{props.text}</a>:<span>{props.text}</span>}</div>
    
      {props.subLinks &&<div className="relative justify-end cursor-pointer top-4 mr-9"
      onClick={()=>{
        setIsOpen(!isOpen)
      }}><MenuBtn></MenuBtn></div>
    }
      </div>
    {  props.subLinks &&<div className={` bg-[#2a17a4]  w-full ${isOpen?`scale-y-100 `:'scale-y-0 '}  transition-all duration-500 origin-top pr-2`} style={{ height: isOpen ? `${height}px` : '0px' }}>
        {
            props.subLinks?.map((link, index)=>{ 
                return (
                    <div className="mb-4" onMouseEnter={(e: React.MouseEvent<HTMLDivElement>)=>{
                        const secondChild = e.currentTarget.children[1];
                        secondChild.classList.add('opacity-75')
                      }}
                      onMouseLeave={(e:React.MouseEvent<HTMLDivElement>)=>{
                        const secondChild = e.currentTarget.children[1];
                        secondChild.classList.remove('opacity-75')
                      }}
                      key={index}>
                        <div className="z-50 w-full mx-3"><a href={link}>{props.subText ? props.subText[index] : ''}</a></div>
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
