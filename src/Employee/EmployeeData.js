import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { AppBar, Card, CardContent, Grid, Toolbar, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function EmployeeData() {
    const [employeeData, setEmployeeData] = useState('');
    const [expandedQuarter, setExpandedQuarter] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedQuery, setSelectedQuery] = useState(null); // State to store the selected query
    const [showPopup, setShowPopup] = useState(false); // State to track whether to show the popup form
    const [addEmployeeMetrics, setAddEmployeeMetrics] = useState( {
        'quarter':'',
        'category':'',
        'subCategory':'',
        'metric':'',
        'quantityTarget':'',
        'quantityAchieved':'',
        'eIndex':'',
        'empComments':'',
    })
    
    
    const [openDialog, setOpenDialog] = useState(false);

    const kpiQuarter = ["Quarter1", "Quarter2", "Quarter3", "Quarter4"]
    console.log(selectedSubcategory, '21');

    useEffect(() => {
        // Fetch employee data from the API
        const fetchEmployeeData = async () => {
            try {
                const response = await axios.get('http://172.17.15.150:4000/api/getMetrics/director');
                setEmployeeData(response.data.response[0]);
                console.log(response.data.response, '25');

            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchEmployeeData();
    }, []);

    console.log(selectedQuery, '32');


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


    // Function to handle when "View Details" is clicked
    const toggleQuery = (query) => {
        setSelectedQuery(selectedQuery === query ? null : query);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e, queryIndex, fieldName) => {
        const { value } = e.target;
    
        // Ensure employeeData and processKpi exist and selectedCategory is a valid index
        if (!employeeData || !employeeData.processKpi || !employeeData.processKpi[selectedCategory]) {
            console.error('Invalid employee data or selected category.');
            return;
        }
    
        const updatedQueries = [...employeeData.processKpi[selectedCategory].subcategories[selectedSubcategory].queries];
        updatedQueries[queryIndex][fieldName] = value;
    
        const updatedEmployeeData = {
            ...employeeData,
            processKpi: employeeData.processKpi.map((category, categoryIndex) => {
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
        setEmployeeData(updatedEmployeeData);
    };
    

    const handleSave = async () => {
        try {
            // Make sure editedQueries contains data
            if (employeeData.length === 0) return;

            // Post the edited queries to your API endpoint
            const response = await axios.post('http://172.17.15.150:4000/api/registerEmployee', {
                employeeData,
            });

            // Handle success response
            console.log('Data saved successfully:', response.data);

            // Close the dialog
            setOpenDialog(false);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };



    return (
        <div style={{ paddingTop: '60px' }}> {/* Add padding to clear the top */}
            <AppBar position="fixed" style={{ height: '60px', backgroundColor: '#00aaee', zIndex: '1000' }}>
                <Toolbar>
                    <Typography variant="h6">Your Header</Typography>
                </Toolbar>
            </AppBar>
            <Grid container style={{ height: 'calc(100vh - 60px)' }}>

                <Grid item xs={1.5} style={{ backgroundColor: '#2b2b2b' }}>
                    <ul style={{ listStyle: 'none' }}>
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
                                    <img src='https://cdn-icons-png.flaticon.com/128/3602/3602488.png' style={{ width: '20px', color: 'white' }} /> &nbsp;
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
                                <h3 style={{ textAlign: 'left', fontFamily: 'roboto' }}>KPI Category</h3>
                                {kpiQuarter.map((quarterData, index) => (
                                    <div key={index} style={{ display: expandedQuarter === index ? 'block' : 'none' }}>
                                        {employeeData.processKpi?.map((category, categoryIndex) => (
                                            <div key={categoryIndex}>
                                                <Card onClick={() => toggleCategory(category.categoryName, console.log(category.categoryName, "255") ) } style={{ marginBottom: '10px' }}>
                                                    <Tooltip title='Click to see the subCategories' arrow>
                                                        <p style={{ fontSize: '16px', textAlign: 'left', marginLeft: '20px', fontFamily: 'roboto' }}>
                                                            <b>{category.categoryName}</b>
                                                        </p>
                                                    </Tooltip>
                                                </Card>
                                                {selectedCategory === category.categoryName && (
                                                    
                                                    <div>
                                                        <Tabs value={selectedSubcategory}>
                                                            {category.subcategories?.map((subcategory, subcategoryIndex) => (
                                                                
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


                                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                            <Button onClick={() => toggleQuery(query)}><AddCircleOutlineIcon /></Button>
                                                                                            <Button><VisibilityIcon /></Button>
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
                                                                                                                value={selectedQuery?.quantityAchieved || ''}
                                                                                                                onChange={(e) => handleInputChange(e, 'quantityAchieved', console.log(selectedQuery, '336'),)}
                                                                                                            />
                                                                                                        </TableCell>
                                                                                                        <TableCell>
                                                                                                            <TextField
                                                                                                                id="eIndexInput"
                                                                                                                value={selectedQuery?.eIndex || ''}
                                                                                                                onChange={(e) => handleInputChange(e, 'eIndex')}
                                                                                                            />
                                                                                                        </TableCell>
                                                                                                        <TableCell>
                                                                                                            <TextField
                                                                                                                id="empCommentsInput"
                                                                                                                multiline
                                                                                                                value={selectedQuery?.empComments || ''}
                                                                                                                onChange={(e) => handleInputChange(e, 'empComments')}
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
                                                                                    <Button >Save</Button>
                                                                                    <Button onClick={handleCloseDialog}>Close</Button>
                                                                                </DialogActions>
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
                    <Button onClick={handleSave}>
                        Submit
                    </Button>
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