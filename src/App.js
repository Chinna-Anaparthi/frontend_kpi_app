
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Authentication/Login';
import Registration from './Authentication/Registration';
import NotFound from './NotFound';


        
function App({ Component, pageProps }) {
  return (
    <div className="App">
     <Router>
    <Routes>
        <Route path='/login' element= {<Login/>}/>
        <Route path='/register' element= {<Registration/>}/>
        <Route path='*' element={<NotFound />}/>
    </Routes>
</Router>
    </div>
  );
}

export default App;
