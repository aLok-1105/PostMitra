import './App.css';
import { Route,Routes } from 'react-router-dom';
import Officer from './pages/Officer';
import SendPost from './pages/SendPost';
import Login from './pages/Login'
import Map from './pages/Map';
import Home from './pages/Home';
import Navbar from './components/Navbar';


function App() {
  return (
    <div className="relative w-[100vw] h-[100vh] overflow-x-hidden">
      <Navbar/>



      {/* Define routes for different pages*/}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/sendpost' element={<SendPost/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/map' element={<Map/>}/>
        <Route path='/officer' element={<Officer/>}/>
      </Routes>
    </div>
  );
}

export default App;
