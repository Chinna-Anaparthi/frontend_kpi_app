
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AddMetrics from './Admin/AddMetrics.js';
import Login from './Authentication/Login';
import Registration from './Authentication/Registration';
import ForgotPassword from './Authentication/ForgotPassword';
import NotFound from './NotFound';
import Employee from './Employee/Employee.js';


        
function App() {
  return (
    <div className="App">
     <Router>
    <Routes>
        <Route path='/login' element= {<Login/>}/>
        <Route path='/register' element= {<Registration/>}/>
        <Route path='/metric' element= {<AddMetrics/>}/>
        <Route path='/forgotPwd' element= {<ForgotPassword/>}/>
<<<<<<< HEAD
        <Route path='/employee' element= {<Employee/>}/>
=======
>>>>>>> 28aca5f09ac12b534e68ab3e5c2abc0c60216e5c
        <Route path='*' element={<NotFound />}/>
    </Routes>
</Router>
    </div>
  );
}

export default App;
