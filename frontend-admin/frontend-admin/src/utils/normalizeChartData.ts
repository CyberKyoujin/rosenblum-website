import { DynamicsData } from "../types/statistics";


export const normalizeChartData = (data: DynamicsData[]) => {
    
    if (!data || data.length === 0) {
        return { xLabels: [], yValues: [] };
    }

    const xLabels = data.map(item => {
        const date = new Date(item.period);
        return date.toLocaleDateString('de-DE', { month: 'short', year: '2-digit' });
    });
    const yValues = data.map(item => item.count);

    return { xLabels, yValues };
};

  