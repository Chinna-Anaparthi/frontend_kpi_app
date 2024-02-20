import React, { useState } from 'react';
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

export default function AddEmployeeKPI(props) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('');
  const [quantityTarget, setQuantityTarget] = useState('');
  const [savedData, setSavedData] = useState([]);

  const arrayData = props.metricsApiGet;
  console.log(arrayData, '5');

  const handleCategoryChange = (event, value) => {
    setSelectedCategory(value);
  };

  const handleSubcategoryChange = (event, value) => {
    setSelectedSubcategory(value);
  };

  const handleMetricChange = (event, value) => {
    setSelectedMetric(value);
  };

  const handleQuantityTargetChange = (event) => {
    setQuantityTarget(event.target.value);
  };

  const handleSave = () => {
    const formattedData = {
      role: "employee",
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

    setSavedData([
      ...savedData,
      {
        categoryName: selectedCategory,
        subCategoryName: selectedSubcategory,
        metric: selectedMetric,
        quantityTarget: quantityTarget
      }
    ]);

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



  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <b>Employee KPI</b>
        </AccordionSummary>
        <AccordionSummary>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Subcategory</TableCell>
                  <TableCell>Metrics</TableCell>
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
                        options={arrayData.flatMap(item => item.category)}
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
                    <Stack spacing={2} sx={{ width: 300 }}>
                      <Autocomplete
                        freeSolo
                        id="free-solo-subcategory"
                        disableClearable
                        options={arrayData.flatMap(item => item.subCategory)}
                        value={selectedSubcategory}
                        onChange={handleSubcategoryChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search and Add Subcategory"
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Stack spacing={2} sx={{ width: 300 }}>
                        <Autocomplete
                          freeSolo
                          id="free-solo-metrics"
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
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button
              variant='outlined'
              style={{ backgroundColor: '#e6f6fc', margin: '20px', marginRight: '0', flex:'end' }}
              onClick={handleSave}
            >
              Save
            </Button>

          </TableContainer>
        </AccordionSummary>
      </Accordion>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Subcategory</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
