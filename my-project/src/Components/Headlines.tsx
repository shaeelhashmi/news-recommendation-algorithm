import axios from 'axios';
import { useEffect, useState } from 'react';

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
    <ul>
      {posts.map((post,index) => (
        <li key={index}>{post.Description}</li>
      ))}
    </ul>
  );
}