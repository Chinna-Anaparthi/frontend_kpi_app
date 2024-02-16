import React, { useEffect, useState } from 'react';
import ServiceHelper from '../ServiceHelper/ServiceHelper';
import AddEmployeeKPI from './AddEmployeeKPI';
import AddManagerKPI from './AddManagerKPI';
import AddDirectorKPI from './AddDirectorKPI';



export default function AddMetrics() {
  // State Declarations
  const [method, setMethod] = useState();
  const [apiGet, setApiGet] = useState();
  const [employeeKPI, setEmployeeKPI] = useState();
  const [managerKPI, setManagerKPI] = useState();
  const [directorKPI, setDirectorKPI] = useState();
  const [selectedRole, setSelectedRole] = useState(null); // State to track selected role


  // Variable Declaration
  const roles = ["KPI Metrics","Employee", "Manager", "Director"]; // DropDown


  useEffect(() => {
    setMethod('get');
  }, []);

  useEffect(() => {
    if (apiGet !== undefined) {
      apiGet.forEach(element => {
        if (element.role === 'employee') {

          setEmployeeKPI(element)
        }
        if (element.role === 'manager') {
          console.log(element, "12");
          setManagerKPI(element)
        }
        if (element.role === 'director') {
          console.log(element, "12");
          setDirectorKPI(element)
        }
      });
    }
  }, [apiGet])

  return (
    <div>
      
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
      ADMIN ADD KPI
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ width: '10%', backgroundColor: '#282828', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          {/* Render sidebar */}
          {roles.map((role, index) => (
            <div key={index} style={{ marginBottom: '10px', cursor: 'pointer', }} onClick={() => setSelectedRole(role)}>{role}</div>
          ))}
        </div>

        <div style={{ width: '80%' }}>
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

