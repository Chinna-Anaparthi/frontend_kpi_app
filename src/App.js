
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AddMetrics from './Admin/KPIMetric.js';
import Login from './Authentication/Login';
import Registration from './Authentication/Registration';
import ForgotPassword from './Authentication/ForgotPassword';
import NotFound from './NotFound';
import Employee from './Employee/Employee.js';
import AddEmployeeKPI from './Admin/AddEmployeeKPI.js';
import AddManagerKPI from './Admin/AddManagerKPI.js';
import AddDirectorKPI from './Admin/AddDirectorKPI.js';
import PersistentDrawerLeft from './Admin/PersistentDrawer.js';
import EmployeeAdd from './Admin/EmployeeAdd.js';
import Sample from './Employee/EmployeecardsData.js'



function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Registration />} />
          <Route path='/metric' element={<AddMetrics />} />
          <Route path='/addEmployee' element={<AddEmployeeKPI />} />
          <Route path='/addManager' element={<AddManagerKPI />} />
          <Route path='/addDirector' element={<AddDirectorKPI />} />
          <Route path='/forgotPwd' element={<ForgotPassword />} />
          <Route path='/employee' element={<Employee />} />
          <Route path='/drawer' element={<PersistentDrawerLeft />} />
          <Route path='/Sample' element={<Sample />} />
          
          <Route path='/emp' element={<EmployeeAdd />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
