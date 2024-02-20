import React, { useState } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MyTable = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedMetric, setSelectedMetric] = useState('');
    const [rows, setRows] = useState([{ category: '', subcategory: '', metrics: [{ metric: '', quantityTarget: '' }] }]);
    const jsonData = {
        role: "employee",
        processKpi: [
            {
                categoryName: 'Value Creator',
                subcategories: [
                    {
                        subCategoryName: 'Trainings attended in cross skills - 2 per quarter',
                        queries: [{ metric: 'Number of  training programs attended.', quantityTarget: null }, { metric: 'Number of training programs in progress', quantityTarget: null }],
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

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setSelectedSubCategory('');
        setSelectedMetric('');
    };

    const handleSubCategoryChange = (event, rowIndex) => {
        const newRows = [...rows];
        newRows[rowIndex].subcategory = event.target.value;
        setRows(newRows);
    };

    const handleMetricChange = (event, rowIndex, metricIndex) => {
        const newRows = [...rows];
        newRows[rowIndex].metrics[metricIndex].metric = event.target.value;
        setRows(newRows);
    };

    const handleQuantityTargetChange = (event, rowIndex, metricIndex) => {
        const newRows = [...rows];
        newRows[rowIndex].metrics[metricIndex].quantityTarget = event.target.value;
        setRows(newRows);
    };

    const handleAddSubcategory = (rowIndex) => {
        const newRows = [...rows];
        newRows[rowIndex].metrics.push({ metric: '', quantityTarget: '' });
        setRows(newRows);
    };

    const handleRemoveSubcategory = (rowIndex) => {
        const newRows = [...rows];
        newRows[rowIndex].metrics.pop();
        setRows(newRows);
    };

    const handleAddMetric = (rowIndex) => {
        const newRows = [...rows];
        newRows[rowIndex].metrics.push({ metric: '', quantityTarget: '' });
        setRows(newRows);
    };

    const handleRemoveMetric = (rowIndex, metricIndex) => {
        const newRows = [...rows];
        newRows[rowIndex].metrics.splice(metricIndex, 1);
        setRows(newRows);
    };

    const handleSave = () => {
        const formattedData = {
            role: "employee",
            processKpi: rows.map((row) => ({
                categoryName: row.category,
                subcategories: [
                    {
                        subCategoryName: row.subcategory,
                        queries: row.metrics
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

    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    Accordion 1
                </AccordionSummary>
                <AccordionDetails>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Category</TableCell>
                                <TableCell>Sub Category</TableCell>
                                <TableCell>Metrics</TableCell>
                                <TableCell>Quantity Target</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    <TableCell>
                                        <FormControl fullWidth>
                                            <InputLabel id={`category-label-${rowIndex}`}>Category</InputLabel>
                                            <Select
                                                labelId={`category-label-${rowIndex}`}
                                                id={`category-select-${rowIndex}`}
                                                value={selectedCategory}
                                                onChange={handleCategoryChange}
                                            >
                                                {jsonData.processKpi.map((category, index) => (
                                                    <MenuItem key={index} value={category.categoryName}>{category.categoryName}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <FormControl fullWidth>
                                            <InputLabel id={`subcategory-label-${rowIndex}`}>Subcategory</InputLabel>
                                            <Select
                                                labelId={`subcategory-label-${rowIndex}`}
                                                id={`subcategory-select-${rowIndex}`}
                                                value={row.subcategory}
                                                onChange={(event) => handleSubCategoryChange(event, rowIndex)}
                                            >
                                                {selectedCategory && jsonData.processKpi.find(category => category.categoryName === selectedCategory)
                                                    .subcategories.map((subcategory, index) => (
                                                        <MenuItem key={index} value={subcategory.subCategoryName}>{subcategory.subCategoryName}</MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        {row.metrics.map((metric, metricIndex) => (
                                            <div key={metricIndex}>
                                                <FormControl fullWidth>
                                                    <InputLabel id={`metric-label-${rowIndex}-${metricIndex}`}>Metric</InputLabel>
                                                    <Select
                                                        labelId={`metric-label-${rowIndex}-${metricIndex}`}
                                                        id={`metric-select-${rowIndex}-${metricIndex}`}
                                                        value={metric.metric}
                                                        onChange={(event) => handleMetricChange(event, rowIndex, metricIndex)}
                                                    >
                                                        {selectedSubCategory && jsonData.processKpi.find(category => category.categoryName === selectedCategory)
                                                            .subcategories.find(subcategory => subcategory.subCategoryName === row.subcategory)
                                                            .queries.map((query, index) => (
                                                                <MenuItem key={index} value={query.metric}>{query.metric}</MenuItem>
                                                            ))}
                                                    </Select>
                                                </FormControl>
                                                <IconButton aria-label="Add" onClick={() => handleAddMetric(rowIndex)}>
                                                    <AddIcon />
                                                </IconButton>
                                                {row.metrics.length > 1 &&
                                                    <IconButton aria-label="Remove" onClick={() => handleRemoveMetric(rowIndex, metricIndex)}>
                                                        <RemoveIcon />
                                                    </IconButton>
                                                }
                                                <TextField
                                                    type="number"
                                                    inputProps={{ min: 0, max: 10 }}
                                                    value={metric.quantityTarget}
                                                    onChange={(event) => handleQuantityTargetChange(event, rowIndex, metricIndex)}
                                                />
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton aria-label="Add" onClick={() => handleAddSubcategory(rowIndex)}>
                                            <AddIcon />
                                        </IconButton>
                                        {rows.length > 1 &&
                                            <IconButton aria-label="Remove" onClick={() => handleRemoveSubcategory(rowIndex)}>
                                                <RemoveIcon />
                                            </IconButton>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button onClick={handleSave} variant="contained" color="primary" style={{ marginTop: '20px' }}>Post</Button>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default MyTable;
