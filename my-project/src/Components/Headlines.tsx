import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Headlines() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8080/news/?topic=entertainment&subtopic=movies')
      .then(response => {
        setPosts(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
      });
  }, []);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.Description}</li>
      ))}
    </ul>
  );
}