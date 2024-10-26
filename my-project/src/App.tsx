
import './App.css'
import Headlines from './Components/Headlines'
import News from './Components/News'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <Router>
    <Routes><Route path='/:topic/:subtopic' element={<News></News>}></Route>
    <Route path='/' element={<Headlines/>}></Route></Routes>
    </Router>
  )
}

export default App
