import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { AppBar, Card, CardContent, Grid, Toolbar, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { blue, blueGrey, deepOrange, deepPurple, lightBlue } from '@mui/material/colors';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import EmployeeHeader from './Employeeheader'

export default function EmployeeData() {
    const [employeeData, setEmployeeData] = useState('');
    const [expandedQuarter, setExpandedQuarter] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedQuery, setSelectedQuery] = useState(null); // State to store the selected query
    const [showPopup, setShowPopup] = useState(false); // State to track whether to show the popup form
    const [addEmployeeMetrics, setAddEmployeeMetrics] = useState({
        'quantityAchieved': '',
        'eIndex': '',
        'empComments': '',
        'employeeFlag': false,
        'managerFlag': false,
        'directorFlag': false
    })

    console.log(addEmployeeMetrics, 'addEmployeeMetrics');


    const [openDialog, setOpenDialog] = useState(false);
    const [employFlag, setEmployFlag] = useState(false);
    const [quarterEmpData, setQuarterEmpData] = useState(null);
    console.log(employeeData, '36');

    const kpiQuarter = ["Quarter1", "Quarter2", "Quarter3", "Quarter4"]
    console.log(selectedSubcategory, '21');

    useEffect(() => {
        // Fetch employee data from the API
        const fetchEmployeeData = async () => {
            try {
                const response = await axios.get('http://172.17.15.253:4000/api/getMetrics/manager');
                setEmployeeData(response.data.response[0]);
                localStorage.setItem('employeeKPI', JSON.stringify(response.data.response[0]));
                console.log(response.data.response, '25');

            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchEmployeeData();
    }, []);

    console.log(selectedQuery, '54');


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
        console.log(selectedSubcategory, '57');

    };

    const toggleQuery = (query) => {
        console.log('Toggling query:', query);
        setSelectedQuery(selectedQuery === query ? null : query);
        setOpenDialog(true);
    };

    const handleOpenDialog = (data) => {
        saveKPIData(data);
        console.log(saveKPIData(data), '89');
        setDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setDialogOpen(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // const handleInputChange = (e, queryIndex, fieldName) => {
    //     const { value } = e.target;



    //     const updatedQueries = [...employeeData.processKpi[selectedCategory].subcategories[selectedSubcategory].queries];
    //     updatedQueries[queryIndex][fieldName] = value;

    //     const updatedEmployeeData = {
    //         ...employeeData,
    //         processKpi: employeeData.processKpi.map((category, categoryIndex) => {
    //             if (categoryIndex === selectedCategory) {
    //                 return {
    //                     ...category,
    //                     subcategories: category.subcategories.map((subcategory, subcategoryIndex) => {
    //                         if (subcategoryIndex === selectedSubcategory) {
    //                             return {
    //                                 ...subcategory,
    //                                 queries: updatedQueries,
    //                             };
    //                         }
    //                         return subcategory;
    //                     }),
    //                 };
    //             }
    //             return category;
    //         }),
    //     };
    //     setEmployeeData(updatedEmployeeData);
    // };
    var storedValue = localStorage.getItem('employeeFlag');


    const handleSectionSave = () => {
        try {
            const { metric, quantityTarget } = selectedQuery || {};

            // Update the addEmployeeMetrics state with the extracted values
            setAddEmployeeMetrics({
                ...addEmployeeMetrics,
                metric: metric || '',
                quantityTarget: quantityTarget || '',
                category: selectedCategory || '',
                subCategory: selectedSubcategory || ''
            });

            console.log(employeeData, "139", selectedCategory);
            let eflags = [];

            // Retrieve existing data from localStorage
            let existingFlags = JSON.parse(localStorage.getItem('employeeFlag')) || [];

            employeeData.processKpi.forEach((catElement) => {
                if (catElement.categoryName === selectedCategory) {
                    catElement.subcategories.forEach((scElement) => {
                        if (scElement.subCategoryName === selectedSubcategory) {
                            scElement.queries.forEach((qElement) => {
                                if (qElement.metric === metric) {
                                    // Update qElement properties based on addEmployeeMetrics
                                    qElement.quantityAchieved = addEmployeeMetrics.quantityAchieved;
                                    qElement.empIndex = addEmployeeMetrics.eIndex;
                                    qElement.empComments = addEmployeeMetrics.empComments;
                                    qElement.employeeFlag = addEmployeeMetrics.employeeFlag === false ? true : addEmployeeMetrics.employeeFlag;




                                    setAddEmployeeMetrics({
                                        'quantityAchieved': '',
                                        'eIndex': '',
                                        'empComments': '',
                                        'employeeFlag': false,
                                        'managerFlag': false,
                                        'directorFlag': false
                                    })
                                    // Store only the updated employeeFlag property in localStorage
                                    let obj = {
                                        metric: qElement.metric,
                                        employeeStatus: qElement.employeeFlag,
                                    }
                                    eflags.push(obj);
                                }
                            });
                        }
                    });
                }
            });

            // Append new data to existing data
            let updatedFlags = existingFlags.concat(eflags);

            // Store the updated data back into localStorage
            localStorage.setItem('employeeFlag', JSON.stringify(updatedFlags));

            setOpenDialog(false);
            showFlags();
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    };




    const showFlags = () => {
        // Retrieve the value from localStorage

        // Check if the value exists and is not empty
        if (storedValue) {
            try {
                // Parse the stringified value
                var parsedValue = JSON.parse(storedValue);

                // Now you can use the parsed value
                console.log(parsedValue, '198');
                parsedValue.forEach((ele) => {
                    console.log(typeof (selectedQuery.metric), '203');
                    if (ele.metric === selectedQuery.metric) {
                        setEmployFlag(ele.employeeStatus)

                    }

                })
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } else {
            console.log('No value found in localStorage for key "employeeFlag"');
        }


    }

    const handleVisibilityIconClick = (data) => {
        handleOpenDialog(data);
    }



    const saveKPIData = async (apiCallData) => {
        let processKPI = apiCallData.processKpi;

        const quarterData = {
            "empId": 5669,
            "firstName": "Vandana",
            "lastName": "Kottapalli",
            "email": "vkottapalli",
            "role": "employee",
            "practice": "js",
            "password": "vandana@123",
            "location": "Miracle City",
            "managerName": "John",
            "directorName": "Prasad",
            "hrName": "Divya",
            "profileImag": "vandana.png",
            "Quater": [
                {
                    "quater": "Q1",
                    "year": "2024",
                    processKPI
                }
            ]
        };

        console.log(quarterData, '341');

        try {
            const response = await fetch('http://172.17.15.253:4000/api/registerEmployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quarterData)
            });

            if (response.ok) {
                console.log('Data posted successfully');
            } else {
                console.error('Error posting data');
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    var displayData;

    useEffect(() => {
        const fetchQuarterData = async () => {
            try {
                const response = await axios.get(`http://172.17.15.253:4000/api/getEmployee/${5669}`);
                setQuarterEmpData(response.data);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchQuarterData();
    }, []);


    console.log(displayData, '309');

    const selectedQuarterData = displayData?.Quater?.find(quarter => quarter.quater === kpiQuarter);
    const selectedCategoryData = selectedQuarterData?.processKPI?.find(category => category.categoryName === selectedCategory);
    const selectedSubcategoryData = selectedCategoryData?.subcategories?.find(subcategory => subcategory.subCategoryName === selectedSubcategory);
    const queriesData = selectedSubcategoryData?.queries || [];




    return (
        <div style={{ paddingTop: '60px' }}> {/* Add padding to clear the top */}
            <EmployeeHeader />
            <Grid container style={{ height: 'calc(100vh - 60px)' }}>

                <Grid item xs={1.5} style={{ backgroundColor: '#2b2b2b' }}>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, fontFamily: 'roboto' }}>
                        {kpiQuarter.map((quarterData, index) => (
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
                                    {/* <img src='https://cdn-icons-png.flaticon.com/128/3602/3602488.png' style={{ width: '20px', color: 'white' }} /> &nbsp; */}
                                    Quarter {index + 1}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Grid>
                <Grid item xs={10}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25%' }}>
                        <Card style={{ height: '100%', marginLeft: '20px', marginTop: '20px', backgroundColor: '#f2f2f2', width: '100%' }}>
                            <CardContent>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <div style={{ marginBottom: '10px' }}>
                                            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <div style={{ width: '50%' }}>
                                                    <Typography><b>EmpId: </b>{employeeData.empId}</Typography>
                                                </div>
                                                <div style={{ width: '50%' }}>
                                                    <Typography><b>FirstName:</b> {employeeData.firstName}</Typography>
                                                </div>
                                            </span>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div style={{ marginBottom: '10px' }}>
                                            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <div style={{ width: '50%' }}>
                                                    <Typography><b>LastName: </b>{employeeData.lastName}</Typography>
                                                </div>
                                                <div style={{ width: '50%' }}>
                                                    <Typography><b>Email: </b>{employeeData.email}</Typography>
                                                </div>
                                            </span>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div style={{ marginBottom: '10px' }}>
                                            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <div style={{ width: '50%' }}>
                                                    <Typography><b>Role: </b>{employeeData.role}</Typography>
                                                </div>
                                                <div style={{ width: '50%' }}>
                                                    <Typography><b>Practice: </b>{employeeData.practice}</Typography>
                                                </div>
                                            </span>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div style={{ marginBottom: '10px' }}>
                                            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <div style={{ width: '50%' }}>
                                                    <Typography><b>Location: </b>{employeeData.location}</Typography>
                                                </div>
                                                <div style={{ width: '50%' }}>
                                                    <Typography><b>Manager Name: </b>{employeeData.managerName}</Typography>
                                                </div>
                                            </span>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div style={{ marginBottom: '10px' }}>
                                            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <div style={{ width: '50%' }}>
                                                    <Typography><b>Director Name: </b>{employeeData.directorName}</Typography>
                                                </div>
                                                <div style={{ width: '50%' }}>
                                                    <Typography><b>HR Name: </b>{employeeData.hrName}</Typography>
                                                </div>
                                            </span>
                                        </div>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </div>

                    <div style={{}}>
                        <Card style={{ height: '100%', marginLeft: '20px', marginTop: '20px', backgroundColor: '#ecedf0' }}>
                            <CardContent>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ textAlign: 'left', fontFamily: 'roboto' }}>KPI Category</h3>
                                    </div>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <Button style={{ backgroundColor: '#00aaee', color: 'white' }} onClick={(e) => { saveKPIData(employeeData, console.log(employeeData, '315')) }}>Save KPI</Button>
                                    </div>
                                </div>

                                {kpiQuarter.map((quarterData, index) => (
                                    <div key={index} style={{ display: expandedQuarter === index ? 'block' : 'none' }}>
                                        {employeeData.processKpi?.map((category, categoryIndex) => (
                                            <div key={categoryIndex}>
                                                <Card onClick={() => toggleCategory(category.categoryName, console.log(category.categoryName, "255"))} style={{ marginBottom: '10px' }}>
                                                    <Tooltip title='Click to see the subCategories' arrow>
                                                        <p style={{ fontSize: '16px', textAlign: 'left', marginLeft: '20px', fontFamily: 'roboto' }}>
                                                            <b style={{ cursor: 'pointer' }}>{category.categoryName}</b>
                                                        </p>
                                                    </Tooltip>
                                                </Card>
                                                {selectedCategory === category.categoryName && (
console.log(selectedCategory, '438'),
                                                    <div>
                                                        <Tabs value={selectedSubcategory}>
                                                            {category.subcategories?.map((subcategory, subcategoryIndex) => (
                                                                console.log(category.subcategories, '442'),
                                                                <Tab style={{ color: 'black' }}
                                                                    key={subcategoryIndex}
                                                                    label={subcategory.subCategoryName}
                                                                    value={subcategory.subCategoryName}
                                                                    onClick={() => toggleSubcategory(subcategory.subCategoryName)}
                                                                />
                                                            ))}
                                                        </Tabs>
                                                        <div>
                                                            {category.subcategories?.map((subcategory, subcategoryIndex) => (

                                                                <div key={subcategoryIndex}>
                                                                    {selectedSubcategory === subcategory.subCategoryName && (

                                                                        <div>
                                                                            {subcategory.queries.map((query, queryIndex) => (
                                                                                console.log(subcategory.queries, 'bfs'),
                                                                                <Card
                                                                                    key={queryIndex}
                                                                                    style={{ backgroundColor: queryIndex % 2 === 0 ? '#f9f9f9' : '#daeef5' }}
                                                                                >
                                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                                                                        <div style={{ textAlign: 'left', marginLeft: '10px' }}>
                                                                                            <div style={{ marginBottom: '10px' }}>
                                                                                                <b>Metric:</b> {query.metric}
                                                                                            </div>
                                                                                            <div>
                                                                                                <b>Quantity Target:</b> {query.quantityTarget}
                                                                                            </div>
                                                                                        </div>



                                                                                        <div>
                                                                                            <Stack direction="row" spacing={2}>


                                                                                                <Tooltip title={query.employeeFlag !== undefined ? (query.employeeFlag ? 'Employee submitted this metric' : 'Employee not submitted yet') : ''}>
                                                                                                    <Avatar sx={{ bgcolor: query.employeeFlag !== undefined ? (query.employeeFlag ? blueGrey[700] : blueGrey[100]) : blueGrey[100], width: 24, height: 24, fontSize: '10px' }}>E</Avatar>
                                                                                                </Tooltip>


                                                                                                <Tooltip>
                                                                                                    <Avatar sx={{ width: 24, height: 24, fontSize: '10px', }}>M</Avatar>
                                                                                                </Tooltip>
                                                                                                <Tooltip>
                                                                                                    <Avatar sx={{ width: 24, height: 24, fontSize: '10px', }}>D</Avatar>
                                                                                                </Tooltip>
                                                                                            </Stack>
                                                                                        </div>




                                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                            <Button onClick={() => toggleQuery(query)}><AddCircleOutlineIcon /></Button>
                                                                                            <Button onClick={() => handleVisibilityIconClick(query)}><VisibilityIcon /></Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </Card>
                                                                            ))}
                                                                            <Dialog open={openDialog} onClose={handleCloseDialog}>
                                                                                <DialogTitle>Query Details</DialogTitle>
                                                                                <DialogContent>
                                                                                    {selectedQuery && (

                                                                                        <div>
                                                                                            <b>{selectedQuery.metric}</b><br />
                                                                                            <b>Quantity Target:</b> {selectedQuery.quantityTarget}<br /><br />
                                                                                        </div>
                                                                                    )}
                                                                                    <div>
                                                                                        <Typography variant="h6" gutterBottom>
                                                                                            Employee KPI
                                                                                        </Typography>
                                                                                        <TableContainer component={Paper}>
                                                                                            <Table>
                                                                                                <TableHead>
                                                                                                    <TableRow>
                                                                                                        <TableCell>Quantity Achieved</TableCell>
                                                                                                        <TableCell>Employee Index</TableCell>
                                                                                                        <TableCell>Employee Comments</TableCell>
                                                                                                    </TableRow>
                                                                                                </TableHead>
                                                                                                <TableBody>
                                                                                                    <TableRow>
                                                                                                        <TableCell>
                                                                                                            <TextField
                                                                                                                id="quantityAchieved"
                                                                                                                value={addEmployeeMetrics.quantityAchieved || ''}
                                                                                                                onChange={(e) => setAddEmployeeMetrics(prevState => ({
                                                                                                                    ...prevState,
                                                                                                                    quantityAchieved: e.target.value
                                                                                                                }))}
                                                                                                            />
                                                                                                        </TableCell>
                                                                                                        <TableCell>
                                                                                                            <TextField
                                                                                                                id="eIndexInput"
                                                                                                                value={addEmployeeMetrics.eIndex || ''}
                                                                                                                onChange={(e) => setAddEmployeeMetrics(prevState => ({
                                                                                                                    ...prevState,
                                                                                                                    eIndex: e.target.value
                                                                                                                }))}
                                                                                                            />
                                                                                                        </TableCell>
                                                                                                        <TableCell>
                                                                                                            <TextField
                                                                                                                id="empCommentsInput"
                                                                                                                multiline
                                                                                                                value={addEmployeeMetrics.empComments || ''}
                                                                                                                onChange={(e) => setAddEmployeeMetrics(prevState => ({
                                                                                                                    ...prevState,
                                                                                                                    empComments: e.target.value
                                                                                                                }))}
                                                                                                            />
                                                                                                        </TableCell>

                                                                                                    </TableRow>
                                                                                                </TableBody>
                                                                                            </Table>
                                                                                        </TableContainer>
                                                                                    </div>
                                                                                    {selectedQuery?.managerIndex !== '' && selectedQuery?.managerComment !== '' && (
                                                                                        <div>
                                                                                            <Typography variant="h6" gutterBottom>
                                                                                                Manager KPI
                                                                                            </Typography>
                                                                                            <TableContainer component={Paper} style={{ opacity: 0.5, pointerEvents: 'none' }}>
                                                                                                <Table>
                                                                                                    <TableHead>
                                                                                                        <TableRow>
                                                                                                            <TableCell>Manager Index</TableCell>
                                                                                                            <TableCell>Manager Comments</TableCell>
                                                                                                        </TableRow>
                                                                                                    </TableHead>
                                                                                                    <TableBody>
                                                                                                        <TableRow>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    id="managerIndex"
                                                                                                                    value={selectedQuery?.managerIndex || ''}
                                                                                                                    disabled
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    id="managerComment"
                                                                                                                    value={selectedQuery?.managerComment || ''}
                                                                                                                    disabled
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                        </TableRow>
                                                                                                    </TableBody>
                                                                                                </Table>
                                                                                            </TableContainer>
                                                                                        </div>
                                                                                    )}
                                                                                </DialogContent>
                                                                                <DialogActions>
                                                                                    <Button onClick={handleSectionSave}>Save</Button>
                                                                                    <Button onClick={handleCloseDialog}>Close</Button>
                                                                                </DialogActions>
                                                                            </Dialog>

                                                                            <Dialog open={dialogOpen} onClose={handleCloseViewDialog}>
                                                                                <DialogTitle>Query Details</DialogTitle>
                                                                                <DialogContent>
                                                                                    <TableContainer component={Paper}>
                                                                                        <Table>
                                                                                            <TableHead>
                                                                                                <TableRow>
                                                                                                    <TableCell>Quantity Achieved</TableCell>
                                                                                                    <TableCell>Employee Index</TableCell>
                                                                                                    <TableCell>Employee Comments</TableCell>
                                                                                                </TableRow>
                                                                                            </TableHead>
                                                                                            <TableBody>
                                                                                                {queriesData.map(query => (
                                                                                                    <TableRow key={query._id}>
                                                                                                        <TableCell>{query.quantityAchieved}</TableCell>
                                                                                                        <TableCell>{query.empIndex}</TableCell>
                                                                                                        <TableCell>{query.empComments}</TableCell>
                                                                                                    </TableRow>
                                                                                                ))}
                                                                                            </TableBody>
                                                                                        </Table>
                                                                                    </TableContainer>
                                                                                </DialogContent>
                                                                            </Dialog>

                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                </Grid >

            </Grid >
        </div >

    )
}


// "empId": 1001,
// "firstName": "Sai",
// "lastName": "Sai",
// "email": "Sai",
// "role": "Sai",
// "practice": "Sai",
// "password": "Sai",
// "location": "Sai",
// "managerName": "",
// "directorName": "",
// "hrName": "",