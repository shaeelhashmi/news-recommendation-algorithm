import images from "../../Assets/Images/images.jpg"
import axios from "axios";
interface img{
    Src:string;
    IsVideo:boolean;
}
interface props{
    image:img;
    description:String;
    link:string
    type?:string
    Source:string
}
export default function NewsCard(props:props) {
  return (
    <div className="w-[250px]  h-[450px] bg-white border-2 border-solid shadow-lg m-8 mt-20 ">
        <div className="w-full h-[50%] m-0">
            {props.image.IsVideo ? (
          <video src={props.image.Src === '' ? images : props.image.Src} className="object-cover w-full h-full" controls />
            ) : (
          <img src={props.image.Src === '' ? images : props.image.Src} alt={" "} className="object-cover w-full h-full" />
            )}
        </div>
        <div className="w-full h-[80px]  text-sm font-thin p-2">{props.description}</div>
        <p className="mx-2 font-sans font-light">Source: {props.Source}</p>
        <div className="flex items-center justify-end w-full">
            <a className="w-[150px] h-[40px] bg-blue-600 m-3  hover:bg-blue-500 duration-500 transition-all cursor-pointer flex items-center justify-center text-white rounded-sm mt-9" href={props.link} target="_blank"
            onClick={()=>{
              console.log(props.type)
                axios.post("http://localhost:8080/interest",{
                    PostType: props.type
                },{withCredentials:true})
            }}>View details</a>
        </div>

    </div>
  )
}
