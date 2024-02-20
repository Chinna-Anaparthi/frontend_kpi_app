import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, MenuItem, OutlinedInput, Select, IconButton, Button, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

export default function AddEmployeeKPI(props) {
  const [processKpi, setProcessKpi] = useState([]);
  const [rows, setRows] = useState([{ category: '', subcategory: '', metrics: [{ metric: '', quantityTarget: '' }] }]);

  const addKPI = props.metricsApiGet;
  const categoryArray = [];

  addKPI.map((data) => {
    categoryArray.push(data.category.map((da) => da));
  });

  console.log(categoryArray, "24");
  JSON.stringify(categoryArray)


  useEffect(() => {
    // Sample JSON data
    const jsonData = {
      role: "employee",
      processKpi: [
        {
          categoryName: 'Value Creator',
          subcategories: [
            {
              subCategoryName: 'Trainings attended in cross skills - 2 per quarter',
              queries: [{ metric: 'Number of training programs attended.', quantityTarget: null }, { metric: 'Number of training programs in progress', quantityTarget: null }],
            },
            {
              subCategoryName: 'Get Certification - 1 per year',
              queries: [{ metric: 'Got the certificate', quantityTarget: null }, { metric: 'Attended for the exam', quantityTarget: null }, { metric: 'Attended for training', quantityTarget: null }],
            },
          ],
        },
        {
          categoryName: 'People Development',
          subcategories: [
            {
              subCategoryName: 'Training program to develop others - 2 per quarter',
              queries: [{ metric: 'Trainings given', quantityTarget: null }, { metric: 'Training planned', quantityTarget: null }],
            },
            {
              subCategoryName: 'Attend team meetings - 1 per week',
              queries: [{ metric: 'No. of meetings attended', quantityTarget: null }, { metric: 'No. of meetings not attended with reason', quantityTarget: null }, { metric: 'No. of meetings not attended without intimation', quantityTarget: null }],
            },
          ],
        },
      ],
    };
    setProcessKpi(jsonData.processKpi);
  }, []);

  const handleCategoryChange = (event, index) => {
    const updatedRows = [...rows];
    updatedRows[index].category = event.target.value;
    setRows(updatedRows);
  };

  const handleSubcategoryChange = (event, index) => {
    const updatedRows = [...rows];
    updatedRows[index].subcategory = event.target.value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { category: '', subcategory: '', metrics: [{ metric: '', quantityTarget: '' }] }]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const renderCategoryOptions = () => {
    return processKpi.map((item) => (
      <MenuItem key={item.categoryName} value={item.categoryName}>
        {item.categoryName}
      </MenuItem>
    ));
  };

  const renderSubcategoryOptions = (index) => {
    const selectedCategory = processKpi.find((item) => item.categoryName === rows[index].category);
    if (selectedCategory) {
      return selectedCategory.subcategories.map((sub) => (
        <MenuItem key={sub.subCategoryName} value={sub.subCategoryName}>
          {sub.subCategoryName}
        </MenuItem>
      ));
    }
    return null;
  };

  const handleAddMetric = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].metrics.push({ metric: '', quantityTarget: '' });
    setRows(updatedRows);
  };

  const handleRemoveMetric = (rowIndex, metricIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].metrics.splice(metricIndex, 1);
    setRows(updatedRows);
  };

  const handleMetricChange = (event, rowIndex, metricIndex) => {
    const updatedRows = rows.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          metrics: row.metrics.map((metric, i) => (i === metricIndex ? { ...metric, [event.target.name]: event.target.value } : metric)),
        };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const handlePost = () => {
    const formattedData = {
      role: "employee",
      processKpi: rows.map((row) => ({
        categoryName: row.category,
        subcategories: [
          {
            subCategoryName: row.subcategory,
            queries: row.metrics,
          },
        ],
      })),
    };

    // Perform POST request with formattedData
    console.log('Formatted Data:', formattedData);
    // Example POST request using fetch
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
  const renderOptionsForSelectedSubcategory = (index) => {
    const selectedCategory = processKpi.find((item) => item.categoryName === rows[index].category);
    if (selectedCategory) {
      const selectedSubcategory = selectedCategory.subcategories.find(
        (sub) => sub.subCategoryName === rows[index].subcategory
      );
      if (selectedSubcategory) {
        const selectedMetrics = rows[index].metrics.filter((metric, i) => i !== index);
        const remainingOptions = selectedSubcategory.queries.filter(
          (query) => !selectedMetrics.includes(query.metric)
        );
        return remainingOptions.map((query, i) => (
          <MenuItem key={i} value={query.metric}>
            {query.metric}
          </MenuItem>
        ));
      }
    }
    return null;
  };



  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          ADD Employee KPI
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>

                  <TableCell>Category</TableCell>
                  <TableCell>Subcategory</TableCell>
                  <TableCell>Metrics</TableCell>
                  {/* <TableCell>Actions</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
               
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <InputLabel id={`category-label-${index}`}>Category</InputLabel>
                        <Select
                          labelId={`category-label-${index}`}
                          value={row.category}
                          onChange={(e) => handleCategoryChange(e, index)}
                          input={<OutlinedInput label="Category" />}
                        >
                          {renderCategoryOptions()}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      {row.category && (
                        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                          <InputLabel id={`subcategory-label-${index}`}>Subcategory</InputLabel>
                          <Select
                            labelId={`subcategory-label-${index}`}
                            value={row.subcategory}
                            onChange={(e) => handleSubcategoryChange(e, index)}
                            input={<OutlinedInput label="Subcategory" />}
                          >
                            {renderSubcategoryOptions(index)}
                          </Select>
                        </FormControl>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.subcategory && (
                        <div>
                          {row.metrics.map((metric, metricIndex) => (
                            <div key={metricIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                              <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
                                <InputLabel id={`metric-label-${index}-${metricIndex}`}>Metric</InputLabel>
                                <Select
                                  labelId={`metric-label-${index}-${metricIndex}`}
                                  name="metric"
                                  value={metric.metric}
                                  onChange={(e) => handleMetricChange(e, index, metricIndex)}
                                  input={<OutlinedInput label="Metric" />}
                                >
                                  {renderOptionsForSelectedSubcategory(index)}
                                </Select>
                              </FormControl>
                              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                                <InputLabel id={`quantity-target-label-${index}-${metricIndex}`}>Quantity Target</InputLabel>
                                <Select
                                  labelId={`quantity-target-label-${index}-${metricIndex}`}
                                  name="quantityTarget"
                                  value={metric.quantityTarget}
                                  onChange={(e) => handleMetricChange(e, index, metricIndex)}
                                  input={<OutlinedInput label="Quantity Target" />}
                                >
                                  {[...Array(11).keys()].map((number) => (
                                    <MenuItem key={number} value={number}>
                                      {number}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <Tooltip title="Add Metric">
                                {metricIndex === row.metrics.length - 1 && (
                                  <IconButton aria-label="add metric" onClick={() => handleAddMetric(index)}>
                                    <AddIcon />
                                  </IconButton>
                                )}
                              </Tooltip>
                              <Tooltip title="Remove Metric">
                                {metricIndex !== 0 && (
                                  <IconButton
                                    aria-label="remove metric"
                                    onClick={() => handleRemoveMetric(index, metricIndex)}
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                )}
                              </Tooltip>
                            </div>
                          ))}
                        </div>
                      )}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={handlePost}>POST</Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
