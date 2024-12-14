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
        if (error.response.status === 401) {
          navigate("/auth/login");
        }
      }
    };
    checkLogin();

    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:8080/news/?topic=${topic}`);
        setPosts(result.data.News);
        const newData = [];
        const sortedPosts = props.Sort([...result.data.News]);
        for (let i = idx; i < idx + 4 && i < result.data.News.length; i++) {
          newData.push(result.data.News[i]);
        }
        setData(newData);
        setSortData(sortedPosts);
        setIdx(idx + 4);
        setLoader(false);
      } catch (e) {
        setError(true);
      }
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
    setHasMore(idx < posts.length);
  };

  if (error) {
    return <NotFound />;
  }
  return (
    loader ? <Loader /> :
      <>
        <div className="flex items-center justify-center mt-28">
          
            <form onSubmit={(e) => {
              e.preventDefault();
              const search= e.currentTarget.search.value.trim();
          navigate(`/${topic}/search?search=${encodeURIComponent(search)}`);
            }} className="flex items-center justify-center">
            <button className="flex items-center justify-center w-10 h-10 transition-all duration-500 ease-in-out border-2 border-green-700 hover:bg-green-700">
          <Search></Search>
          </button>
          <input
      type="text"
      placeholder="Search"
      className="w-[200px] h-10 border-2 border-green-700 p-2"
      name='search'

    />
    </form>
      
          </div>
          <div ></div>
        <div>
          <InfiniteScroll
            dataLength={data.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={<InfiniteScrollLoader />}
            className="grid lg:w-[80vw] w-screen grid-cols-1 lg:grid-cols-2 justify-items-center justify-center lg:ml-48 ml-0"
          >
            {data.map((post, index) => (
              <div key={index}>
                <NewsCard image={post.Img} link={post.Links} description={post.Description} type={topic} Source={props.getSource(post.Links)} />
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </>
  );
}
