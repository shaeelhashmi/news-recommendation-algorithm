import axios from 'axios';
import { useEffect, useState } from 'react';
import NewsCard from './Card/NewsCard'
export default function Headlines() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () =>{
      const result = await axios.get('http://localhost:8080/news/');
      setPosts(result.data.News);
    };
    fetchData();
  }, []);

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