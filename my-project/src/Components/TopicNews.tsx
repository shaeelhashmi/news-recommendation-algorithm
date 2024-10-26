import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from 'axios';

export default function TopicNews() {
    const  {topic}=useParams()
    const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    console.log(`http://localhost:8080/news/?topic=${topic}`)
    axios.get(`http://localhost:8080/news/?topic=${topic}`)
      .then(response => {
        setPosts(response.data);
        console.log(response.data.News)
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
  )
}
