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
import ServiceHelper from '../ServiceHelper/ServiceHelper';
import AddEmployeeKPI from './AddEmployeeKPI';
import AddManagerKPI from './AddManagerKPI';
import AddDirectorKPI from './AddDirectorKPI';
import { Alert, Button, Snackbar, } from '@mui/material';
import ChipInput from 'material-ui-chip-input';
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


export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [method, setMethod] = useState();
  const [apiGet, setApiGet] = useState();
  const [employeeKPI, setEmployeeKPI] = useState();
  const [managerKPI, setManagerKPI] = useState();
  const [directorKPI, setDirectorKPI] = useState();
  const [selectedRole, setSelectedRole] = useState(null);
  const [category, setCategory] = useState()
  const [subCategory, setSubCategory] = useState()
  const [metrics, setMetrics] = useState()
  const [metricsApiPost, setMetricsApiPost] = useState(null)
  const [tableData, setTableData] = useState([]);
  const [opensnack, setOpenSnack] = useState(false);
  const roles = ["KPI Metrics", "Employee", "Manager", "Director"];

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
    fetch('http://172.17.15.150:8080/api/getMetrics')
      .then((response) => response.json())
      .then((data) => {
        console.log(data, '91');
        setApiGet(data.response)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
  }, [])


  useEffect(() => {
    setMethod('get');
  }, []);

  useEffect(() => {
    if (apiGet !== undefined) {
      apiGet.forEach(element => {
        if (element.role === 'employee') {
          console.log(element, "12");
          setEmployeeKPI(element)
        }
        if (element.role === 'manager') {
          console.log(element, "12");
          setManagerKPI(element)
        }
        if (element.role === 'director') {
          console.log(element, "12");
          setDirectorKPI(element)
        }
      });
    }
  }, [apiGet])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleAddCategory = (value) => {
    setCategory(value);
  };

  const handleAddSubCategory = (value) => {
    setSubCategory(value);
  };

  const handleAddMetric = (value) => {
    setMetrics(value);
  };

  const handleSave = (value1, value2, value3) => {
    const reqBody = {
      category: value1,
      subCategory: value2,
      metrics: value3
    };

    fetch('http://172.17.15.150:8080/api/addCategoryQuestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([reqBody])
    })
      .then((response) => {
        if (response.ok) {
          setMetricsApiPost(reqBody);
          console.log('Data posted successfully');
        } else {
          console.error('Error posting data');
        }
      })
      .catch((error) => {
        console.error('Network error:', error);
      });

    if (selectedRole === "KPI Metrics") {
      const newData = {
        category: value1.join(', '),
        subCategory: value2.join(', '),
        metrics: value3.join(', ')
      };

      // Create a new array by appending the new data to the existing tableData
      const updatedTableData = [...tableData, newData];

      // Set the updated tableData
      setTableData(updatedTableData);

      // Clear chip inputs only when the role is "KPI Metrics"
      setCategory([]);
      setSubCategory([]);
      setMetrics([]);
    }
  };


  const showStatus = (value) => {
    setMethod('')
  }
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
                onClick={() => setSelectedRole(role)}
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
                >
                  Save
                </Button>

              )}
              <Snackbar
                open={opensnack}
                autoHideDuration={3000}
                onClose={handleCloseSnack}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
                    {tableData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.subCategory}</TableCell>
                        <TableCell>{row.metrics}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {/* Conditionally render selected role component */}
            {selectedRole === "Employee" && (
              <AddEmployeeKPI
                employeeKPI={employeeKPI}
              />
            )}
            {selectedRole === "Manager" && (
              <AddManagerKPI
                managerKPI={managerKPI}
              />
            )}
            {selectedRole === "Director" && (
              <AddDirectorKPI
                directorKPI={directorKPI}
              />
            )}

          </div>
        </Main>
      </Box>
    </div>
  );
}