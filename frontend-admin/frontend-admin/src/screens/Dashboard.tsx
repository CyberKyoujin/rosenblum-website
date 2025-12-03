import { useEffect, useState } from "react";
import { CiBoxList } from "react-icons/ci";
import Divider from '@mui/material/Divider';
import { useLocation, useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { BiMessageDetail } from "react-icons/bi";
import DashboardSection from "../components/DashboardSection";
import useMainStore from "../zustand/useMainStore";
import Order from "../components/Order";
import Request from "../components/Request";

const Dashboard = () => {

    const [message, setMessage] = useState<string | null>(null);

    const orders = useMainStore(s => s.orders);
    const requests = useMainStore(s => s.requests);
    const fetchOrders = useMainStore(s => s.fetchOrders);
    const fetchRequests = useMainStore(s => s.fetchRequests);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        if (location.state?.message) {

            setMessage(location.state.message);

            const timer = setTimeout(() => {
                setMessage(null); 
                navigate(location.pathname, { replace: true, state: {} });
            }, 3000);

            return () => clearTimeout(timer); 
        }

    }, [location.state, location.pathname, navigate]);

    return (
        <>
    
            <div className={message ? "success-notification-container show-notification" : "success-notification-container"}>
                <Alert severity="success">{message}</Alert>
            </div>
           
            <div className="main-container">

                <div className="dashboard-container">

                

                <section className="dashboard__orders-container">

                    <div className="dashboard-title-orders">
                        <CiBoxList style={{fontSize: '40px', color: 'RGB(76 121 212)'}}/>
                        <h1 style={{marginTop: '0.1rem'}}>Aufträge </h1>
                    </div>
                    
                    <Divider style={{marginTop: '1.5rem'}}/>

                    <DashboardSection data={orders} fetchData={fetchOrders} ItemComponent={Order}/>
                </section>

                <section className="dashboard__requests-container">

                    <div className="dashboard-title-requests">
                        <BiMessageDetail style={{fontSize: '40px', color: 'RGB(76 121 212)'}}/>
                        <h1 style={{marginTop: '0.1rem'}}>Anfragen </h1>
                    </div>

                    <Divider style={{marginTop: '1.5rem'}}/>

                    <DashboardSection data={requests} fetchData={fetchRequests} ItemComponent={Request}/>

                </section>
                </div>
                
            </div>

        

        </>
    )
}


export default Dashboard