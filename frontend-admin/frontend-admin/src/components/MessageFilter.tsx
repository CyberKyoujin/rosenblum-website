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
import useMessages from '../zustand/useMessages';
import { MessagesFiltersParams } from '../types/message';


export const MessageFilter = () => {

  const setFilters = useMessages((state) => state.setFilters);

  const [ordering, setOrdering] = useState('-timestamp');
  const [isViewed, setIsViewed] = useState(false);

  const fetchMessages = useMessages(s => s.fetchMessages);

  const handleReset = () => {
    setOrdering('-timestamp');
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      setFilters({isViewed, ordering} as MessagesFiltersParams);

    }, 1000);


    return () => clearTimeout(delayDebounce);
  }, [setFilters, ordering, fetchMessages]);

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
                <MenuItem value="-timestamp">Datum: Neue</MenuItem>
                <MenuItem value="timestamp">Datum: Alte</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={isViewed}
                  onChange={(e) => setIsViewed(e.target.checked)}
                />
              }
              label="Gesehen"
            />

            
        </FilterDropdown>
    </>
  );
};

export default MessageFilter