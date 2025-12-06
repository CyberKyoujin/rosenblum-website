import React, { useState, useEffect, Children } from 'react';
import {
  Popover,
  Button,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Stack,
  IconButton,
  Typography,
  Divider
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { IoFilter } from "react-icons/io5";
import useOrdersStore from '../zustand/useOrdersStore';
import { OrderFiltersParams } from '../types/order';

interface FilterDropdownProps {
  title?: string;
  onReset?: () => void;
  children: React.ReactNode; // Сюда прилетят твои инпуты
}

export const FilterDropdown = ({title="Filters", onReset, children}: FilterDropdownProps) => {
  
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
 
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  return (
    <>
      <Button
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
        sx={{ display: "flex", alignItems: "center" }}
        className='btn'
      >
        <IoFilter size={25}/>
      </Button>


      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right', 
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >

        <Box sx={{ p: 3, width: 320 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Filter Orders</Typography>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
          
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>

           {children}
            
            {onReset && (
               <Button variant="text" size="small" color="error" onClick={onReset} sx={{ alignSelf: 'flex-start' }}>
                  Reset Filters
               </Button>
            )}

          </Stack>
        </Box>
      </Popover>
    </>
  );
};

export default FilterDropdown