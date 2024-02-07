import React, { useState } from 'react'
import { TextField, MenuItem, Button, FormControl, InputLabel, Select, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import './BodyStyles.css'


export default function Registration() {

  const [formData, setFormData] = useState({
    Empid: '',
    Empmail: '',
    Firstname: '',
    Lastname: '',
    Role: '',
    Practies: '',
    Reportingmanager: '',
    Password: '',
    Reportinghr: '',
    Location: '',
    Image: null,
  })
  const roles = ['Employee', 'HR', 'Manager', 'Director', 'Vice President'];
  const practices = ['Digital Practice', 'Innovations', 'B2B', 'Integrations', 'Spring Boot', 'Cloud and DevOps'];
  const managers = ['John Vesli Chitri', 'Vinod Marupu', 'Ravi Ijju', 'Venkata Ram Prasad Kandregula', 'Santosh Soni', 'Prasad Venkat Lokam'];
  const hr = ['Divya Abburi', 'Sruthi Kolli', 'Lohitha Bandi', 'Ajay Duvvu', 'PadmaPriya Kamsu', 'Vasu Varupula', 'Chandini Sigireddy'];
  const location = ['Miracle City', 'Miracle Heights', 'Miracle Valley', 'Novi USA'];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      Image: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };


  return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor:'' }}>
        <Paper style={{ padding: '24px', width:'50vw',  }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="Empid"
                  label="Empid"
                  value={formData.Empid}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="Empmail"
                  label="Empmail"
                  value={formData.Empmail}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="Firstname"
                  label="Firstname"
                  value={formData.Firstname}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="Lastname"
                  label="Lastname"
                  value={formData.Lastname}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="Password"
                  label="Password"
                  type="password"
                  value={formData.Password}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="Role"
                    value={formData.Role}
                    onChange={handleChange}
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
                    value={formData.Location}
                    onChange={handleChange}
                  >
                    {location.map((location, index) => (
                      <MenuItem key={index} value={location}>{location}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  id="contained-button-file"
                  multiple
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color="primary" component="span">
                    Upload Image
                  </Button>
                </label>
                {formData.Image && <span>{formData.Image.name}</span>}
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
            <h5>Already have an account? Please <Link to="/login">LOGIN!</Link></h5>
          </form>
        </Paper>
      </div>
    );
}
