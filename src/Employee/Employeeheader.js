import React from 'react';
import './Employeeheader.css'; // Import CSS file for styling
import { AppBar, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  return (
    <AppBar position="fixed" style={{left: 0, top: 0}} >
                <Toolbar className='header'>
                  <MenuIcon />
                    <img style={{ width: '50px', borderRadius: '50%', cursor: 'pointer', marginLeft:'20px' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ53srYmkaJxsUelVmnAHahYnnqjJ_dT-TiUA&usqp=CAU' alt='Not Found'/>
                    
                    {/* <Typography variant="h6">Employee KPI Portal</Typography> */}
                    <div className="userInfo">
                        <Typography variant="h6" className="welcome-text">
                            Hey, Welcome
                        </Typography>
                    </div>
                   
                </Toolbar>
            </AppBar>
  );
};

export default Header;
