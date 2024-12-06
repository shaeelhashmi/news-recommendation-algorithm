
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TopicNews from './Components/TopicNews'
import Login from './Components/Auth/Login'
import Signup from './Components/Auth/Signup'
import Settings from './Components/Settings/Settings'
import HomePage from './Components/HomePage'
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
    <Routes>
    <Route path='/' element={<HomePage  Sort={sortDescriptions}/>}></Route>
    <Route path='/:topic' element={<TopicNews  Sort={sortDescriptions}/>}></Route>
    <Route path='/auth/login' element={<Login></Login>}></Route>
    <Route path='/auth/signup' element={<Signup></Signup>}></Route>
    <Route path='/setting' element={<Settings></Settings>}></Route>

    </Routes>
    </Router>
  )
}

export default App
