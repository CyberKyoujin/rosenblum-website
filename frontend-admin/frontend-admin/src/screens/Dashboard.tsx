import React, { useEffect, useState } from "react";
import useMainStore from "../zustand/useMainStore";
import Order from "../components/Order";
import { CiBoxList } from "react-icons/ci";
import Divider from '@mui/material/Divider';
import { useLocation } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';


const Dashboard = () => {

    const {isLoading, orders, fetchOrders } = useMainStore();

    const [ordersData, setOrdersData] = useState();

    const location = useLocation();

    useEffect(() => {
        fetchOrders(); 
        if (location.state?.message) {
            fetchOrders(); 
        }
    }, [location.state, fetchOrders]);

    return (
        <div className="main-container">
            <div className="dashboard-title">
                <CiBoxList style={{fontSize: '40px', color: 'RGB(76 121 212)'}}/>
                <h1 style={{marginTop: '0.1rem'}}>Aufträge </h1>
            </div>
            
            <Divider style={{marginTop: '1.5rem'}}/>
            {isLoading ? (
                <div className="spinner-container">
                    <CircularProgress style={{width: 50, height: 50, marginTop: "10rem"}}/>
                </div>
            ) : (
                <div className="dashboard-orders-container">
                    {orders?.map(order => <Order id={order.id} name={order.name} timestamp={order.formatted_timestamp} status={order.status} is_new={order.new }/>)}
                </div>
            )}
            
        
        </div>
    )
}


export default Dashboard