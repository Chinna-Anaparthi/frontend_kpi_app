import React,{useEffect,useState} from 'react'
import ServiceHelper from '../ServiceHelper/ServiceHelper'
export default function AddMetrics()  {
  const [method, setMethod] = useState()
  const [apiGet,setApiGet] = useState()

  useEffect(() => {
  setMethod('get')
}, [])
console.log(apiGet,"10");
if(apiGet!== undefined){
  apiGet.forEach(element => {
    if(element.role === 'employee'){
      console.log(element,"12");
    }
    if(element.role === 'manager'){
      console.log(element,"12");
    }
    if(element.role === 'director'){
      console.log(element,"12");
    }
   });
}
 
return (
  <div>
    <h1>Sai</h1>
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
  </div>
)
}
