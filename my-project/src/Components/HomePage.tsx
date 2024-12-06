import {useState, useEffect} from 'react';
import axios from 'axios';
interface props{
    Sort: any
}
export default function HomePage(props:props) {
    const [posts, setPosts] = useState<any[]>([]);
    const [idx, setIdx] = useState<number>(0);
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`http://localhost:8080/fyp`,{withCredentials: true});
            console.log(result.data.fyp)
            setPosts(result.data.fyp);
        };
        fetchData();
    }, []);
  return (
    <div>
      
    </div>
  )
}
