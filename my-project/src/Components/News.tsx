import axios from 'axios';
import { useEffect, useState } from 'react';



export default function News() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8080/news/?topic=entertainment/?subtopic=movies')
      .then(response => {
        setPosts(response.data);
        console.log(posts)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.Description}</li>
      ))}
    </ul>
  );
}
