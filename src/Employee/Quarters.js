
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Quarters() {
  const [quarter, setQuarter] = React.useState('');

  const handleChange = (event) => {
    setQuarter(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Quarter</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={quarter}
          label="Quarter"
          onChange={handleChange}
        >
          <MenuItem value={10}>Quarter1</MenuItem>
          <MenuItem value={20}>Quarter2</MenuItem>
          <MenuItem value={30}>Quarter3</MenuItem>
          <MenuItem value={40}>Quarter4</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}