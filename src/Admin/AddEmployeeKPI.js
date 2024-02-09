import React from 'react'


export default function AddEmployeeKPI(props) {

var data = props.employeeKPI.processKpi

var data1 = data.map(ele => ele.subcategories)
console.log(data1.map(elem => elem.queries, "9"));
    
  return (
    <div>{props.employeeKPI.role}
      
    </div>
  )
}
