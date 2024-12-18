import  { useState } from 'react'
interface NavLinksProps {
    link?:string,
    text:string
}

export default function NavLinks(props:NavLinksProps) {
  const [hover, setHover] = useState(false);
    const formatLink = (link: string): string => {
      return link.replace('https://edition.cnn.com', '');
    }
  return (
    <>
      <div className="flex flex-col justify-between  pr-3 w-[150px] my-4 transition-all duration-500 " onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>  
      <div className={`font-serif w-full ml-2 `}>
        {props.link?<a href={formatLink(props.link)}>{props.text}</a>:<span>{props.text}</span>}
        </div>
     <div className={`w-full h-1 bg-white opacity-15 ${hover?'scale-100':'scale-0'} duration-500 transition-all my-3`}></div>
      </div>

    </>
  )
}
