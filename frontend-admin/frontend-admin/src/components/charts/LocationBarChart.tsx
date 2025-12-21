import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import { GeographyData } from '../../types/statistics';
import { useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import { ApiErrorResponse } from '../../types/error';
import ErrorView from '../ErrorView';

interface LocationBarChartProps {
  data: GeographyData[];
  loading: boolean;
  error: ApiErrorResponse | null;
}


export default function LocationBarChart({data, loading, error}: LocationBarChartProps) {

  const {xLabels, yValues} = useMemo(() => {

    if (!data || data.length === 0) {
        return { xLabels: [], yValues: [] };
    }
    const geographyData = data.slice(0,5);

    const xLabels = geographyData.map((item) => item.city);

    const yValues = geographyData.map((item) => item.count);

    return {xLabels, yValues}

  }, [data])

  return (
    <Box className="chart-container">
      {loading ? (
        <CircularProgress sx={{marginBottom: "3rem"}}/>
      ) :error ? (
        <ErrorView message='Es ist ein Fehler aufgetreten.'/>
      ): (
        <BarChart
        series={[
          { data: yValues, label: 'Kunden', id: 'pvId', color: "#4C79D4"},

        ]}
        xAxis={[{ data: xLabels }]}
        yAxis={[{ width: 50 }]}
      />
      )}
    </Box>
  );
}