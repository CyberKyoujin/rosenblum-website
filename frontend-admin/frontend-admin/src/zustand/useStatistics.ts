import { create } from 'zustand';
import axiosInstance from "./axiosInstance"
import { toApiError } from '../utils/toApiError';
import { ApiErrorResponse } from '../types/error';
import { BaseStatsData, ComparisonData, DynamicsData, GeographyData, GrowthData, StatusData, TypeData } from '../types/statistics';

interface StatsState {
    
    baseStats: BaseStatsData | null;
    statusData: StatusData[];
    dynamicsData: DynamicsData[];
    typeData: TypeData[];
    geographyData: GeographyData[];
    growthData: GrowthData[];
    comparisonData: ComparisonData | null;

    isBaseLoading: boolean;
    isStatusLoading: boolean;
    isDynamicsLoading: boolean;
    isTypeLoading: boolean;
    isGeographyLoading: boolean;
    isGrowthLoading: boolean;
    isComparisonLoading: boolean;

    baseError: ApiErrorResponse | null;
    statusError: ApiErrorResponse | null;
    dynamicsError: ApiErrorResponse | null;
    typeError: ApiErrorResponse | null;
    geographyError: ApiErrorResponse | null;
    growthError: ApiErrorResponse | null;
    comparisonError: ApiErrorResponse | null;

    fetchBaseStats: () => Promise<void>;
    fetchStatusStats: () => Promise<void>;
    fetchDynamicsStats: () => Promise<void>;
    fetchTypeStats: () => Promise<void>;
    fetchGeographyStats: () => Promise<void>;
    fetchGrowthStats: () => Promise<void>;
    fetchComparisonStats: () => Promise<void>;

    fetchAllStats: () => void;
}

const useStatistics = create<StatsState>((set, get) => ({
    
    baseStats: null,
    statusData: [],
    dynamicsData: [],
    typeData: [],
    geographyData: [],
    growthData: [],
    comparisonData: null,

    isBaseLoading: false,
    isStatusLoading: false,
    isDynamicsLoading: false,
    isTypeLoading: false,
    isGeographyLoading: false,
    isGrowthLoading: false,
    isComparisonLoading: false,

    baseError: null,
    statusError: null,
    dynamicsError: null,
    typeError: null,
    geographyError: null,
    growthError: null,
    comparisonError: null,

    fetchBaseStats: async () => {
        set({ isBaseLoading: true, baseError: null });
        try {
            const res = await axiosInstance.get<BaseStatsData>('/statistics/');
            set({ baseStats: res.data, isBaseLoading: false });
        } catch (error) {
            set({ baseError: toApiError(error), isBaseLoading: false });
        }
    },

    fetchStatusStats: async () => {
        set({ isStatusLoading: true, statusError: null });
        try {
            const res = await axiosInstance.get<StatusData[]>('/statistics/status-distribution/');
            set({ statusData: res.data, isStatusLoading: false });
        } catch (error) {
            set({ statusError: toApiError(error), isStatusLoading: false });
        }
    },

    fetchDynamicsStats: async () => {
        set({ isDynamicsLoading: true, dynamicsError: null });
        try {
            const res = await axiosInstance.get<DynamicsData[]>('/statistics/ordering-dynamics/');
            set({ dynamicsData: res.data, isDynamicsLoading: false });
        } catch (error) {
            set({ dynamicsError: toApiError(error), isDynamicsLoading: false });
        }
    },

    fetchTypeStats: async () => {
        set({ isTypeLoading: true, typeError: null });
        try {
            const res = await axiosInstance.get<TypeData[]>('/statistics/type-distribution/');
            set({ typeData: res.data, isTypeLoading: false });
        } catch (error) {
            set({ typeError: toApiError(error), isTypeLoading: false });
        }
    },

    fetchGeographyStats: async () => {
        set({ isGeographyLoading: true, geographyError: null });
        try {
            const res = await axiosInstance.get<GeographyData[]>('/statistics/customers-geography/');
            set({ geographyData: res.data, isGeographyLoading: false });
        } catch (error) {
            set({ geographyError: toApiError(error), isGeographyLoading: false });
        }
    },

    fetchGrowthStats: async () => {
        set({ isGrowthLoading: true, growthError: null });
        try {
            const res = await axiosInstance.get<GrowthData[]>('/statistics/customers-growth/');
            set({ growthData: res.data, isGrowthLoading: false });
        } catch (error) {
            set({ growthError: toApiError(error), isGrowthLoading: false });
        }
    },

    fetchComparisonStats: async () => {
        set({ isComparisonLoading: true, comparisonError: null });
        try {
            const res = await axiosInstance.get<ComparisonData>('/statistics/order-request-comparison/');
            set({ comparisonData: res.data, isComparisonLoading: false });
        } catch (error) {
            set({ comparisonError: toApiError(error), isComparisonLoading: false });
        }
    },

    fetchAllStats: () => {
        const {
            fetchBaseStats,
            fetchStatusStats,
            fetchDynamicsStats,
            fetchTypeStats,
            fetchGeographyStats,
            fetchGrowthStats,
            fetchComparisonStats
        } = get();

        fetchBaseStats();
        fetchStatusStats();
        fetchDynamicsStats();
        fetchTypeStats();
        fetchGeographyStats();
        fetchGrowthStats();
        fetchComparisonStats();
    }
}));

export default useStatistics;