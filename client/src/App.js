import './App.css';
import { Route,Routes } from 'react-router-dom';
import Clerk from './pages/Clerk';
import Officer from './pages/Officer';
import Map from './pages/Map';
import Post from './pages/Post';


function App() {
  return (
    <div className="text-center">
      <h1>Hello we are team Synntax</h1>



      {/* Define routes for different pages*/}

      <Routes>
        <Route path='/operator' element={<Clerk/>}/>
        <Route path='/officer' element={<Officer/>}/>
        <Route path='/map' element={<Map/>}/>
        <Route path='/post' element={<Post/>}/>
      </Routes>
    </div>
  );
}

export default App;
