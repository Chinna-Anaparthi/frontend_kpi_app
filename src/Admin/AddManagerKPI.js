import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, OutlinedInput, Button } from '@mui/material';
import { Pagination } from '@mui/material';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AddManagerKPI(props) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('');
  const [quantityTarget, setQuantityTarget] = useState('');
  const [categorySelections, setCategorySelections] = useState({});
  const [subcategorySelections, setSubcategorySelections] = useState({});
  const [metricSelections, setMetricSelections] = useState({});
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [selectedSubcategoryIndex, setSelectedSubcategoryIndex] = useState(null);
  const [savedData, setSavedData] = useState([]);
  const [page, setPage] = useState(0);
  const [processKpi, setProcessKpi] = useState([]);
  

  const [cField, setCField]= useState([])
  const [scField, setSCField]= useState([])

  const arrayData = props.metricsApiGet;
  console.log(arrayData, '5');

  const itemsPerPage = 10; // Number of items to display per page
  const paginatedData = savedData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);


  console.log(processKpi, '25');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };



  const handleCategoryChange = (event, value, index) => {
    let updatedCategoryArray = [...scField];
    setSelectedCategoryIndex(index);
   let category= {
    categoryName:value,
    subCategory:[] 
   }
   updatedCategoryArray.push(category);
setCField(updatedCategoryArray)
  
  };

  const handleSubcategoryChange = (event, value, categoryIndex, subcategoryIndex) => {
    setSelectedSubcategoryIndex(subcategoryIndex);
    let updatedSubCategoryArray = [...scField];
   let subCategory= {
    subCategoryName:value,
    queries:[] 
   }
   updatedSubCategoryArray.push(subCategory);
  
    setSCField(updatedSubCategoryArray)
    console.log(scField,"70");
   cField.subCategory =scField
 
   
  };

console.log(cField,"77");

  const handleMetricChange = (event, value, categoryIndex, subcategoryIndex) => {
    setMetricSelections(prevState => ({
      ...prevState,
      [`${categoryIndex}-${subcategoryIndex}`]: value
    }));
  };

  const handleQuantityTargetChange = (event) => {
    setQuantityTarget(event.target.value);
  };

  const isCategorySelected = selectedCategoryIndex !== null;

  useEffect(() => {
    fetch('http://172.17.15.150:8080/api/getMetrics/manager')
      .then((response) => response.json())
      .then((response) => {
        const data = response;
        const categoryDetails = [];

        // Iterate over each response item
        data.response.forEach(item => {
          // Iterate over each category object (processKpi)
          item.processKpi.forEach(process => {
            const categoryName = process.categoryName;

            // Iterate over each subcategory object
            process.subcategories.forEach(subcategory => {
              const subCategoryName = subcategory.subCategoryName;
              console.log(subCategoryName, '76');

              // Iterate over each query object
              subcategory.queries.forEach(query => {
                const metric = query.metric;
                const quantityTarget = query.quantityTarget;

                // Push the extracted data into categoryDetails array
                categoryDetails.push({ categoryName, subCategoryName, metric, quantityTarget });
              });
            });
          });
        });

        // Set the extracted data to state
        setSavedData(categoryDetails);
        console.log(categoryDetails, '91');
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
  }, []);


  const handleSave = () => {
    console.log(processKpi, "117");

    console.log({
      category: categorySelections,
      subCategory: subcategorySelections,
      metric: metricSelections
    },"123");
    const formattedData = {
      role: "manager",
      processKpi: processKpi.map((category, categoryIndex) => ({
        categoryName: categorySelections[categoryIndex] || '',
        subcategories: category.subcategories.map((subcategory, subcategoryIndex) => ({
          subCategoryName: subcategorySelections[categoryIndex] || '',
          queries: subcategory.queries.map((query, queryIndex) => ({
            metric: metricSelections[`${categoryIndex}-${subcategoryIndex}`] || '',
            quantityTarget: query.quantityTarget // Use the quantityTarget from the query
          }))
        }))
      }))
    };
  
    // Clear input fields
    setCategorySelections({});
    setSubcategorySelections({});
    setMetricSelections({});
    setQuantityTarget('');
  
    console.log('Formatted Data:', formattedData);
  
    // fetch('http://172.17.15.150:8080/api/addMetrics', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formattedData),
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('Failed to post data');
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log('Data posted successfully:', data);
    //   })
    //   .catch((error) => {
    //     console.error('Error posting data:', error);
    //   });
  };
  


  const addCategory = () => {
    setProcessKpi(prevState => {
      return [
        ...prevState,
        {
          "categoryName": `New Category ${prevState.length + 1}`,
          "subcategories": []
        }
      ];
    });
    console.log(categorySelections,"179");
  };

  const removeCategory = (index) => {
    setProcessKpi((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  const addSubcategory = (categoryIndex) => {

    setProcessKpi(prevState => {
      const newState = [...prevState];
      newState[categoryIndex].subcategories.push({
        subCategoryName: 'new subCategory',
        queries: []
      });
      return newState;
    });
  };

  const removeSubcategory = (categoryIndex, subcategoryIndex) => {
    setProcessKpi((prevState) => {
      const newState = [...prevState];
      newState[categoryIndex].subcategories.splice(subcategoryIndex, 1);
      return newState;
    });
  };

  const addQuery = (categoryIndex, subcategoryIndex) => {
    setProcessKpi(prevState => {
      const newState = [...prevState];
      newState[categoryIndex].subcategories[subcategoryIndex].queries.push({
        "metric": "newMetric",
        "quantityTarget": 0
      });
      return newState;
    });
  };


  const removeQuery = (categoryIndex, subcategoryIndex, queryIndex) => {
    setProcessKpi((prevState) => {
      const newState = [...prevState];
      newState[categoryIndex].subcategories[subcategoryIndex].queries.splice(queryIndex, 1);
      return newState;
    });
  };




  const renderCategories = () => {
    return processKpi.map((category, index) => (
      <React.Fragment key={index}>
        <div>
          <TableRow>
            <TableCell>
              <Stack spacing={2} sx={{ width: 300 }}>
                <Autocomplete
                  freeSolo
                  id="free-solo-category"
                  disableClearable
                  options={arrayData.flatMap(item => item.category)} // Wrap in an array
                  value={selectedCategory}
                  onChange={(event, value) => handleCategoryChange(event, value, index)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search and Add Category"
                      InputProps={{
                        ...params.InputProps,
                        type: 'search',
                      }}
                    />
                  )}
                />
              </Stack>
            </TableCell>
            <TableCell>
              <Button
                onClick={() => addSubcategory(index)}
                variant="outlined"
                style={{ height: '50px', marginRight: '20px' }}
                disabled={!isCategorySelected}
              >
                Add Subcategory
              </Button>
              <Button onClick={() => removeCategory(index)} variant="outlined" style={{ height: '50px' }}>
                <DeleteIcon />
              </Button>
            </TableCell>
          </TableRow>
        </div>

        {renderSubcategories(category.subcategories, index)}
      </React.Fragment>
    ));
  };

  const renderSubcategories = (subcategories, categoryIndex) => {
    return subcategories.map((subcategory, subcategoryIndex) => (
      <React.Fragment key={subcategoryIndex}>
        <TableRow>
          <TableCell colSpan={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subcategory Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Stack spacing={2} sx={{ width: 300 }}>
                      <Autocomplete
                        freeSolo
                        id="free-solo-category"
                        disableClearable
                        options={arrayData.flatMap(item => item.subCategory)}
                        value={selectedSubcategory}
                        onChange={(event, value) => handleSubcategoryChange(event, value, categoryIndex)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search and Add sub Category"
                            InputProps={{
                              ...params.InputProps,
                              type: 'search',
                            }}
                          />
                        )}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => addQuery(categoryIndex, subcategoryIndex)}
                      variant="outlined"
                      style={{ height: '50px', marginRight: '20px' }}
                      disabled={selectedSubcategoryIndex === null}
                    >
                      Add Query
                    </Button>
                    <Button onClick={() => removeSubcategory(categoryIndex, subcategoryIndex)} variant="outlined" style={{ height: '50px' }}>
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
                {renderQueries(subcategory.queries, categoryIndex, subcategoryIndex)}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      </React.Fragment>
    ));
  };

  const renderQueries = (queries, categoryIndex, subcategoryIndex) => {
    return queries.map((query, index) => (
      <TableRow key={index}>
        <TableCell>
          <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
              freeSolo
              id="free-solo-category"
              disableClearable
              options={arrayData.flatMap(item => item.metrics)}
              value={selectedMetric}
              onChange={(event, value) => handleMetricChange(event, value, categoryIndex, subcategoryIndex)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search and Add Metrics"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
            />
          </Stack>
        </TableCell>
        <TableCell>
          <FormControl variant="outlined" sx={{ minWidth: 120, marginLeft: '10px' }}>
            <InputLabel id="number-select-label">Quantity Target</InputLabel>
            <Select
              labelId="number-select-label"
              id="number-select"
              value={quantityTarget}
              onChange={handleQuantityTargetChange}
              input={<OutlinedInput label="Quantity Target" />}
            >
              {[...Array(11).keys()].map((number) => (
                <MenuItem key={number} value={number}>
                  {number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={() => removeQuery(categoryIndex, subcategoryIndex, index)} variant="outlined" style={{ height: '50px', marginLeft: '20px' }}>
            <DeleteIcon />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (

    <div style={{ backgroundColor: "transparent" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <b>Manager KPI</b>
        </AccordionSummary>
        <AccordionDetails>
          <Button onClick={addCategory} variant="outlined" style={{ height: '50px', display: 'flex', marginBottom: '10px' }}>
            Add Category
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderCategories()}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
        <AccordionActions>
          <Button
            variant='outlined'
            style={{ backgroundColor: '#e6f6fc' }}
            onClick={handleSave}
          >
            Save
          </Button>
        </AccordionActions>
      </Accordion>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>subCategory</TableCell>
              <TableCell>Metrics</TableCell>
              <TableCell>Quantity Target</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.categoryName}</TableCell>
                <TableCell>{data.subCategoryName}</TableCell>
                <TableCell>{data.metric}</TableCell>
                <TableCell>{data.quantityTarget}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(savedData.length / itemsPerPage)}
        page={page}
        onChange={handleChangePage}
        style={{ marginTop: '20px', justifyContent: 'center' }}
      />
    </div>
  );
}