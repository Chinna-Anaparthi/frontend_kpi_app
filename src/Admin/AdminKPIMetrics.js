import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import AddEmployeeKPI from './AddEmployeeKPI';
import AddManagerKPI from './AddManagerKPI';
import AddDirectorKPI from './AddDirectorKPI';
import { Alert, Button, Snackbar, } from '@mui/material';
import ChipInput from 'material-ui-chip-input';
// import Manager from '../ManagerPortal/Manager';
import { makeStyles } from '@mui/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import MyTable from './EmployeeAdd';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


export default function AdminKPIMetrics() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [metricsID, setMetricsID] = useState(null)
  const [method, setMethod] = useState();
  const [apiGet, setApiGet] = useState();
  const [employeeKPI, setEmployeeKPI] = useState();
  const [managerKPI, setManagerKPI] = useState([]);
  const [directorKPI, setDirectorKPI] = useState();
  const [selectedRole, setSelectedRole] = useState(null);
  const [category, setCategory] = useState()
  const [subCategory, setSubCategory] = useState()
  const [metrics, setMetrics] = useState()
  const [metricsApiGet, setMetricsApiGet] = useState([])
  const [tableData, setTableData] = useState([]);
  const [opensnack, setOpenSnack] = useState(false);
  const [isChipInputSubDisabled, setIsChipInputSubDisabled] = useState(false);
  const [isChipInputMetricDisabled, setIsChipInputMetricDisabled] = useState(false);
  const [isSaveDisable, setIsSaveDisable] = useState(false);

  const roles = ["KPI Metrics", "Employee", "Manager", "Director"];

  console.log(metricsApiGet, '103');

  const handleClick = () => {
    setOpenSnack(true);
  };



  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  useEffect(() => {
    callKPIMetrics()

  }, [])
  const callKPIMetrics = () => {
    // fetch('http://172.17.15.253:4000/api/getMetrics')
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log(data, '91');
    //   setApiGet(data.response)
    // })
    // .catch((error) => {
    //   console.error('Error fetching data:', error);
    // })
    setSelectedRole('KPI Metrics')
    fetch('http://172.17.15.253:4000/api/getCategoryQuestions')
      .then((response) => response.json())
      .then((response) => {

        setMetricsID(response.data[0]._id)
        setMetricsApiGet(response.data);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
  }

  useEffect(() => {
    setMethod('get');
  }, []);





  // For Manager API ROLE
  const handleSelectedRole = (mrole) => {
    if (mrole === 'Manager') {
      setSelectedRole('Manager')
      fetch('http://172.17.15.253:4000/api/getMetrics/manager')
        .then((response) => response.json())
        .then((data) => {
          console.log(data.response, '91');
          setManagerKPI(data.response)
          // setApiGet(data.response)
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
    }
    console.log(mrole, "160");
    if (mrole === 'KPI Metrics') {
      callKPIMetrics()
      setSelectedRole('KPI Metrics')
    }
  }


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleAddCategory = (value) => {

    setCategory(value);
    setIsChipInputSubDisabled(true)
  };

  const handleAddSubCategory = (value) => {
    setSubCategory(value);
    setIsChipInputMetricDisabled(true)
  };

  const handleAddMetric = (value) => {
    setMetrics(value);
    setIsSaveDisable(true)
  };

  const handleSave = (value1, value2, value3) => {
    console.log("IN KPI 182");
    if (metricsID !== null && metricsID) {
      metricsApiGet.forEach((element) => {
        if (value1.length !== 0) {
          value1.forEach((ele) => {
            if (!element.category.includes(ele)) {
              element.category.push(ele)
            }
            console.log(element.category, '177');
          })
        }
        if (value2.length !== 0) {
          value2.forEach((ele) => {
            if (!element.subCategory.includes(ele)) {
              element.subCategory.push(ele)
            }
            console.log(element.subCategory, '177');
          })
        }
        if (value3.length !== 0) {
          value3.forEach((ele) => {
            if (!element.metrics.includes(ele)) {
              element.metrics.push(ele)
            }
            console.log(element.metrics, '177');
          })
        }
      })
      console.log(metricsApiGet, "203");
      //  console.log(...metricsApiGet, reqBody, '177');
      fetch('http://172.17.15.253:4000/api/addCategoryQuestions/' + metricsID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metricsApiGet[0])
      })
        .then((response) => {
          if (response.ok) {
            console.log(response, '182');
            // setMetricsApiPost(reqBody);
            console.log('Data posted successfully');
          } else {
            console.error('Error posting data');
          }
        })
        .catch((error) => {
          console.error('Network error:', error);
        });

    } else {
      const reqBody = {
        category: value1,
        subCategory: value2,
        metrics: value3
      };
      fetch('http://172.17.15.253:4000/api/addCategoryQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody)
      })
        .then((response) => {
          if (response.ok) {
            console.log(response, '182');
            // setMetricsApiPost(reqBody);
            console.log('Data posted successfully');
          } else {
            console.error('Error posting data');
          }
        })
        .catch((error) => {
          console.error('Network error:', error);
        });

    }

    if (selectedRole === "KPI Metrics") {
      const newData = {
        category: value1.join(', '),
        subCategory: value2.join(', '),
        metrics: value3.join(', ')
      };

      // Create a new array by appending the new data to the existing tableData
      const updatedTableData = [...tableData, newData];
      console.log(updatedTableData, '202');
      // Set the updated tableData
      setTableData(updatedTableData);

      // Clear chip inputs only when the role is "KPI Metrics"
      setCategory([]);
      setSubCategory([]);
      setMetrics([]);
    }
  };




  console.log(metricsApiGet, "283");
  // console.log(metricsApiPost, "188", method);
  return (
    <div>
      {/* {method === 'get' && (
        <ServiceHelper
          path='api/getMetrics'
          render={(data) => {
            return (
              <div>
                {data.payload && setApiGet(data.payload)}
              </div>
            )
          }}
        />
      )} */}
      {/* {method === 'post' && (
        <ServiceHelper
          method='post'
          path={'api/addCategoryQuestions'}
          input={metricsApiPost}
          render={(data) => {
            return (
              <div>
                {data.payload && showStatus(data.payload)}
              </div>
            )
          }}
        />
      )} */}
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} sx={{ backgroundColor: '#00aaee' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Admin
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#282828',
              color: 'white'
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader sx={{
            backgroundColor: '#ffffff',
            color: 'black'
          }}>
            Miracle
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />

          <List>
            {roles.map((role, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '10px',
                  cursor: 'pointer',
                  padding: '10px',
                  backgroundColor: selectedRole === role ? '#f0f0f0' : 'inherit',
                  color: selectedRole === role ? 'black' : 'inherit',
                }}
                onClick={() => handleSelectedRole(role)}
              >
                <ListItem key={role} disablePadding>
                  {role}
                </ListItem>
              </div>
            ))}
          </List>


        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              {selectedRole === 'KPI Metrics' && (
                <div style={{ width: '30%', marginRight: '10px' }}>
                  <Box sx={{ minWidth: 120 }}>
                    <ChipInput
                      variant='outlined'
                      fullWidth
                      label="Category"
                      value={category}
                      onChange={(chip) => handleAddCategory(chip)}
                    />
                  </Box>
                </div>
              )}
              {selectedRole === 'KPI Metrics' && (
                <div style={{ width: '30%', marginRight: '10px' }}>
                  <Box sx={{ minWidth: 120 }}>
                    <ChipInput
                      label="Sub Category"
                      variant='outlined'
                      fullWidth
                      value={subCategory}
                      onChange={(chip) => handleAddSubCategory(chip)}
                      disabled={!isChipInputSubDisabled}
                    />
                  </Box>
                </div>
              )}
              {selectedRole === 'KPI Metrics' && (
                <div style={{ width: '30%' }}>
                  <Box sx={{ minWidth: 120 }}>
                    <ChipInput
                      label="Metrics"
                      variant='outlined'
                      fullWidth
                      value={metrics}
                      onChange={(chip) => handleAddMetric(chip)}
                      disabled={!isChipInputMetricDisabled}
                    />
                  </Box>
                </div>
              )}
              {selectedRole === "KPI Metrics" && (
                <Button
                  variant='outlined'
                  style={{ backgroundColor: '#e6f6fc' }}
                  onClick={() => {
                    handleSave(category, subCategory, metrics);
                    handleClick();
                  }}
                  disabled={!isSaveDisable}
                >
                  Save
                </Button>

              )}
              <Snackbar
                open={opensnack}
                autoHideDuration={1000}
                onClose={handleCloseSnack}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Alert
                  onClose={handleCloseSnack}
                  severity="success"
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  The data is successfully saved
                </Alert>
              </Snackbar>
            </div>
            {selectedRole === "KPI Metrics" && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Sub Category</TableCell>
                      <TableCell>Metrics</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metricsApiGet.map((row, index) => (
                      <React.Fragment key={index}>
                        {/* Render category data */}
                        {row.category.map((categoryItem, categoryIndex) => (
                          <TableRow key={`category-${index}-${categoryIndex}`}>
                            <TableCell>{categoryItem}</TableCell>
                            <TableCell></TableCell> {/* Empty TableCell for subCategory */}
                            <TableCell></TableCell> {/* Empty TableCell for metrics */}
                          </TableRow>
                        ))}
                        {/* Render subCategory data */}
                        {row.subCategory.map((subCategoryItem, subCategoryIndex) => (
                          <TableRow key={`subCategory-${index}-${subCategoryIndex}`}>
                            <TableCell></TableCell> {/* Empty TableCell for category */}
                            <TableCell>{subCategoryItem}</TableCell>
                            <TableCell></TableCell> {/* Empty TableCell for metrics */}
                          </TableRow>
                        ))}
                        {/* Render metrics data */}
                        {row.metrics.map((metricsItem, metricsIndex) => (
                          <TableRow key={`metrics-${index}-${metricsIndex}`}>
                            <TableCell></TableCell> {/* Empty TableCell for category */}
                            <TableCell></TableCell> {/* Empty TableCell for subCategory */}
                            <TableCell>{metricsItem}</TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>


                </Table>

              </TableContainer>
            )}

            {selectedRole === "Employee" && (
              <AddEmployeeKPI
                employeeKPI={employeeKPI}
                metricsApiGet={metricsApiGet}
              />
            )}
            {selectedRole === "Manager" && (
              <AddManagerKPI
                managerKPI={managerKPI}
                metricsApiGet={metricsApiGet}
              />
            )}
            {selectedRole === "Director" && (
              <AddDirectorKPI
                directorKPI={directorKPI}
                metricsApiGet={metricsApiGet}
              />
            )}
            {/* <Manager 
/> */}
          </div>
        </Main>
      </Box>
    </div>
  );
}
