
import './App.css'
import Headlines from './Components/Headlines'
import News from './Components/News'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TopicNews from './Components/TopicNews'
import Navbar from './Components/Navbar/Navbar';
function App() {
  const sortDescriptions:any = (arr: any[]) => {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)].Description;
    const left = arr.filter(item => item.Description < pivot);
    const right = arr.filter(item => item.Description > pivot);
    const middle = arr.filter(item => item.Description === pivot);

    return [...sortDescriptions(left), ...middle, ...sortDescriptions(right)];
  };

  return (
    <Router>
    <Navbar></Navbar>
    <Routes>
    <Route path='/' element={<Headlines Sort={sortDescriptions}/>}></Route>
    <Route path='/:topic/:subtopic' element={<News  Sort={sortDescriptions}></News>}></Route>
    <Route path='/:topic' element={<TopicNews  Sort={sortDescriptions}/>}></Route>
    </Routes>
    </Router>
  )
}

export default App
