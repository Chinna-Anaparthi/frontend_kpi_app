import React, { useEffect, useState } from 'react';
import ServiceHelper from '../ServiceHelper/ServiceHelper';
import AddEmployeeKPI from './AddEmployeeKPI';
import AddManagerKPI from './AddManagerKPI';
import AddDirectorKPI from './AddDirectorKPI';
import Drawer from '@mui/material/Drawer';
import { Button } from '@mui/material';
import DehazeIcon from '@mui/icons-material/Dehaze';

export default function AddMetrics() {
  // State Declarations
  const [method, setMethod] = useState();
  const [apiDataFetched, setApiDataFetched] = useState(false);
  const [apiGet, setApiGet] = useState();
  const [employeeKPI, setEmployeeKPI] = useState();
  const [managerKPI, setManagerKPI] = useState();
  const [directorKPI, setDirectorKPI] = useState();
  const [selectedRole, setSelectedRole] = useState(null); // State to track selected role

  // Variable Declaration
  const roles = ["Employee", "Manager", "Director"]; // DropDown

  const toggleDrawer = () => {
    setMethod(method === 'get' ? null : 'get');
  };

  const list = () => (
    <div
      style={{
        width: 200,
        height: '100%',
        backgroundColor: '#282828',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '40px',
      }}
    >

      {roles.map((role, index) => (
        <div key={index} style={{ marginBottom: '10px', cursor: 'pointer', marginLeft: '20px' }} onClick={() => setSelectedRole(role)}>{role}</div>
      ))}
    </div>
  );


  useEffect(() => {
    setMethod('get');
  }, []);

  useEffect(() => {
    if (apiGet && !apiDataFetched) {
      apiGet.forEach(element => {
        if (element.role === 'employee') {
          setEmployeeKPI(element);
        }
        if (element.role === 'manager') {
          setManagerKPI(element);
        }
        if (element.role === 'director') {
          setDirectorKPI(element);
        }
      });
      setApiDataFetched(true);
    }
  }, [apiGet, apiDataFetched]);

  return (
    <div>
      {/* Sidebar */}
      <div style={{ width: '20%', position: 'fixed', top: '0', bottom: '0' }}>
        <Drawer anchor="left" open={method === 'get'} onClose={toggleDrawer}>
          {list()}
        </Drawer>
      </div>
      {method === 'get' && (
        <ServiceHelper
          path='api/getMetrics'
          render={(data) => {
            return (
              <div>
                {data.payload && setApiGet(data.payload)}
              </div>
            )
          }}
        />
      )}
      {/* Header and Content */}
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20%', paddingTop: '60px' }}>
        {/* Header with DehazeIcon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc', position: 'fixed', top: '0', width: '80%' }}>
        
          <Button onClick={toggleDrawer}><DehazeIcon /></Button>
        </div>

        {/* Main content */}
        <div style={{ width: '80%', padding: '20px' }}>
          {/* Conditionally render selected role component */}
          {selectedRole === "Employee" && (
            <AddEmployeeKPI
              employeeKPI={employeeKPI}
            />
          )}
          {selectedRole === "Manager" && (
            <AddManagerKPI
              managerKPI={managerKPI}
            />
          )}
          {selectedRole === "Director" && (
            <AddDirectorKPI
              directorKPI={directorKPI}
            />
          )}
        </div>
      </div>
    </div>


  );
}

