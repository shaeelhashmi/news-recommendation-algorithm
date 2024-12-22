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
    type:String
    Source:string
}

export default function NewsCard(props:props) {
  const decreaseDescription = (description: String) => {
    if (description.length > 130) {
      return description.slice(0, 130) + "...";
    }
    return description;
  };
  return (
    <div className="w-[250px]  h-[450px] bg-white border-2 border-solid shadow-lg m-8 mt-20 ">
        <div className="w-full h-[50%] m-0">
            {props.image.IsVideo ? (
          <video src={props.image.Src === '' ? images : props.image.Src} className="object-cover w-full h-full" controls />
            ) : (
          <img src={props.image.Src === '' ? images : props.image.Src} alt={" "} className="object-cover w-full h-full" />
            )}
        </div>
        <div className="w-full h-[80px]  text-sm font-thin p-2">{decreaseDescription(props.description)}</div>
        <p className="mx-2 my-2 mt-3 font-sans font-light">Source: {props.Source}</p>
        <div className="flex items-center justify-end w-full">
            <a className="w-[150px] h-[40px] bg-blue-600 m-3  hover:bg-blue-500 duration-500 transition-all cursor-pointer flex items-center justify-center text-white rounded-sm mt-9" href={props.link} target="_blank"
            onClick={()=>{
                axios.post("http://localhost:8080/interest",{
                 
                    PostType: props.type
                },{withCredentials:true})
            }}>View details</a>
        </div>

    </div>
  )
}
