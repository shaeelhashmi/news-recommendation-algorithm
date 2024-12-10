import { useState,useEffect } from "react"
import NewsCard from './Card/NewsCard'
import Loader from './Loader/Loader';
import InfiniteScrollLoader from './Loader/InfiniteScrollLoader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import Navbar from './Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
interface props{
    Sort: any
}
export default function HomePage(props:props) {
  const navigate = useNavigate();
  const selector = useSelector((state: any) => state.SortState.sort);
  const [loader, setLoader] = useState<boolean>(true);
  const [posts, setPosts] = useState<any[]>([]);
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
        await axios.get(("http://localhost:8080/checklogin"),{withCredentials:true});
      }catch(error:any){
        if(error.response.status===401){
          navigate("/auth/login");
      }
    }
  }
    checkLogin();
      try{
      const fetchData = async () => {
        const result= await   axios.get((`http://localhost:8080/fyp`),{withCredentials:true});
        console.log(result.data.fyp)
        setPosts(result.data.fyp);
        const newData = [];
        const sortedPosts = props.Sort([...result.data.fyp]);
        for (let i = idx; i < idx + 4 && i < result.data.fyp.length; i++) {
          newData.push(result.data.fyp[i]);
        }
        setData(newData);
        setSortData(sortedPosts);
        setIdx(idx + 4);
        setLoader(false);
      };
     fetchData();
    }catch(e){
      console.log(e)
    }
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
    <div >
    <InfiniteScroll
       dataLength={data.length}
       next={fetchMore}
       hasMore={hasMore}
       loader={<InfiniteScrollLoader></InfiniteScrollLoader>}
       className="grid lg:w-[80vw] w-screen grid-cols-1   lg:grid-cols-2 justify-items-center justify-center lg:ml-48 ml-0 " 
       >
       {data.map((post,index) => (
        <div key={index}>
        <NewsCard image={post.Img} link={post.Links} description={post.Description} type={post.category}/>
        </div>
       ))}
       </InfiniteScroll>
   </div>
   </>
  )
}
