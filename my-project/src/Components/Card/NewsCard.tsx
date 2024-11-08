import images from "../../Assets/Images/images.jpg"
interface props{
    image:string;
    description:String;
    link:string
}
export default function NewsCard(props:props) {
  return (
    <div className="w-[300px]  h-[350px] bg-[#E0E0E0] m-8 mt-20 ">
        <div className="w-full h-[50%] m-0"><img src={props.image==''?images:props.image} alt="Error loading image" className="object-cover w-full h-full" /></div>
        <div className="w-full h-[80px]  text-sm font-thin p-2">{props.description}</div>
        <div className="flex items-center justify-end w-full">
            <a className="w-[200px] h-[40px] bg-blue-500 m-3 rounded-lg hover:bg-blue-400 duration-500 transition-all cursor-pointer flex items-center justify-center" href={props.link} target="_blank">View details</a>
        </div>
    </div>
  )
}
