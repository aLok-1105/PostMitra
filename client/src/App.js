import './App.css';
import { Route,Routes } from 'react-router-dom';
import Clerk from './pages/Clerk';
import Officer from './pages/Officer';
import Map from './pages/Map';
import Login from './pages/Login';
import Navbar from './components/Navbar'
import Home from './pages/Home';


function App() {
  return (
    <div className="relative w-[100vw] h-[100vh] overflow-x-hidden">
      <Navbar/>

      {/* Define routes for different pages*/}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/operator' element={<Clerk/>}/>
        <Route path='/officer' element={<Officer/>}/>
        <Route path='/map' element={<Map/>}/>
        <Route path='/login' element={<Login/>}/>
        
      </Routes>
    </div>
  );
}

export default App;
