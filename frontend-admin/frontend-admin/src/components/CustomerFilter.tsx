import { useState, useEffect } from 'react';
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import FilterDropdown from './FilterDropdown';
import useCustomersStore from '../zustand/useCustomers';
import { CustomerFiltersParams } from '../types/customer';


export const CustomerFilter = () => {

  const setFilters = useCustomersStore((state) => state.setFilters);

  const [ordering, setOrdering] = useState('-date_joined');

  const fetchCustomers = useCustomersStore(s => s.fetchCustomers);

  const handleReset = () => {
    setOrdering('-date_joined');
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      setFilters({ordering} as CustomerFiltersParams);

    }, 1000);


    return () => clearTimeout(delayDebounce);
  }, [setFilters, ordering, fetchCustomers]);

  return (
    <>
        <FilterDropdown title="Filter Orders" onReset={handleReset}>

            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={ordering}
                label="Sort By"
                onChange={(e) => setOrdering(e.target.value)}
              >
                <MenuItem value="-date_joined">Datum: Neue</MenuItem>
                <MenuItem value="date_joined">Datum: Alte</MenuItem>
              </Select>
            </FormControl>

            
        </FilterDropdown>
    </>
  );
};

export default CustomerFilter