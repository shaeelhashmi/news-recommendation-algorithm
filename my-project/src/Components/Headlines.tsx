import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Headlines() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8080/news/')
      .then(response => {
        setPosts(response.data.News);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
      });
  }, []);

  return (
    <ul>
      {posts.map((post,index) => (
        <li key={index}>{post.Description}</li>
      ))}
    </ul>
  );
}