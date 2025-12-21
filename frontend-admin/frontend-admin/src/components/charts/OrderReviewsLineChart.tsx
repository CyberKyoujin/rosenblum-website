import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo } from 'react';
import { DynamicsData } from '../../types/statistics';
import { normalizeChartData } from '../../utils/normalizeChartData';
import { ApiErrorResponse } from '../../types/error';
import ErrorView from '../ErrorView';
import CircularProgress from '@mui/material/CircularProgress';

interface OrderReviewsLineChartProps {
  orders: DynamicsData[] | undefined;
  requests: DynamicsData[] | undefined;
  loading: boolean;
  error: ApiErrorResponse | null;
}

export default function OrderReviewsLineChart({orders, requests, loading, error}: OrderReviewsLineChartProps) {

  const ordersData = useMemo(() => {
    if (!orders) return { yValues: [], xLabels: [] }; 
    return normalizeChartData(orders);
  }, [orders]); 

  const requestsData = useMemo(() => {
    if (!requests) return { yValues: [], xLabels: [] };
    return normalizeChartData(requests);
  }, [requests]);

  return (
    <Box className="chart-container">

      {loading ? (
              <CircularProgress sx={{marginBottom: "3rem"}}/>
            ) :error ? (
              <ErrorView message='Es ist ein Fehler aufgetreten.'/>
            ): (
              <LineChart
                series={[
                  { data: ordersData.yValues, label: 'Aufträge' },
                  { data: requestsData.yValues, label: 'Anfragen' },
                ]}
                xAxis={[{ scaleType: 'point', data: ordersData.xLabels }]}
                yAxis={[{ width: 50 }]}
                margin={{ right: 24 }}
              />
            )}
    </Box>
  );
}