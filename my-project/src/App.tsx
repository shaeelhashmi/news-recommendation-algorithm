
import './App.css'
import Headlines from './Components/Headlines'
import News from './Components/News'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TopicNews from './Components/TopicNews'
import Navbar from './Components/Navbar/Navbar';
function App() {

  return (
    <Router>
    <Navbar></Navbar>
    <Routes>
    <Route path='/' element={<Headlines/>}></Route>
    <Route path='/:topic/:subtopic' element={<News></News>}></Route>
    <Route path='/:topic' element={<TopicNews/>}></Route>
    </Routes>
    </Router>
  )
}

export default App
