import React, { useState, ChangeEvent, useContext, useEffect } from 'react'
import { IUser } from '../dto/IUser'
import { Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, Paper } from '@mui/material';
import { FilterContext } from '../FilterContext';

interface SearchFilterBarProps {
  jsmePopup: boolean;
  setJsmePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({jsmePopup, setJsmePopup}) => {
    const { filter, setFilter } = useContext(FilterContext);
    const [searchTerm, setSearchTerm] = useState<string>(filter?.search_bar || '');
    const [fabricantFilter, setFabricantFilter] = useState<string>(filter?.fabricant || '');
    const [productFilter, setProductFilter] = useState<string>(filter?.product_type || 'cas_number');
  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setSearchTerm(event.target.value);
      // console.log("entered search term")
      // if (!filter) {
      //   setFilter({
      //     search_bar: event.target.value,
      //     fabricant: fabricantFilter,
      //     product_type: productFilter,
      //     });
      //     console.log("new filter created", filter)
      // }else{
      //   setFilter({
      //     ...filter,
      //     search_bar: event.target.value,
      //     });
      // }
      // console.log("filter is", filter)
    };
  
    const handleFabricantFilterChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setFabricantFilter(event.target.value);
      // if (!filter) {
      //   setFilter({
      //     search_bar: searchTerm,
      //     fabricant: event.target.value,
      //     product_type: productFilter,
      //     });
      // }else {
      //   setFilter({
      //     ...filter,
      //     fabricant: event.target.value,
      //     });
      // }
    };
  
    const handleProductFilterChange = (event: SelectChangeEvent<string>): void => {
      setProductFilter(event.target.value);
      // if (!filter) {
      //   setFilter({
      //     search_bar: searchTerm,
      //     fabricant: fabricantFilter,
      //     product_type: event.target.value,
      //     });
      // } else {
      //   setFilter({
      //     ...filter,
      //     product_type: event.target.value,
      //     });
      // }
    };
  
    // Function to handle search submission
    const handleSearch = () => {
      console.log("Searching for:", searchTerm);
      // Implement search functionality
      setFilter({
        search_bar: searchTerm,
        fabricant: fabricantFilter,
        product_type: productFilter,
        });
    };

    useEffect(() => {
      setSearchTerm(filter?.search_bar || '');
      setProductFilter(filter?.product_type || 'name');
    }, [filter]);
  
    // Function to apply filters
    const applyFilters = () => {
      console.log("Applying filters:", fabricantFilter, productFilter);
      // Implement filter functionality
    };

    const popUp = () => {
      setJsmePopup(!jsmePopup)
    };
  
    return (
      <Paper sx={{ padding: 2, display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
        <Button variant="contained" color="secondary" onClick={popUp}>
          JSME
        </Button>
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 3, marginRight: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>

        <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
          <InputLabel>Search By</InputLabel>
          <Select
            value={productFilter}
            onChange={handleProductFilterChange}
            label="Type"
          >
            <MenuItem value="cas_number">CAS Number</MenuItem>
            <MenuItem value="formula">Formula</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="smiles">SMILES</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Filter by Fabricant"
          variant="outlined"
          value={fabricantFilter}
          onChange={handleFabricantFilterChange}
          sx={{ flexGrow: 1, marginRight: 2 }}
        />
  
        {/* <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
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
        </FormControl> */}
  
        {/* <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Products</InputLabel>
          <Select
            value={productFilter}
            onChange={handleProductFilterChange}
            label="Products"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="myProducts">Only My Products</MenuItem>
          </Select>
        </FormControl> */}
  
        {/* <Button variant="contained" color="secondary" onClick={applyFilters}>
          Apply Filters
        </Button> */}
      </Paper>
    );
  };
  
  










// --------------------------------------------------------------------------------

