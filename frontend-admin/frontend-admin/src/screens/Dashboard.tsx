import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { CiBoxList } from "react-icons/ci";
import DashboardSection from "../components/DashboardSection";
import Order from "../components/Order";
import useDashboardStore from "../zustand/useOrdersStore";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import useRequestsStore from "../zustand/useRequests";
import useOrdersStore from "../zustand/useOrdersStore";
import OrderFilter from "../components/OrderFilter";
import { BiMessageDetail } from "react-icons/bi";
import Request from "../components/Request";
import RequestsFilter from "../components/RequestFilter";


const Dashboard = () => {

    // ORDERS
    
    const orders = useOrdersStore(s => s.orders);
    const ordersLoading = useOrdersStore(s => s.loading);
    const ordersError = useOrdersStore(s => s.error);
    const fetchOrders = useOrdersStore(s => s.fetchOrders);
    const setOrdersFilters = useOrdersStore(s => s.setFilters);

    // REQUESTS

    const requests = useRequestsStore(s => s.requests);
    const requestLoading = useRequestsStore(s => s.loading);
    const requestsError = useRequestsStore(s => s.error);
    const fetchRequests = useRequestsStore(s => s.fetchRequests);
    const setRequestFilters = useRequestsStore(s => s.setFilters);

    const error = useDashboardStore(s => s.error);

    const isAtTop = useIsAtTop(5);

    return (
        <>
            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed={true}/>
    
        
           
            <div className="main-container">

                <div className="dashboard-container">


                <DashboardSection data={orders} title="Aufträge" Icon={CiBoxList} fetchData={fetchOrders} ItemComponent={Order} loading={ordersLoading} error={ordersError} setFilters={setOrdersFilters} Filter={OrderFilter}/>
                

                <DashboardSection data={requests} title="Anfragen" Icon={BiMessageDetail} fetchData={fetchRequests} ItemComponent={Request} loading={requestLoading} error={requestsError} setFilters={setRequestFilters} Filter={RequestsFilter}/>

                
                </div>
                
            </div>

        </>
    )
}


export default Dashboard