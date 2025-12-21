import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
import { StatusData } from '../../types/statistics';
import { ApiErrorResponse } from '../../types/error';
import ErrorView from '../ErrorView';

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

interface OrderStatusPieChartProps{
    data: StatusData[];
    loading: boolean;
    error: ApiErrorResponse | null;
}

export default function OrderStatusPieChart({data, loading, error}: OrderStatusPieChartProps) {
  return (
    <Box className="chart-container">

    {loading ? (
              <CircularProgress sx={{marginBottom: "3rem"}}/>
            ) :error ? (
              <ErrorView message='Es ist ein Fehler aufgetreten.' statsError/>
            ): (
              <PieChart series={[{ data, innerRadius: 80 }]}>
                <PieCenterLabel>Status</PieCenterLabel>
              </PieChart>
            )}
    </Box>
  );
}