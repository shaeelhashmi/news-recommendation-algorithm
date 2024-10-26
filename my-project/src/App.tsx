
import './App.css'
import Headlines from './Components/Headlines'
import News from './Components/News'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TopicNews from './Components/TopicNews'
function App() {

  return (
    <Router>
    <Routes><Route path='/:topic/:subtopic' element={<News></News>}></Route>
    <Route path='/' element={<Headlines/>}></Route>
    <Route path='/:topic' element={<TopicNews/>}></Route>
    </Routes>
    </Router>
  )
}

export default App
