import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from './Card/NewsCard'
export default function News() {
  const [posts, setPosts] = useState<any[]>([]);
  const { topic, subtopic } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const result= await   axios.get(`http://localhost:8080/news/?topic=${topic}&?subtopic=${subtopic}`);
      setPosts(result.data.News);
    };
   fetchData();
      
  }, []);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  return (
    <div className="grid grid-cols-3">
    {posts.map((post,index) => (
     <div key={index}>
     <NewsCard image={post.Img.Src} link={post.Links	} description={post.Description	}/>
     </div>
    ))}
  </div>
  );
}
