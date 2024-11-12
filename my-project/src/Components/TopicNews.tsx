import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from 'axios';
import NewsCard from './Card/NewsCard'
import Loader from './Loader/Loader';
export default function TopicNews() {
   const [loader, setLoader] = useState<boolean>(true);
    const  {topic}=useParams()
    const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    try{
    const fetchData = async () => {
      const result= await   axios.get(`http://localhost:8080/news/?topic=${topic}`);
      setPosts(result.data.News);
      setLoader(false);
    };
   fetchData();
  }catch(e){
    console.log(e)
  }
  }, []);

  return (
    loader?<Loader></Loader>:
    <div className="grid grid-cols-1 lg:grid-cols-3 justify-items-center md:grid-cols-2">
      {posts.map((post,index) => (
        <div key={index}>
        <NewsCard image={post.Img.Src} link={post.Links	} description={post.Description	}/>
        </div>
      ))}
    </div>
  )
}
