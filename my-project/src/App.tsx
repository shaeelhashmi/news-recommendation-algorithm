
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import TopicNews from './Components/TopicNews'
import Login from './Components/Auth/Login'
import Signup from './Components/Auth/Signup'
import Settings from './Components/Settings/Settings'
import HomePage from './Components/HomePage'
import NotFound from './Components/404pages'
function App() {
  const RemovePunctuation = (str: string): string => {
   for (let i = 0; i < str.length; i++) {
    if (str[i] === '.' || str[i] === ',' || str[i] === '!' || str[i] === '?' || str[i] === ':' || str[i] === ';' || str[i] === '"' || str[i] === "'") {
      str = str.slice(0, i) + str.slice(i + 1);
      i--;
    }
  }
    return str;
  }
  const merge = (left: any[], right: any[]) => {
    let resultArray = [], leftIndex = 0, rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
      if (RemovePunctuation(left[leftIndex].Description) < RemovePunctuation(right[rightIndex].Description)) {
        resultArray.push(left[leftIndex]);
        leftIndex++;
      } else {
        resultArray.push(right[rightIndex]);
        rightIndex++;
      }
    }
    return resultArray
            .concat(left.slice(leftIndex))
            .concat(right.slice(rightIndex));
  }
  const sortDescriptions:any = (arr: any[]) => {
    if (arr.length <= 1) return arr;
    const middle = Math.floor(arr.length / 2);
    const left = sortDescriptions(arr.slice(0, middle));
    const right = sortDescriptions(arr.slice(middle));

    return merge(left, right);
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
    <Route path='*' element={<NotFound></NotFound>}></Route>

    </Routes>
    </Router>
  )
}

export default App
