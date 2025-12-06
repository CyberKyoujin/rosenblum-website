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

      fetchOrders();
    }, 1000);


    return () => clearTimeout(delayDebounce);
  }, [setFilters, status, isNew, ordering, fetchOrders]);

  return (
    <>
        <FilterDropdown title="Filter Orders" onReset={handleReset}>
            {/* 2. Статус */}
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value=""><em>All Statuses</em></MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
              </Select>
            </FormControl>

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

            {/* 4. Чекбокс New */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                />
              }
              label="Show only NEW orders"
            />
            
        </FilterDropdown>
    </>
  );
};

export default OrderFilter