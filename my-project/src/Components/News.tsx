import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
export default function News() {
  const [posts, setPosts] = useState<any[]>([]);
  const { topic, subtopic } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8080/news/?topic=${topic}&?subtopic=${subtopic}`)
      .then(response => {
        setPosts(response.data);
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
      {posts.map((post,index) => (
        <li key={index}>{post.Description}</li>
      ))}
    </ul>
  );
}
