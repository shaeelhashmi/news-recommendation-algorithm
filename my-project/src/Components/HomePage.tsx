import { useState,useEffect } from "react"
import NewsCard from './Card/NewsCard'
import Loader from './Loader/Loader';
import InfiniteScrollLoader from './Loader/InfiniteScrollLoader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import Search from "./SVG/Search";
import axios from 'axios';
interface props{
    Sort: any
    getSource: any
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
  const [search, setSearch] = useState<string>('');
  const [thirdData, setThirdData] = useState<any[]>([]);
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
        navigate('/auth/login')
    }
  }
    checkLogin();
      try{
      const fetchData = async () => {
        const result= await   axios.get((`http://localhost:8080/fyp`),{withCredentials:true});
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
      if(search!==''){
        const newData = [...data];
        const source =  thirdData;
        for (let i = idx; i < idx + 4 && i < source.length; i++) {
          newData.push(source[i]);
        }
        setData(newData);
        setIdx(idx + 4);
        setHasMore(idx<thirdData.length);
        return
      }
      const newData = [...data];
      const source=selector?sortData:posts;
      for (let i = idx; i < idx + 4 && i < source.length; i++) {
        newData.push(source[i]);
      }
      setData(newData);
      setIdx(idx + 4);
      setHasMore(idx<posts.length);

    };
  
  return (
    loader?<Loader></Loader>:
    <>
       <div className="flex items-center justify-center mt-28 lg:ml-[180px] ml-0">    
         
            <span className="p-2 text-white bg-green-700 " ><Search></Search></span>
          <input
          type="text"
          placeholder="Search"
          className="w-[200px] h-10 border-2 border-green-700 p-2"
          name='search'
          onChange={(e:any) => {
            if (search === '' && e.target.value.trim() === '') {
              return;
            }
            setSearch(e.target.value);
            if (e.target.value === '') {

              setIdx(4);
              setHasMore(idx<posts.length);
              const newData = [];
              for (let i = 0; i < 4 && i < posts.length; i++) {
                newData.push(posts[i]);
              }
              setData(newData);
              return;
            }
            const fuse = new Fuse(posts, {
              keys: ['Description'],
              threshold: 0.3,
            });
            const data = fuse.search(e.target.value).map(({ item }) => item);
            setThirdData(data);
            const newData = [];
            for (let i = 0; i < idx && i < data.length; i++) {
              newData.push(data[i]);
            }
            setData(newData);
            setIdx(4);
            setHasMore(idx<thirdData.length);
          }}
          value={search}
    />      
    </div>
    <div >
    
    <InfiniteScroll
       dataLength={data.length}
       next={fetchMore}
       hasMore={hasMore}
       loader={<InfiniteScrollLoader></InfiniteScrollLoader>}
       className="grid justify-center lg:w-[calc(99vw-180px)] w-screen grid-cols-1 ml-0 lg:grid-cols-3 md:grid-cols-2 justify-items-center lg:ml-[180px] " 
       >
       {data.map((post,index) => (
        <div key={index}>
        <NewsCard image={post.Img} link={post.Links} description={post.Description} type={post.category} Source={props.getSource(post.Links)}/>
        </div>
       ))}
       </InfiniteScroll>

   </div>
   </>
  )
}
