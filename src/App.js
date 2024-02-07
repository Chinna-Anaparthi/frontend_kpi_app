
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Authentication/Login';
import Registration from './Authentication/Registration';


        
function App({ Component, pageProps }) {
  return (
    <div className="App">
     <Router>
    <Routes>
        <Route path='/login' element= {<Login/>}/>
        <Route path='/login' element= {<Registration/>}/>
    </Routes>
</Router>
    </div>
  );
}

export default App;
