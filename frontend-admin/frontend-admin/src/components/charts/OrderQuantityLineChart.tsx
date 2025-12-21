import Box from '@mui/material/Box';
import { LineChart, MarkElementProps } from '@mui/x-charts/LineChart';
import { DynamicsData } from '../../types/statistics';
import { useCallback, useMemo } from 'react';
import { normalizeChartData } from '../../utils/normalizeChartData';
import { ApiErrorResponse } from '../../types/error';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorView from '../ErrorView';


interface OrderQuantityLineChartProps {
  data: DynamicsData[];
  loading: boolean;
  error: ApiErrorResponse | null;
}

export default function OrderQuantityLineChart({data, loading, error}: OrderQuantityLineChartProps) {

  const {xLabels, yValues} = useMemo(() => {

    return normalizeChartData(data);

  }, [data])

  const CustomMark = useCallback((props: MarkElementProps) => {

        const { x, y, color, dataIndex } = props;
        
        const value = yValues[dataIndex];

        return (
            <g>
                <circle cx={x} cy={y} r={5} fill={color || '#000000ff'} stroke="white" strokeWidth={2} />
                <text
                    x={x}
                    y={Number(y) - 15} 
                    style={{
                        textAnchor: 'middle',
                        dominantBaseline: 'auto',
                        fontWeight: 'bold',
                        fontSize: 12,
                        pointerEvents: 'none' 
                    }}
                >
                    {value}
                </text>
            </g>
        );
    }, [yValues]);

  return (
        <Box className="chart-container">
            
            {loading ? (
                
                <CircularProgress sx={{marginBottom: "3rem"}}/>
                ) :error ? (
                <ErrorView message='Es ist ein Fehler aufgetreten.'/>
                ): (
                <LineChart
                series={[
                    { 
                        data: yValues, 
                        color: '#4C79D4',
                        area: true, 
                    }
                ]}
                xAxis={[{ 
                    scaleType: 'point', 
                    data: xLabels 
                }]}
                yAxis={[{ 
                    min: 0, 
                }]}
                margin={{right: 25}}
                slots={{
                    mark: CustomMark,
                }}
            />
                  )}
            
        </Box>
  );

}