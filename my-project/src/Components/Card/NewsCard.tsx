import images from "../../Assets/Images/images.jpg"
interface img{
    Src:string;
    IsVideo:boolean;
}
interface props{
    image:img;
    description:String;
    link:string
}
export default function NewsCard(props:props) {
  return (
    <div className="w-[300px]  h-[350px] bg-[#E0E0E0] m-8 mt-20 ">
        <div className="w-full h-[50%] m-0">
            {props.image.IsVideo ? (
          <video src={props.image.Src === '' ? images : props.image.Src} className="object-cover w-full h-full" controls />
            ) : (
          <img src={props.image.Src === '' ? images : props.image.Src} alt={" "} className="object-cover w-full h-full" />
            )}
        </div>
        <div className="w-full h-[80px]  text-sm font-thin p-2">{props.description}</div>
        <div className="flex items-center justify-end w-full">
            <a className="w-[150px] h-[40px] bg-blue-600 m-3  hover:bg-blue-500 duration-500 transition-all cursor-pointer flex items-center justify-center text-white" href={props.link} target="_blank">View details</a>
        </div>
    </div>
  )
}
