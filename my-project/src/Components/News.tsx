import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from './Card/NewsCard'
import Loader from './Loader/Loader';
import InfiniteScrollLoader from './Loader/InfiniteScrollLoader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import Navbar from './Navbar/Navbar';
export default function News(props:any) {
  const selector = useSelector((state: any) => state.SortState.sort);
  const [posts, setPosts] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const { topic, subtopic } = useParams();
  const [idx, setIdx] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortData, setSortData] = useState<any[]>([]);
  useEffect(() => {
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(!selector){
      const newData = [];
      for (let i = 0; i < idx && i < posts.length; i++) {
        newData.push(posts[i]);
      }
      setData(newData);
      return;
    } 
    const newData = [];
    for (let i = 0; i < idx && i < posts.length; i++) {
      newData.push(sortData[i]);
    }
    setData(newData); 
  }, [selector]);
  useEffect(() => {
    const fetchData = async () => {
      const result= await   axios.get(`http://localhost:8080/news/?topic=${topic}&subtopic=${subtopic}`);
      setPosts(result.data.News);
      const newData = [];
      const sortedPosts = props.Sort([...result.data.News]);
      for (let i = idx; i < idx + 4 && i < result.data.News.length; i++) {
        newData.push(result.data.News[i]);
      }
      setData(newData);
      setIdx(idx + 4);
      setLoader(false);
      setHasMore(idx<result.data.News.length);
      setLoader(false);
      setSortData(sortedPosts);
    };
   fetchData();
      
  }, []);
  const fetchMore = () => {
    const newData = [...data];
    for (let i = idx; i < idx + 4 && i < posts.length; i++) {
      newData.push(posts[i]);
    }
    setData(newData);
    setIdx(idx + 4);
    setHasMore(idx<posts.length);
  };

  return (
    loader?<Loader></Loader>:
    <>
    <Navbar></Navbar>
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
  </>
  );
}
