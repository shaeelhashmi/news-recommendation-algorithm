import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader/Loader';
import NotFound from './404pages';
import NewsCard from './Card/NewsCard';
import Fuse from 'fuse.js';

export default function SearchResults(props: any) {
  const { topic } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const [loader, setLoader] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState(false);
useEffect(() => {
    console.log('fetching data');
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:8080/news?topic=${topic}`);
        console.log(result.data.News);
    
        const fuse = new Fuse(result.data.News, {
          keys: ['Description'],
          threshold: 0.3,
        });
    
        const data = fuse.search(query).map(({ item }) => item);
        setPosts(data);
        setLoader(false);
        console.log(data);
        console.log(query)
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };

    fetchData();
}, [topic, query]);
  if (error) return <NotFound />;
  if (loader) return <Loader />;

  return (
    <div className="grid lg:w-[80vw] w-screen grid-cols-1 lg:grid-cols-2 justify-items-center lg:ml-48 ml-0">
      {posts.length==0?
      <div className='col-span-2 mx-auto mt-32 text-4xl font-bold w-96'>No results found</div>
      :posts.map((post, index) => (
        <NewsCard
          key={index}
          image={post.Img}
          link={post.Links}
          description={post.Description}
          Source={props.getSource(post.Links)}
        />
      ))}
    </div>
  );
}
