import { useState, useEffect } from 'react';
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import useOrdersStore from '../zustand/useOrdersStore';
import { OrderFiltersParams } from '../types/order';
import FilterDropdown from './FilterDropdown';


export const OrderFilter = () => {

  const setFilters = useOrdersStore((state) => state.setFilters);

  const [status, setStatus] = useState('');
  const [ordering, setOrdering] = useState('-timestamp');
  const [isNew, setIsNew] = useState(false);

  const fetchOrders = useOrdersStore(s => s.fetchOrders);

  const handleReset = () => {
    setStatus('');
    setOrdering('-timestamp');
    setIsNew(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      setFilters({status, isNew, ordering} as OrderFiltersParams);

    }, 1000);


    return () => clearTimeout(delayDebounce);
  }, [setFilters, status, isNew, ordering, fetchOrders]);

  return (
    <>
        <FilterDropdown title="Filter Orders" onReset={handleReset}>
            
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value=""><em>Alle</em></MenuItem>
                <MenuItem value="review">In Bearbeitung</MenuItem>
                <MenuItem value="in_progress">Wird ausgeführt</MenuItem>
                <MenuItem value="completed">Fertig</MenuItem>
                <MenuItem value="ready_pick_up">Abholbereit</MenuItem>
                <MenuItem value="sent">Versandt</MenuItem>
                <MenuItem value="canceled">Storniert</MenuItem>
              </Select>
            </FormControl>

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
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                />
              }
              label="Neue Aufträge"
            />
            
        </FilterDropdown>
    </>
  );
};

export default OrderFilter