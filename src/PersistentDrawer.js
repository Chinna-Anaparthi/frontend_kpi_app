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
import ServiceHelper from './ServiceHelper/ServiceHelper';
import AddEmployeeKPI from './Admin/AddEmployeeKPI';
import AddManagerKPI from './Admin/AddManagerKPI';
import AddDirectorKPI from './Admin/AddDirectorKPI';

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
  // necessary for content to be below app bar
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


  const roles = ["Employee", "Manager", "Director"];


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

  return (
    <Box sx={{ display: 'flex' }}>
      {method === 'get' && (
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
      )}
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{backgroundColor:'#00aaee'}}>
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
            backgroundColor:'#282828',
            color:'white'
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{
           backgroundColor:'#ffffff',
           color:'black'           
        }}>
          Miracle
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          
          {roles.map((role, index) => (
            <div key={index} style={{ marginBottom: '10px', cursor: 'pointer',padding: '10px' }} onClick={() => setSelectedRole(role)}>{role}

              <ListItem key={role} disablePadding>
               
              </ListItem>
            </div>
          ))}
        </List>
        

      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <div style={{ width: '80%' }}>
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
  );
}