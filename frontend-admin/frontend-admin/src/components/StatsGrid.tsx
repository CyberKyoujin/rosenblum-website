import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

interface StatsGridProps {
  children: React.ReactNode;
}

export default function StatsGrid({ children }: StatsGridProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {children}
      </Grid>
    </Box>
  );
}