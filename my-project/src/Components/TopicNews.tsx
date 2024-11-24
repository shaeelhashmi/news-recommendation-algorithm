import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from 'axios';
import NewsCard from './Card/NewsCard'
import Loader from './Loader/Loader';
import InfiniteScrollLoader from './Loader/InfiniteScrollLoader';
import InfiniteScroll from 'react-infinite-scroll-component';
export default function TopicNews() {
   const [loader, setLoader] = useState<boolean>(true);
    const  {topic}=useParams()
    const [posts, setPosts] = useState<any[]>([]);
 const [idx, setIdx] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  useEffect(() => {
    try{
    const fetchData = async () => {
      const result= await   axios.get(`http://localhost:8080/news/?topic=${topic}`);
      setPosts(result.data.News);
      const newData = [];
      for (let i = idx; i < idx + 6 && i < result.data.News.length; i++) {
        newData.push(result.data.News[i]);
      }
      setData(newData);
      setIdx(idx + 6);
      setLoader(false);
    };
   fetchData();
  }catch(e){
    console.log(e)
  }
  }, []);
  const fetchMore = () => {
    const newData = [...data];
    for (let i = idx; i < idx + 6 && i < posts.length; i++) {
      newData.push(posts[i]);
    }
    setData(newData);
    setIdx(idx + 6);
    setHasMore(idx<posts.length);
  };

  return (
    loader?<Loader></Loader>:
    <div >
    <InfiniteScroll
       dataLength={data.length}
       next={fetchMore}
       hasMore={hasMore}
       loader={<InfiniteScrollLoader></InfiniteScrollLoader>}
       className="grid grid-cols-1 lg:grid-cols-3 justify-items-center md:grid-cols-2"
       >
       {data.map((post,index) => (
        <div key={index}>
        <NewsCard image={post.Img.Src} link={post.Links} description={post.Description}/>
        </div>
       ))}
       </InfiniteScroll>
   </div>
  )
}
