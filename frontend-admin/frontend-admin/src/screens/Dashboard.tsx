import React, { useEffect, useState } from "react";
import useMainStore from "../zustand/useMainStore";
import Order from "../components/Order";
import Request from "../components/Request";
import { CiBoxList } from "react-icons/ci";
import Divider from '@mui/material/Divider';
import { useLocation, useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { BiMessageDetail } from "react-icons/bi";
import Footer from "../components/Footer";


const Dashboard = () => {

    const {isLoading, orders, requests, fetchOrders, fetchRequests } = useMainStore();
    const [message, setMessage] = useState<string | null>(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        fetchOrders(); 
        fetchRequests();

        if (location.state?.message) {

            setMessage(location.state.message);

            const timer = setTimeout(() => {
                setMessage(null); 
                navigate(location.pathname, { replace: true, state: {} });
            }, 3000);

            return () => clearTimeout(timer); 
        }

    }, [location.state, fetchOrders, fetchRequests, location.pathname, navigate]);

    return (
        <>
    
            <div className={message ? "success-notification-container show-notification" : "success-notification-container"}>
                <Alert severity="success">{message}</Alert>
            </div>
           
            <div className="main-container">

                <div className="dashboard-title-orders">
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
                        {orders?.map(order => 
                        <Order 
                        id={order.id} 
                        name={order.name} 
                        timestamp={order.formatted_timestamp} 
                        status={order.status} 
                        is_new={order.new }
                        />)}
                    </div>

                )}

                <div className="dashboard-title-requests">
                    <BiMessageDetail style={{fontSize: '40px', color: 'RGB(76 121 212)'}}/>
                    <h1 style={{marginTop: '0.1rem'}}>Anfragen </h1>
                </div>

                <Divider style={{marginTop: '1.5rem'}}/>

                {isLoading ? (

                    <div className="spinner-container">
                        <CircularProgress style={{width: 50, height: 50, marginTop: "10rem"}}/>
                    </div>
                    
                ) : (

                    <div className="dashboard-orders-container">
                        {requests?.map(request => 
                        <Request 
                        id={request.id} 
                        name={request.name} 
                        email={request.email}
                        phone_number={request.phone_number}
                        message={request.message}
                        formatted_timestamp={request.formatted_timestamp}
                        />)}
                    </div>

                )}
                
            
            </div>

            <Footer/>

        </>
    )
}


export default Dashboard