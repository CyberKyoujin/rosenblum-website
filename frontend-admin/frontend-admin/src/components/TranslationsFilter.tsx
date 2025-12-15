import React, { useEffect, useState } from 'react';
import FilterDropdown from './FilterDropdown';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import useTranslations from '../zustand/useTranslations';
import { TranslationFiltersParams } from '../types/translation';

const TranslationsFilter = () => {

    const setFilters = useTranslations((s) => s.setFilters);

    const [ordering, setOrdering] = useState('-timestamp');

    const fetchRequests= useTranslations(s => s.fetchTranslations);

    const handleReset = () => {
        setOrdering('-timestamp');
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {

        setFilters({ordering} as TranslationFiltersParams);
        
        }, 1000);


        return () => clearTimeout(delayDebounce);
    }, [setFilters, ordering, fetchRequests]);
  
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
                <MenuItem value="-timestamp">Datum: Neue</MenuItem>
                <MenuItem value="timestamp">Datum: Alte</MenuItem>
              </Select>
            </FormControl>
            
        </FilterDropdown>
    </>
    );
}

export default TranslationsFilter;
