
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import TopicNews from './Components/TopicNews'
import Login from './Components/Auth/Login'
import Signup from './Components/Auth/Signup'
import Settings from './Components/Settings/Settings'
import HomePage from './Components/HomePage'
import NotFound from './Components/404pages'
import SearchResults from './Components/Search'
function App() {
  const sortDescriptions:any = (arr: any[]) => {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)].Description;
    const left = arr.filter(item => item.Description < pivot);
    const right = arr.filter(item => item.Description > pivot);
    const middle = arr.filter(item => item.Description === pivot);

    return [...sortDescriptions(left), ...middle, ...sortDescriptions(right)];
  };
  const getSource = (description: string) => {
    if (description.includes('cnn'))return 'CNN';
    if (description.includes('geo'))return 'Geo News';
  }

  return (
    <Router>
    <Routes>
    <Route path='/' element={<><Navbar></Navbar><HomePage  Sort={sortDescriptions} getSource={getSource}/></>}></Route>
    <Route path='/:topic' element={<>
    <Navbar></Navbar>
    <TopicNews  Sort={sortDescriptions} getSource={getSource}/></>}></Route>
    <Route path='/auth/login' element={<Login></Login>}></Route>
    <Route path='/auth/signup' element={<Signup></Signup>}></Route>
    <Route path='/setting' element={<Settings></Settings>}></Route>
    <Route path="/:topic/search" element={<><Navbar /><SearchResults Sort={sortDescriptions} getSource={getSource} /></>} />
    <Route path='*' element={<NotFound></NotFound>}></Route>

    </Routes>
    </Router>
  )
}

export default App
