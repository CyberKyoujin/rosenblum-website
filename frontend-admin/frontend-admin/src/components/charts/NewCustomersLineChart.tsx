import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { normalizeChartData } from '../../utils/normalizeChartData';
import { DynamicsData } from '../../types/statistics';
import { useMemo } from 'react';
import ErrorView from '../ErrorView';
import { CircularProgress } from '@mui/material';
import { ApiErrorResponse } from '../../types/error';

interface NewCustomersLineChartProps {
  data: DynamicsData[];
  loading: boolean;
  error: ApiErrorResponse | null;
}

export default function NewCustomersLineChart({data, loading, error}: NewCustomersLineChartProps) {


  const {xLabels, yValues} = useMemo(() => {

    return normalizeChartData(data);

  }, [data])

  return (
    <Box className="chart-container">
      

      {loading ? (
              <CircularProgress sx={{marginBottom: "3rem"}}/>
            ) :error ? (
              <ErrorView message='Es ist ein Fehler aufgetreten.' statsError/>
            ): (
              <LineChart
                series={[
                  { data: yValues, label: 'Neue Kunden' },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                yAxis={[{ width: 50 }]}
                margin={{ right: 24 }}
              />
      )}
    </Box>
  );
}