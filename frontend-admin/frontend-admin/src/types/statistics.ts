export interface BaseStatsData {
    total_orders: number;
    new_orders: number;
}

export interface StatusData {
    id: string;
    value: number;
    label: string;
}

export interface DynamicsData {
    period: string; 
    count: number;
}

export interface TypeData {
    order_type: string;
    value: number;
}

export interface GeographyData {
    city: string;
    count: number;
}

export interface GrowthData {
    period: string;
    count: number;
}

export interface ComparisonData {
    orders: { period: string; count: number }[];
    requests: { period: string; count: number }[];
}