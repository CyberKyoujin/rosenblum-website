import { BarChart } from '@mui/x-charts/BarChart';
import { TypeData } from '../../types/statistics';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { ApiErrorResponse } from '../../types/error';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorView from '../ErrorView';

interface OrderBarChartProps {
  data: TypeData[];
  loading: boolean;
  error: ApiErrorResponse | null;
}

export default function OrdersBarChart({ data, loading, error }: OrderBarChartProps) {

  const { xLabels, yValues } = useMemo(() => {
    
    if (!data || data.length === 0) {
        return { xLabels: [], yValues: [] };
    }

    const xLabels = data.map((item) => {
        if (item.order_type === 'costs_estimate') return 'KV';
        if (item.order_type === 'order') return 'Auftrag';
        return item.order_type;
    });

    const yValues = data.map((item) => item.value);

    return { xLabels, yValues };
  }, [data]);

  return (
    <Box className="chart-container">

        {loading ? (
              <CircularProgress sx={{marginBottom: "3rem"}}/>
            ) :error ? (
              <ErrorView message='Es ist ein Fehler aufgetreten.'/>
            ): (
              <BarChart

                xAxis={[{ 
                    scaleType: 'band', 
                    data: xLabels 
                }]}
    

                series={[{ 
                    data: yValues, 
                    color: '#4C79D4', 
                    label: 'Menge' 
                }]}

                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
              />
            )}
    </Box>
  );
}