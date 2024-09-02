import React, { useState, ChangeEvent } from 'react'
import { IUser } from '../dto/IUser'
import { Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, Paper } from '@mui/material';


export const SearchFilterBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [fabricantFilter, setFabricantFilter] = useState<string>('');
    const [productFilter, setProductFilter] = useState<string>('');
  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setSearchTerm(event.target.value);
    };
  
    const handleFabricantFilterChange = (event: SelectChangeEvent<string>): void => {
      setFabricantFilter(event.target.value);
    };
  
    const handleProductFilterChange = (event: SelectChangeEvent<string>): void => {
      setProductFilter(event.target.value);
    };
  
    // Function to handle search submission
    const handleSearch = () => {
      console.log("Searching for:", searchTerm);
      // Implement search functionality
    };
  
    // Function to apply filters
    const applyFilters = () => {
      console.log("Applying filters:", fabricantFilter, productFilter);
      // Implement filter functionality
    };
  
    return (
      <Paper sx={{ padding: 2, display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, marginRight: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
  
        <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
          <InputLabel>Fabricant</InputLabel>
          <Select
            value={fabricantFilter}
            onChange={handleFabricantFilterChange}
            label="Fabricant"
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="fabricant1">Fabricant 1</MenuItem>
            <MenuItem value="fabricant2">Fabricant 2</MenuItem>
          </Select>
        </FormControl>
  
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Products</InputLabel>
          <Select
            value={productFilter}
            onChange={handleProductFilterChange}
            label="Products"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="myProducts">Only My Products</MenuItem>
          </Select>
        </FormControl>
  
        <Button variant="contained" color="secondary" onClick={applyFilters}>
          Apply Filters
        </Button>
      </Paper>
    );
  };
  
  










// --------------------------------------------------------------------------------

interface DashboardFilteringProps {
    user: IUser;
}



const DashboardFiltering: React.FC = (user) => {
    return (
        <div>
            
        </div>
    )
}

