import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from 'axios';
import NewsCard from './Card/NewsCard'
export default function TopicNews() {
    const  {topic}=useParams()
    const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    try{
    const fetchData = async () => {
      const result= await   axios.get(`http://localhost:8080/news/?topic=${topic}`);
      setPosts(result.data.News);
    };
   fetchData();
  }catch(e){
    console.log(e)
  }
  }, []);

  return (
    <div className="grid grid-cols-3">
      {posts.map((post,index) => (
        <div key={index}>
        <NewsCard image={post.Img.Src} link={post.Links	} description={post.Description	}/>
        </div>
      ))}
    </div>
  )
}
