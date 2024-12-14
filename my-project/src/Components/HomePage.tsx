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
       <div className="flex items-center justify-center mt-28">    
          <form onSubmit={(e:any)=>{e.preventDefault()
          setSearch(e.target.search.value)
             if (search === '') {
              setData(posts);
              return;
            }
            const fuse = new Fuse(posts, {
              keys: ['Description'],
              threshold: 0.3,
            });
            const data = fuse.search(search).map(({ item }) => item);
            setData(data);
          }} className="flex items-center justify-center">
            <button className="p-2 text-white bg-green-700 " ><Search></Search></button>
          <input
          type="text"
          placeholder="Search"
          className="w-[200px] h-10 border-2 border-green-700 p-2"
          name='search'
        onBlur={(e:any) =>{ 
          setSearch('')
          e.target.value=''
          const source = selector ? sortData : posts;
          const newData = [];
          for (let i = 0; i < idx && i < source.length; i++) {
            newData.push(source[i]);
          }
          setData(newData);
        }}
    />
    </form>

      
          </div>
    <div >
    {
    search!==''?
    (
    data.length===0?
    <div className='col-span-2 mx-auto mt-32 text-4xl font-bold w-96'>No results found</div>
    :<div className="grid justify-center lg:w-[80vw] w-screen grid-cols-1 ml-0 lg:grid-cols-2 justify-items-center lg:ml-48 " >
    {data.map((post,index) => (
      <div key={index}>
      <NewsCard image={post.Img} link={post.Links} description={post.Description} type={post.category} Source={props.getSource(post.Links)}/>
      </div>
    ))}
    </div>
    )
    :<InfiniteScroll
       dataLength={data.length}
       next={fetchMore}
       hasMore={hasMore}
       loader={<InfiniteScrollLoader></InfiniteScrollLoader>}
       className="grid justify-center lg:w-[80vw] w-screen grid-cols-1 ml-0 lg:grid-cols-2 justify-items-center lg:ml-48 " 
       >
       {data.map((post,index) => (
        <div key={index}>
        <NewsCard image={post.Img} link={post.Links} description={post.Description} type={post.category} Source={props.getSource(post.Links)}/>
        </div>
       ))}
       </InfiniteScroll>
}
   </div>
   </>
  )
}
