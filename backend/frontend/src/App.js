
import './App.css';
import Login from './Login';
import Main from './Main';
import {BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Test from './Test';

function App() {
  
  return (
    <Router>

    <Routes>

      <Route path='/home' element={<Main/>}/>
      <Route path='/' element={<Login/>}/>
      <Route path='/test' element={<Test/>}/>
        
      
    </Routes>
    </Router>
  );
}

export default App;

