import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    IconButton,
    Button,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function MyTable(props) {
    const [processKpi, setProcessKpi] = useState([]);
    const [rows, setRows] = useState([{ category: '', subcategories: [{ subcategory: '', metrics: [{ metric: '', quantityTarget: '' }] }] }]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);

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
        updatedRows[index].subcategories[0].subcategory = event.target.value;
        setRows(updatedRows);
    };

    const handleAddRow = () => {
        setRows([...rows, { category: '', subcategories: [{ subcategory: '', metrics: [{ metric: '', quantityTarget: '' }] }] }]);
    };

    const handleRemoveRow = (index) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows);
    };

    const handleAddSubcategory = (index) => {
        const updatedRows = [...rows];
        updatedRows[index].subcategories.push({ subcategory: '', metrics: [{ metric: '', quantityTarget: '' }] });
        setRows(updatedRows);
    };

    const handleRemoveSubcategory = (rowIndex, subcategoryIndex) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex].subcategories.splice(subcategoryIndex, 1);
        setRows(updatedRows);
    };

    const handleAddMetric = (rowIndex, subcategoryIndex) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex].subcategories[subcategoryIndex].metrics.push({ metric: '', quantityTarget: '' });
        setRows(updatedRows);
    };

    const handleRemoveMetric = (rowIndex, subcategoryIndex, metricIndex) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex].subcategories[subcategoryIndex].metrics.splice(metricIndex, 1);
        setRows(updatedRows);
    };

    const handleMetricChange = (event, rowIndex, subcategoryIndex, metricIndex) => {
        const updatedRows = rows.map((row, index) => {
            if (index === rowIndex) {
                return {
                    ...row,
                    subcategories: row.subcategories.map((subcategory, i) => {
                        if (i === subcategoryIndex) {
                            return {
                                ...subcategory,
                                metrics: subcategory.metrics.map((metric, j) => (j === metricIndex ? { ...metric, [event.target.name]: event.target.value } : metric)),
                            };
                        }
                        return subcategory;
                    }),
                };
            }
            return row;
        });
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

    const renderMetricOptions = (index, subcategoryIndex) => {
        const selectedCategory = processKpi.find((item) => item.categoryName === rows[index].category);
        if (selectedCategory) {
            const selectedSubcategory = selectedCategory.subcategories.find((sub) => sub.subCategoryName === rows[index].subcategories[subcategoryIndex].subcategory);
            if (selectedSubcategory) {
                return selectedSubcategory.queries.map((query) => (
                    <MenuItem key={query.metric} value={query.metric}>
                        {query.metric}
                    </MenuItem>
                ));
            }
        }
        return null;
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

    return (
        <div>
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
                                    {
                                        row.subcategories.map((subcategory, subcategoryIndex) => {
                                            <div key={subcategoryIndex}>

                                                <FormControl variant='outlined' sx={{ minWidth: 120 }}>
                                                    <InputLabel id={`subcategory-label-${index}`}>Subcategory</InputLabel>
                                                    <Select labelId={`subcategory-label-${index}`} value={subcategory.subcategory}
                                                        onChange={(e) => handleSubcategoryChange(e, index)}
                                                        input={<OutlinedInput label="Subcategory" />}
                                                    >
                                                        {renderSubcategoryOptions(index)}
                                                    </Select>
                                                </FormControl>
                                                {row.category && (
                                                    <Tooltip title="Add Subcategory">
                                                        <IconButton aria-label="add subcategory" onClick={() => handleAddSubcategory(subcategoryIndex)}>
                                                            <AddIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                            </div>
                                        })
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
            <Button onClick={handlePost}>POST</Button>
        </div>
    );
}
