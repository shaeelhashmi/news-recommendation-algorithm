import axios from 'axios';
import { useEffect, useState } from 'react';
import NewsCard from './Card/NewsCard'
import Loader from './Loader/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from './Loader/InfiniteScrollLoader';
export default function Headlines() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [idx, setIdx] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () =>{
      const result = await axios.get('http://localhost:8080/news/');
      setPosts(result.data.News);
      const newData = [];
      for (let i = idx; i < idx + 24 && i < result.data.News.length; i++) {
        newData.push(result.data.News[i]);
      }
      setData(newData);
      setIdx(idx + 24);
      setLoader(false);
      setHasMore(idx<result.data.News.length);
    };
    fetchData();
  }, []);
  const fetchMore = () => {
      const newData = [...data];
      for (let i = idx; i < idx + 24 && i < posts.length; i++) {
        newData.push(posts[i]);
      }
      setData(newData);
      setIdx(idx + 24);
      setHasMore(idx<posts.length);
    };
  return (
    loader ? <Loader></Loader> :  
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
  );
}