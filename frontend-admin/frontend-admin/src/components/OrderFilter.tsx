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
  const [isNew, setIsNew] = useState<boolean | null>(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentType, setPaymentType] = useState('');

  const fetchOrders = useOrdersStore(s => s.fetchOrders);

  const handleReset = () => {
    setStatus('');
    setOrdering('-timestamp');
    setIsNew(null);
    setPaymentStatus('');
    setPaymentType('');
  };


  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      setFilters({status, isNew, ordering, payment_status: paymentStatus, payment_type: paymentType} as OrderFiltersParams);

    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [setFilters, status, isNew, ordering, paymentStatus, paymentType, fetchOrders]);

  

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

            <FormControl fullWidth size="small">
              <InputLabel>Zahlungsstatus</InputLabel>
              <Select
                value={paymentStatus}
                label="Zahlungsstatus"
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <MenuItem value=""><em>Alle</em></MenuItem>
                <MenuItem value="paid">Bezahlt</MenuItem>
                <MenuItem value="not_paid">Nicht bezahlt</MenuItem>
                <MenuItem value="payment_pending">Ausstehend</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Zahlungsart</InputLabel>
              <Select
                value={paymentType}
                label="Zahlungsart"
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <MenuItem value=""><em>Alle</em></MenuItem>
                <MenuItem value="rechnung">Rechnung</MenuItem>
                <MenuItem value="stripe">Online-Zahlung</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={isNew ?? false}
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