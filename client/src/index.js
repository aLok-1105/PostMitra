import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import ContextAPI from './components/ContextAPI';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ContextAPI>
      <App />
    </ContextAPI>
    </BrowserRouter>
    
  </React.StrictMode>
);
