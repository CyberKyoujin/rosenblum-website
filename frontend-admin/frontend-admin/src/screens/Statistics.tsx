import Divider from '@mui/material/Divider';
import React, { useEffect } from 'react';
import { FaChartBar } from 'react-icons/fa';
import StatsGrid from '../components/StatsGrid';
import ChartWidget from '../components/ChartWidget';
import OrderStatusPieChart from '../components/charts/OrderStatusPieChart';
import OrderQuantityLineChart from '../components/charts/OrderQuantityLineChart';
import OrdersBarChart from '../components/charts/OrdersBarChart';
import LocationBarChart from '../components/charts/LocationBarChart';
import NewCustomersLineChart from '../components/charts/NewCustomersLineChart';
import OrderReviewsLineChart from '../components/charts/OrderReviewsLineChart';
import useStatistics from '../zustand/useStatistics';
import ApiErrorAlert from '../components/ApiErrorAlert';
import { useIsAtTop } from '../hooks/useIsAtTop';


const Statistics = () => {

    const store = useStatistics();

    const isAtTop = useIsAtTop(5);

    useEffect(() => {
        store.fetchAllStats()
    }, [])

    return (
        <main className='main-container'>

            <ApiErrorAlert error={store.baseError} belowNavbar={isAtTop} fixed/>

            <article className='app-statistics-container'>

                <section className='statistics-title'>
                    <FaChartBar size={45} className='app-icon'/>
                    <h1>Statistik</h1>
                </section>

                <Divider/>

                <StatsGrid>

                    <ChartWidget title='Aufträge'>
                        <OrderStatusPieChart data={store.statusData} loading={store.isStatusLoading} error={store.statusError}/>
                    </ChartWidget>

                    <ChartWidget title='Aufträge (Menge)'>
                        <OrderQuantityLineChart data={store.dynamicsData} loading={store.isDynamicsLoading} error={store.dynamicsError}/>
                    </ChartWidget>

                    <ChartWidget title='KV vs. Auftrag'>
                        <OrdersBarChart data={store.typeData} loading={store.isTypeLoading} error={store.typeError}/>
                    </ChartWidget>

                    <ChartWidget title='Ort'>
                        <LocationBarChart data={store.geographyData} loading={store.isGeographyLoading} error={store.geographyError}/>
                    </ChartWidget>

                    <ChartWidget title='Neue Kunden'>
                        <NewCustomersLineChart data={store.growthData} loading={store.isGrowthLoading} error={store.growthError}/>
                    </ChartWidget>

                    <ChartWidget title='Anfragen vs. Aufträge'>
                        <OrderReviewsLineChart orders={store.comparisonData?.orders} requests={ store.comparisonData?.requests} loading={store.isComparisonLoading} error={store.comparisonError}/>
                    </ChartWidget>

                </StatsGrid>

            </article>
            
        </main>
    );
}

export default Statistics;
