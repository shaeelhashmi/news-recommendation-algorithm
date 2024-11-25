import axios from 'axios';
import { useEffect, useState } from 'react';
import NewsCard from './Card/NewsCard'
import Loader from './Loader/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from './Loader/InfiniteScrollLoader';
import { useSelector } from 'react-redux';
export default function Headlines() {
  const selector = useSelector((state: any) => state.SortState.sort);
  const [posts, setPosts] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [idx, setIdx] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sort, setSort] = useState<boolean>(false);
  const [sortData, setSortData] = useState<any[]>([]);
  const sortDescriptions:any = (arr: any[]) => {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)].Description;
    const left = arr.filter(item => item.Description < pivot);
    const right = arr.filter(item => item.Description > pivot);
    const middle = arr.filter(item => item.Description === pivot);

    return [...sortDescriptions(left), ...middle, ...sortDescriptions(right)];
  };
  useEffect(() => {
    if(!sort){
      const newData = [];
      for (let i = 0; i < idx && i < posts.length; i++) {
        newData.push(posts[i]);
      }
      setData(newData);
      setSort(!sort);
      return;
    } 
    const newData = [];
    for (let i = 0; i < idx && i < posts.length; i++) {
      newData.push(sortData[i]);
    }
    setSort(!sort);
    setData(newData); 
  }, [selector]);
  useEffect(() => {
    
    const fetchData = async () =>{
      const result = await axios.get('http://localhost:8080/news/');
      setPosts(result.data.News);
      const newData = [];
      const sortedPosts = sortDescriptions([...result.data.News]);
      setSortData(sortedPosts);
      for (let i = idx; i < idx + 6 && i < result.data.News.length; i++) {
        newData.push(result.data.News[i]);
      }
      
      setData(newData);
      setIdx(idx + 6);
      setLoader(false);
      setHasMore(idx<result.data.News.length);
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

  return (
    loader ? <Loader></Loader> :  
    <div >
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