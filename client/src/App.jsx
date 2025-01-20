// import './App.css';
// import { Route,Routes } from 'react-router-dom';
// import Officer from './pages/Post';
// import SendPost from './pages/Clerk';
// // import Login from './pages/Login'
// import Map from './pages/Map';
// import { Home } from './pages/Home';
// import { useState } from 'react';
// import { Login } from './pages/Login';


// function App() {
//   const [username, setUsername] = useState("");
//   return (
//     <div className="text-center">
//       <h1>Hello we are team Synntax</h1>
//       <Routes>

//         <Route path='/' element={username ? <Home username={username}/> : <Login onSubmit={setUsername}/> } />
//         <Route path='/sendpost' element={<SendPost/>}/>
//         <Route path='/login' element={<Login/>}/>
//         <Route path='/map' element={<Map/>}/>
//         <Route path='/officer' element={<Officer/>}/>
//       </Routes>
//     </div>
//   );
// }

// export default App;

import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Tracking } from './pages/tracking'
import SendPost from './pages/SendPost'
import Map from './pages/Map';

function App() {
  
  const [username, setUsername] = useState("")

  return (
    // <Router>
      <Routes>
        <Route
          path="/"
          element={
            username ? <Home username={username} /> : <Login onSubmit={setUsername} />
          }
        />
        <Route
          path="/login"
          element={<Login/>}
        />
        <Route path='/tracking/:parcelId' element={<Tracking />} />
        <Route path='/tracking/' element={<Tracking />} />
        <Route path='/map' element={<Map/>}/>
        <Route path='/sendpost' element={<SendPost/>}/>
        {/* <Route path="/tracking/:parcelId" element={<Tracking />} />
        <Route path="/tracking/" element={<Tracking />} /> */}
      </Routes>
    // </Router>
  );
  
}

export default App
