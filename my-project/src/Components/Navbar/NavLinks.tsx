
interface NavLinksProps {
    link?:string,
    text:string
}
export default function NavLinks(props:NavLinksProps) {
    const formatLink = (link: string): string => {
      return link.replace('https://edition.cnn.com', '');
    }
  return (
    <>
      <div className="flex justify-between w-full transition-all duration-500">
      <div className={`my-4 font-serif `}>{props.link?<a href={formatLink(props.link)}>{props.text}</a>:<span>{props.text}</span>}</div>
  
      </div>

    </>
  )
}
