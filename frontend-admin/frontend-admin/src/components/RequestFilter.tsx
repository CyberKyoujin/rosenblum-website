import { useState, useEffect } from 'react';
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

import { OrderFiltersParams } from '../types/order';
import FilterDropdown from './FilterDropdown';
import useRequestsStore from '../zustand/useRequests';


export const RequestsFilter = () => {

  const setFilters = useRequestsStore((state) => state.setFilters);

  const [ordering, setOrdering] = useState('-timestamp');

  const fetchRequests= useRequestsStore(s => s.fetchRequests);

  const handleReset = () => {
    setOrdering('-timestamp');
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      setFilters({ordering} as OrderFiltersParams);

      fetchRequests();
    }, 1000);


    return () => clearTimeout(delayDebounce);
  }, [setFilters, ordering, fetchRequests]);

  return (
    <>
        <FilterDropdown title="Filter Requests" onReset={handleReset}>

            {/* 3. Сортировка */}
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={ordering}
                label="Sort By"
                onChange={(e) => setOrdering(e.target.value)}
              >
                <MenuItem value="-timestamp">Date: Newest first</MenuItem>
                <MenuItem value="timestamp">Date: Oldest first</MenuItem>
              </Select>
            </FormControl>
            
        </FilterDropdown>
    </>
  );
};

export default RequestsFilter