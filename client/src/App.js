import './App.css';
import { Route,Routes } from 'react-router-dom';
import Login from './pages/Login';
import SendPost from './pages/SendPost';
import Map from './pages/Map';


function App() {
  return (
    <div className="text-center">
      <h1>Hello we are team Synntax</h1>



      {/* Define routes for different pages*/}
      
      <Routes>
      <Route path="/sendPost" element={<SendPost />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/map" element={<Map />} />
      </Routes>

    </div>
  );
}

export default App;
