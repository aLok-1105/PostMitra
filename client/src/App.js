import './App.css';
import { Route,Routes } from 'react-router-dom';
import Login from './pages/Login';
import SendPost from './pages/SendPost';
import Map from './pages/Map';


function App() {
  return (
    <div className="text-center">

      {/* Define routes for different pages*/}
      
      <Routes>
        <Route path='/sendpost' element={<SendPost/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/map' element={<Map/>}/>
        <Route path='/officer' element={<Officer/>}/>
        <Route path='/' element={<Login/>}/>
      </Routes>

    </div>
  );
}

export default App;
