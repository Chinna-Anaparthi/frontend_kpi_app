
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AddMetrics from './Admin/AddMetrics.js';
import Login from './Authentication/Login';
import Registration from './Authentication/Registration';
import ForgotPassword from './Authentication/ForgotPassword';
import NotFound from './NotFound';


        
function App() {
  return (
    <div className="App">
     <Router>
    <Routes>
        <Route path='/login' element= {<Login/>}/>
        <Route path='/register' element= {<Registration/>}/>
<<<<<<< HEAD
        <Route path='/metric' element= {<AddMetrics/>}/>
=======
        <Route path='/forgotPwd' element= {<ForgotPassword/>}/>
>>>>>>> 5a279dbb907d86e96725cccc652a8efe43d78809
        <Route path='*' element={<NotFound />}/>
    </Routes>
</Router>
    </div>
  );
}

export default App;
