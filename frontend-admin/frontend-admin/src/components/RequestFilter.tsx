import { useState, useEffect } from 'react';
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

import { OrderFiltersParams } from '../types/order';
import FilterDropdown from './FilterDropdown';
import useRequestsStore from '../zustand/useRequests';

export const RequestsFilter = () => {

  const setFilters = useRequestsStore((s) => s.setFilters);

  const [ordering, setOrdering] = useState('-timestamp');
  const [isNew, setIsNew] = useState<boolean | null>(null);

  const fetchRequests= useRequestsStore(s => s.fetchRequests);

  const handleReset = () => {
    setOrdering('-timestamp');
    setIsNew(null);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      setFilters({ordering, isNew} as OrderFiltersParams);
      
    }, 1000);


    return () => clearTimeout(delayDebounce);
  }, [setFilters, ordering, fetchRequests, isNew]);

  return (
    <>
        <FilterDropdown title="Filter Requests" onReset={handleReset}>

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

            <FormControlLabel
                control={
                <Checkbox
                  checked={isNew ?? false}
                  onChange={(e) => setIsNew(e.target.checked)}
                />
                }
                label="Neue Anfragen"
              />
          
        </FilterDropdown>
    </>
  );
};

export default RequestsFilter