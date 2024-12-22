import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import NewsCard from './Card/NewsCard';
import Loader from './Loader/Loader';
import InfiniteScrollLoader from './Loader/InfiniteScrollLoader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import Search from "./SVG/Search";
import NotFound from './404pages';
import Fuse from 'fuse.js';
export default function TopicNews(props: any) {
  const navigate = useNavigate();
  const selector = useSelector((state: any) => state.SortState.sort);
  const [loader, setLoader] = useState<boolean>(true);
  const { topic } = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [idx, setIdx] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortData, setSortData] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [thirdData, setThirdData] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!selector) {
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
    const checkLogin = async () => {
      try {
        await axios.get("http://localhost:8080/checklogin", { withCredentials: true });
      } catch (error: any) {
        navigate('/auth/login');
      }
    };
    checkLogin();

    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:8080/news/?topic=${topic}`);
        setPosts(result.data.News);
        const newData = [];
        const sortedPosts = props.Sort([...result.data.News]);
        for (let i = idx; i < idx + 6 && i < result.data.News.length; i++) {
          newData.push(result.data.News[i]);
        }
        setData(newData);
        setSortData(sortedPosts);
        setIdx(idx + 6);
        setLoader(false);
      } catch (e) {
        setError(true);
      }
    };
    fetchData();
  }, []);
  const fetchMore = () => {
    if(search!==''){
      const newData = [...data];
      const source =  thirdData;
      for (let i = idx; i < idx + 6 && i < source.length; i++) {
        newData.push(source[i]);
      }
      setData(newData);
      setIdx(idx + 6);
      setHasMore(idx<thirdData.length);
      return
    }
    const newData = [...data];
    const source=selector?sortData:posts;
    for (let i = idx; i < idx + 6 && i < source.length; i++) {
      newData.push(source[i]);
    }
    setData(newData);
    setIdx(idx + 6);
    setHasMore(idx<posts.length);

  };

  if (error) {
    return <NotFound />;
  }
  return (
    loader ? <Loader /> :
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

          
          setHasMore(idx<posts.length);
          const newData = [];
          for (let i = 0; i < 6 && i < posts.length; i++) {
            newData.push(posts[i]);
          }
          setIdx(6<posts.length?6:posts.length);
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
        for (let i = 0; i < 6 && i < data.length; i++) {
          newData.push(data[i]);
        }
        setData(newData);
        setIdx(6<data.length?6:data.length);
        setHasMore(idx<thirdData.length);
       }}
       value={search}
 />      
 </div>
        <InfiniteScroll
                dataLength={data.length}
                next={fetchMore}
                hasMore={hasMore}
                loader={<InfiniteScrollLoader></InfiniteScrollLoader>}
                className="grid justify-center lg:w-[calc(99vw-180px)] w-screen grid-cols-1 ml-0 lg:grid-cols-3 md:grid-cols-2 justify-items-center lg:ml-[180px] " 
                >
                {data.map((post,index) => (
                 <div key={index}>
                 <NewsCard image={post.Img} link={post.Links} description={post.Description} type={topic} Source={props.getSource(post.Links)}/>
                 </div>
                ))}
          </InfiniteScroll>
      </>
  );
}