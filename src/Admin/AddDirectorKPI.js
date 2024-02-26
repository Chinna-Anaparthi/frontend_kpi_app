import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, OutlinedInput, Button } from '@mui/material';
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

export default function AddDirectorKPI(props) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('');
  const [quantityTarget, setQuantityTarget] = useState('');
  const [savedData, setSavedData] = useState([]);

  const arrayData = props.metricsApiGet;
  console.log(arrayData, '5');

  const [processKpi, setProcessKpi] = useState([]);
  console.log(processKpi, '25');

  const handleCategoryChange = (event, value) => {
    setSelectedCategory(value);
  };

  const handleSubcategoryChange = (event, value) => {
    setSelectedSubcategory(value);

  };

  const handleMetricChange = (event, value) => {
    setSelectedMetric(value);
  };

  useEffect(() => {
    fetch('http://172.17.15.150:8080/api/getMetrics/director')
      .then((response) => response.json())
      .then((response) => {
        const data = response
        const categoryDetails = data.response.map(item => {
          const categoryName = item.processKpi[0].categoryName;
          const subCategoryName = item.processKpi[0].subcategories[0].subCategoryName;
          const metric = item.processKpi[0].subcategories[0].queries[0].metric;
          const quantityTarget = item.processKpi[0].subcategories[0].queries[0].quantityTarget;

          return { categoryName, subCategoryName, metric, quantityTarget };
        });
        // console.log(categoryDetails.map((ele)=> ele.categoryName),'109');

        setSavedData(categoryDetails);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
  }, [])

  const handleSave = () => {
    const formattedData = {
      role: "director",
      processKpi: [
        {
          categoryName: selectedCategory,
          subcategories: [
            {
              subCategoryName: selectedSubcategory,
              queries: [
                {
                  metric: selectedMetric,
                  quantityTarget: quantityTarget
                }
              ]
            }
          ]
        }
      ]
    };



    // Clear input fields
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedMetric('');
    setQuantityTarget('');

    console.log('Formatted Data:', formattedData);

    fetch('http://172.17.15.150:8080/api/addMetrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to post data');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Data posted successfully:', data);
      })
      .catch((error) => {
        console.error('Error posting data:', error);
      });
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


  const handleQuantityTargetChange = (event) => {
    setQuantityTarget(event.target.value);
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
                  onChange={handleCategoryChange}
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
              <Button onClick={() => addSubcategory(index)} variant="outlined" style={{ height: '50px', marginRight: '20px' }}>
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
                        onChange={handleSubcategoryChange}
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
                    <Button onClick={() => addQuery(categoryIndex, subcategoryIndex)} variant="outlined" style={{ height: '50px', marginRight: '20px' }}>
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
              onChange={handleMetricChange}
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

    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <b>Director KPI</b>
        </AccordionSummary>
        <AccordionDetails>
          <Button onClick={addCategory} variant="outlined" style={{ height: '50px', display: 'flex', marginBottom: '10px' }}>
            Add Category
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>

                <TableRow>
                  <TableCell>Category Name</TableCell>
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
            {savedData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.categoryName}</TableCell>
                <TableCell>{data.subCategoryName}</TableCell>
                <TableCell>{data.metric}</TableCell>
                <TableCell>{data.quantityTarget}</TableCell>
                {/* <TableRow>{data.categoryName}</TableRow> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}