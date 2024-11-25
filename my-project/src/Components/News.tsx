import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from './Card/NewsCard'
import Loader from './Loader/Loader';
import InfiniteScrollLoader from './Loader/InfiniteScrollLoader';
import InfiniteScroll from 'react-infinite-scroll-component';
export default function News() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const { topic, subtopic } = useParams();
  const [idx, setIdx] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const result= await   axios.get(`http://localhost:8080/news/?topic=${topic}&subtopic=${subtopic}`);
      setPosts(result.data.News);
      const newData = [];
      for (let i = idx; i < idx + 6 && i < result.data.News.length; i++) {
        newData.push(result.data.News[i]);
      }
      setData(newData);
      setIdx(idx + 6);
      setLoader(false);
      setHasMore(idx<result.data.News.length);
      setLoader(false);
    };
   fetchData();
      
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

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  return (
    loader?<Loader></Loader>:
    <div  >
   <InfiniteScroll
      dataLength={data.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<InfiniteScrollLoader></InfiniteScrollLoader>}
      className="grid w-[80vw] grid-cols-1   lg:grid-cols-2 justify-items-center justify-center ml-48" 
      >
      {data.map((post,index) => (
       <div key={index}>
       <NewsCard image={post.Img} link={post.Links} description={post.Description}/>
       </div>
      ))}
      </InfiniteScroll>
  </div>
  );
}
