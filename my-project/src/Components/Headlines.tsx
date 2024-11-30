import axios from 'axios';
import { useEffect, useState } from 'react';
import NewsCard from './Card/NewsCard'
import Loader from './Loader/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from './Loader/InfiniteScrollLoader';
import { useSelector } from 'react-redux';
import Navbar from './Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
export default function Headlines(props:any) {
  const navigate = useNavigate();
  const selector = useSelector((state: any) => state.SortState.sort);
  const [posts, setPosts] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
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
    const checkLogin=async()=>{
      try{
        console.log(await axios.get(("http://localhost:8080/checklogin"),{withCredentials:true}));  
      }catch(error:any){
        if(error.response.status===401){
          navigate("/auth/login");
      }
    }
  }
    checkLogin();
    
    const fetchData = async () =>{
      const result = await axios.get('http://localhost:8080/news/');
      setPosts(result.data.News);
      const newData = [];
      const sortedPosts = props.Sort([...result.data.News]);
      setSortData(sortedPosts);
      for (let i = idx; i < idx + 4 && i < result.data.News.length; i++) {
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
      for (let i = idx; i < idx + 4 && i < posts.length; i++) {
        newData.push(posts[i]);
      }
      setData(newData);
      setIdx(idx + 4);
      setHasMore(idx<posts.length);
    };

  return (
    loader ? <Loader></Loader> : 
    <><Navbar></Navbar>
    <div >
      <InfiniteScroll
      dataLength={data.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<InfiniteScrollLoader></InfiniteScrollLoader>}
      className="grid xl:w-[80vw] grid-cols-1   md:grid-cols-2 justify-items-center justify-center xl:ml-48" 
      >
      {data.map((post,index) => (
       <div key={index}>
       <NewsCard image={post.Img} link={"/news/"+post.Links} description={post.Description}/>
       </div>
      ))}
      </InfiniteScroll>
    </div>
    </> 
  );
}