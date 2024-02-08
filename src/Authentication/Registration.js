import React, { useEffect, useState } from 'react'
import { TextField, MenuItem, Button, FormControl, InputLabel, Select, Grid, Paper, InputAdornment, Dialog, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import PasswordIcon from '@mui/icons-material/Password';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import axios from 'axios';
import { BASE_URL } from '../config';
import './BodyStyles.css'


export default function Registration() {

  const [formData, setFormData] = useState({
    Empid: '',
    Empmail: '',
    Firstname: '',
    Lastname: '',
    Role: '',
    Practice: '',
    Reportingmanager: '',
    Password: '',
    Reportinghr: '',
    Location: '',
    Image: null,
  })
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);

  const navigate = useNavigate();
  const roles = ['Employee', 'HR', 'Manager', 'Director', 'Vice President'];
  const practices = ['Digital Practice', 'Innovations', 'B2B', 'Integrations', 'Spring Boot', 'Cloud and DevOps'];
  const managers = ['John Vesli Chitri', 'Vinod Marupu', 'Ravi Ijju', 'Venkata Ram Prasad Kandregula', 'Santosh Soni', 'Prasad Venkat Lokam'];
  const hr = ['Divya Abburi', 'Sruthi Kolli', 'Lohitha Bandi', 'Ajay Duvvu', 'PadmaPriya Kamsu', 'Vasu Varupula', 'Chandini Sigireddy'];
  const location = ['Miracle City', 'Miracle Heights', 'Miracle Valley', 'Novi USA'];

  const inputWidth = '20vw';
  const inputHeight = '40px';

  const validateInteger = (value) => {
    return /^\d+$/.test(value);
  };

  const validateEmpId = (empId) => {
    return empId.trim() !== '';
  };

  const validateEmpEmail = (empEmail) => {
    const emailPattern = /^[^\s][a-zA-Z][\w-]*(\.[\w-]+)*@[\w-]+(\.[\w-]+)+[^\s]$/;

    return emailPattern.test(empEmail) && empEmail.endsWith('miraclesoft.com');
  };


  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'Empid' && value.trim() !== '' && !validateInteger(value)) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Please enter integer values.',
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }

    // Validation logic for email input
    if (name === 'Empmail') {
      if (/\s/.test(value)) {
        // If there is any space in the email address
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Spaces are not allowed in the email address.',
        }));
      } else if (!/^[a-zA-Z][\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Please enter a valid email address. Ex: abc@miraclesoft.com',
        }));
      } else if (!value.endsWith('@miraclesoft.com')) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Email must end with @miraclesoft.com',
        }));
      } else if (value.split('@').length - 1 > 1) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only one '@' is allowed",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '', // Clear the error when the format is correct
        }));
      }
    }


    if (name === 'Password') {
      if (value.length < 8) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Password must be at least 8 characters long',
        }));
      } else if (!/\d/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Password must contain at least one digit (0-9)',
        }));
      } else if (!/[!@#$%^&*]/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Password must contain at least one special character (!@#$%^&*)',
        }));
      } else if (!/[A-Z]/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Password must contain at least one uppercase letter',
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }

    if (name === 'Firstname' || name === 'Lastname') {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Please enter only letters and spaces',
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '', // Clear the error when the input contains only letters
        }));
      }
    }

    if (name === 'Image' && type === 'file') {
      if (!value) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Profile image is required',
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }

  };


  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      getBase64(file, (base64Image) => {
        setFormData({ ...formData, Image: base64Image });
      });
    }
  };

  const getBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
    reader.onerror = (error) => console.error('Error converting file to base64:', error);
  };


  useEffect(() => {
    const isFilled = Object.values(formData).every(value => value !== '' && value !== null);
    setIsFormFilled(isFilled);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!validateEmpId(formData.Empid)) {
      errors.Empid = 'Please enter a valid Emp Id';
    }

    if (!validateEmpEmail(formData.Empmail)) {
      errors.Empmail = 'Please enter a valid Emp Email';
    }
    if (!formData.Image) {
      errors.Image = 'Profile image is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const encodedPassword = btoa(formData.Password);
      const encodedEmpmail = btoa(formData.Empmail);

      const displayPayload = {
        Empid: formData.Empid,
        Empmail: encodedEmpmail,
        Firstname: formData.Firstname,
        Lastname: formData.Lastname,
        Role: formData.Role,
        Practies: formData.Practice,
        Reportingmanager: formData.Reportingmanager,
        Password: encodedPassword,
        Reportinghr: formData.Reportinghr,
        Location: formData.Location,
        Image: formData.Image, // Make sure this is a base64 string
      };



      const response = await axios.post(`${BASE_URL}/api/emp_register`, displayPayload);
      if (response.status === 200) {
        console.log('Registration successful');
        setFormData({
          Empid: '',
          Empmail: '',
          Firstname: '',
          Lastname: '',
          Role: '',
          Practice: '',
          Reportingmanager: '',
          Password: '',
          Image: '', // Clear the image data after successful upload
        });

        setOpenDialog(true);
      } else {
        console.log('Registration failed');
      }
    } catch (error) {
      console.error('Error registering employee:', error);

    }

  };

  const handleClose = () => {
    setOpenDialog(false);
    navigate('/login');
  };

  const register_background = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgF-M-xDaQ55G5hE34-Lh3JIJrhsm8Y_Dq4Yhq4rk6Ku4zHAvP9mp8om5K3lccN2ECz9o&usqp=CAU")', // URL enclosed in quotes
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
};




  return (
    <div style={register_background}>
      <Paper style={{ padding: '15px', width: '45vw', }}>

        <h2 style={{ textAlign: 'center', textTransform: 'uppercase' }}>Registration Form</h2>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="Empid"
                label="Empid"
                value={formData.Empid}
                onChange={handleChange}
                error={!!validationErrors.Empid}
                helperText={validationErrors.Empid}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="Empmail"
                label="Empmail"
                value={formData.Empmail}
                onChange={handleChange}
                error={!!validationErrors.Empmail}
                helperText={validationErrors.Empmail}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="Firstname"
                label="Firstname"
                value={formData.Firstname}
                onChange={handleChange}
                error={!!validationErrors.Firstname}
                helperText={validationErrors.Firstname}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="Lastname"
                label="Lastname"
                value={formData.Lastname}
                onChange={handleChange}
                error={!!validationErrors.Lastname}
                helperText={validationErrors.Lastname}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="Password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.Password}
                onChange={handleChange}
                error={!!validationErrors.Password}
                helperText={validationErrors.Password}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        style={{ width: '1px', height: '1px', background: '#a9a7a7', marginRight: '0px', }}
                      >
                        {showPassword ? <VisibilityIcon style={{ color: 'black' }} /> : <VisibilityOffIcon style={{ color: 'black' }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>

              <FormControl fullWidth>
                <InputLabel >Role</InputLabel>
                <Select

                  name="Role"
                  value={formData.Role}
                  onChange={handleChange}
                  error={!!validationErrors.Role}
                  helperText={validationErrors.Role}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SupervisorAccountIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {roles.map((role, index) => (
                    <MenuItem key={index} value={role}>{role}</MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Practice</InputLabel>
                <Select
                  name="Practice"
                  value={formData.Practice}
                  onChange={handleChange}
                  error={!!validationErrors.Practice}
                  helperText={validationErrors.Practice}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupsIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {practices.map((practice, index) => (
                    <MenuItem key={index} value={practice}>{practice}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Reporting Manager</InputLabel>
                <Select
                  name="Reportingmanager"
                  value={formData.Reportingmanager}
                  onChange={handleChange}
                  error={!!validationErrors.Reportingmanager}
                  helperText={validationErrors.Reportingmanager}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {managers.map((manager, index) => (
                    <MenuItem key={index} value={manager}>{manager}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Reporting HR</InputLabel>
                <Select
                  name="Reportinghr"
                  value={formData.Reportinghr}
                  onChange={handleChange}
                  error={!!validationErrors.Reportinghr}
                  helperText={validationErrors.Reportinghr}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {hr.map((hrPerson, index) => (
                    <MenuItem key={index} value={hrPerson}>{hrPerson}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  name="Location"
                  value={formData.Location || ''}
                  onChange={handleChange}
                  error={!!validationErrors.Location}
                  helperText={validationErrors.Location}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {location.map((location, index) => (
                    <MenuItem key={index} value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <p><b >Choose your Profile :</b></p>
              <TextField
                variant="outlined"
                type="file"
                name="Image"
                accept="image/*"
                onChange={handleImageChange}
                error={!!validationErrors.Image}
                helperText={validationErrors.Image}
                style={{ width: inputWidth, height: inputHeight, marginBottom: '10px' }}

              />
            </Grid>
            <Grid item xs={12}>
              <Dialog open={openDialog} onClose={handleClose}>
                <DialogContent style={{ width: '420px' }}>
                  <img
                    src="https://badge-exam.miraclesoft.com/assets/ecert/Completed-test.svg"
                    alt="Not Found"
                    style={{ maxWidth: '100%', maxHeight: '200px', display: 'block', margin: 'auto' }}
                  />

                  <DialogContentText style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold', color: '#1dbb99' }}>
                    Successfully Registered. Click OK to Login
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary" style={{ color: 'white', backgroundColor: '#00aaee', fontWeight: 'bolder', marginBottom: '15px', marginRight: '15px' }}>
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
              <Button type="submit" variant="contained" style={{ width: inputWidth, height: inputHeight, backgroundColor: '#00aaee', color: 'white' }} disabled={!isFormFilled}>
                Register
              </Button>
            </Grid>
          </Grid>
          <h5>Already have an account? Please <Link to="/login">LOGIN!</Link></h5>
        </form>
      </Paper>
    </div>
  );
}
