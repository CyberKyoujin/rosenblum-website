import React from 'react';
import { Paper, Typography, Grid, Skeleton } from '@mui/material';

interface ChartWidgetProps {
  title: string;
  children: React.ReactNode;
  xs?: number;
  md?: number;
  lg?: number;
}

export default function ChartWidget({ title, children, xs = 12, md = 6, lg = 3 }: ChartWidgetProps) {

 
  return (
    <Grid item xs={xs} md={md} lg={lg}>
      

        <Paper
        
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          pt: 1,
          borderRadius: 2,
          textAlign: "center"
        }}
      >
        <Typography component="h2" variant="h6" color="black" gutterBottom>
          {title}
        </Typography>
        
        <div>
          {children}
        </div>

      </Paper>
        

    </Grid>
  );
}