import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeesideNav.css'; // Import CSS file for styling
import Head from './Employeeheader'
import { Card } from 'primereact/card'; // Import Card component from PrimeReact
import { Button } from '@mui/material';

const EmployeeDetails = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [expandedQuarter, setExpandedQuarter] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null); // State to store the selected query
  const [showPopup, setShowPopup] = useState(false); // State to track whether to show the popup form

  useEffect(() => {
    // Fetch employee data from the API
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get('http://172.17.15.253:4000/api/getEmployee/1001');
        setEmployeeData(response.data.response);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData();
  }, []);

  const toggleQuarter = (index) => {
    if (expandedQuarter === index) {
      setExpandedQuarter(null);
    } else {
      setExpandedQuarter(index);
    }
  };

  const toggleCategory = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
    setSelectedSubcategory(null); // Reset selected subcategory when category is toggled
    setSelectedQuery(null); // Reset selected query when category is toggled
    setShowPopup(false); // Close the popup when category is toggled
  };

  const toggleSubcategory = (subcategoryName) => {
    setSelectedSubcategory(selectedSubcategory === subcategoryName ? null : subcategoryName);
  };

  // Function to handle when "View Details" is clicked
  const toggleQuery = (query) => {
    setSelectedQuery(selectedQuery === query ? null : query);
  };

  const handleInputChange = (e, queryIndex, fieldName) => {
    const { value } = e.target;
    const updatedQueries = [...employeeData.Quater[expandedQuarter]['process KPI'][selectedCategory].subcategories[selectedSubcategory].queries];
    updatedQueries[queryIndex][fieldName] = value;
    const updatedEmployeeData = {
      ...employeeData,
      Quater: employeeData.Quater.map((quarter, quarterIndex) => {
        if (quarterIndex === expandedQuarter) {
          return {
            ...quarter,
            'process KPI': quarter['process KPI'].map((category, categoryIndex) => {
              if (categoryIndex === selectedCategory) {
                return {
                  ...category,
                  subcategories: category.subcategories.map((subcategory, subcategoryIndex) => {
                    if (subcategoryIndex === selectedSubcategory) {
                      return {
                        ...subcategory,
                        queries: updatedQueries,
                      };
                    }
                    return subcategory;
                  }),
                };
              }
              return category;
            }),
          };
        }
        return quarter;
      }),
    };
    setEmployeeData(updatedEmployeeData);
  };

  return (
    <>
      <Head />
      <br /><br />
      <div className="employee-details">
        <div className="sidebar">
          <ul>
            {employeeData && employeeData.Quater.map((quarterData, index) => (
              <li key={index}><br />
                <span
                  onClick={() => toggleQuarter(index)}
                  style={{
                    backgroundColor: expandedQuarter === index,
                    color: expandedQuarter === index ? '#24a0ed' : '#fff',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                  }}
                >
                  Quarter {index + 1}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="main-content">
          {employeeData && employeeData.Quater.map((quarterData, index) => (
            <div key={index} className="quarter-details" style={{ display: expandedQuarter === index ? 'block' : 'none' }}>
              {quarterData['process KPI'].map((category, categoryIndex) => (
                <div key={categoryIndex} className="category-card">
                  <Card onClick={() => toggleCategory(category.categoryName)} style={{ marginBottom: '10px' }}>
                    {category.categoryName}
                  </Card>
                  {selectedCategory === category.categoryName && (
                    category.subcategories.map((subcategory, subcategoryIndex) => (
                      <div key={subcategoryIndex} className="subcategory-card">
                        <Card onClick={() => toggleSubcategory(subcategory.subCategoryName)} style={{ marginBottom: '10px' }}>
                          {subcategory.subCategoryName}
                        </Card>
                        {selectedSubcategory === subcategory.subCategoryName && (
                          <div className="metric-card">
                            {subcategory.queries.map((query, queryIndex) => (
                              <Card key={queryIndex}>
                                <div>
                                  <strong>Metric:</strong> {query.metric}<br />
                                  <strong>Quantity Target:</strong> {query.quantityTarget}<br />
                                  <Button className='view-details' onClick={() => toggleQuery(query)}>View details</Button>
                                </div>
                                {selectedQuery === query && (
                                  <div className='quantity-achieved-card'>
                                    <div>
                                      <label htmlFor="quantityAchieved">Quantity Achieved:</label>
                                      <input
                                        id="quantityAchieved"
                                        value={selectedQuery.quantityAchieved}
                                        onChange={(e) => handleInputChange(e, 'quantityAchieved')}
                                      ></input>
                                    </div>
                                    <div>
                                      <label htmlFor="eIndexInput">Employee Index:</label>
                                      <input
                                        type="text"
                                        id="eIndexInput"
                                        value={selectedQuery.eIndex}
                                        onChange={(e) => handleInputChange(e, 'eIndex')}
                                      />
                                    </div>
                                    <div>
                                      <label htmlFor="empCommentsInput">Employee Comments:</label>
                                      <textarea
                                        id="empCommentsInput"
                                        value={selectedQuery.empComments}
                                        onChange={(e) => handleInputChange(e, 'empComments')}
                                      ></textarea>
                                    </div>
                                  </div>
                                )}

                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EmployeeDetails;
