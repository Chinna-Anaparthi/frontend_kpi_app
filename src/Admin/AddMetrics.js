import React,{useEffect,useState} from 'react'
import ServiceHelper from '../ServiceHelper/ServiceHelper'
import AddEmployeeKPI from './AddEmployeeKPI'
import AddManagerKPI from './AddManagerKPI'
import AddDirectorKPI from './AddDirectorKPI'
export default function AddMetrics()  {
  //State Declarations
  const [method, setMethod] = useState()
  const [apiGet,setApiGet] = useState()
  const [employeeKPI,setEmployeeKPI]=useState()
  const [managerKPI,setMangerKPI]=useState()
  const [directorKPI,setDirectorKPI]=useState()

  //Variable Declaration
  const roles =["Employee","Manager","Director"]// DropDown

  useEffect(() => {
  setMethod('get')
}, [])
console.log(apiGet,"10");
if(apiGet!== undefined){
  apiGet.forEach(element => {
    if(element.role === 'employee'){
      console.log(element,"12");
      setEmployeeKPI(element)
    }
    if(element.role === 'manager'){
      console.log(element,"12");
      setMangerKPI(element)
    }
    if(element.role === 'director'){
      console.log(element,"12");
      setDirectorKPI(element)
    }
   });
}
 
return (
  <div>
    <h1>ADMIN</h1>
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

    <AddEmployeeKPI
    employeeKPI= {employeeKPI}
    />
    <AddManagerKPI
    managerKPI={managerKPI}
    />
    <AddDirectorKPI
    directorKPI={directorKPI}
    />
  </div>
)
}
