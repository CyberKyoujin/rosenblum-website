import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import Divider from '@mui/material/Divider';
import useOrdersStore from "../zustand/useOrdersStore";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import ErrorView from "../components/ErrorView";
import OrderDeleteNotification from "../components/OrderDeleteNotification";
import OrderDetailsButtonGroup from "../components/OrderDetailsButtonGroup";
import OrderDetailsItem from "../components/OrderDetailsItem";
import { useOrderDetails } from "../hooks/useOrderDetails";
import ComponentLoading from "../components/ComponentLoading";

const OrderDetails = () => {

    const { orderId } = useParams();
    const formattedOrderId = Number(orderId);

    const orderData = useOrdersStore(s => s.order);
    const loading = useOrdersStore(s => s.loading);
    const error  = useOrdersStore(s => s.error);

    const fetchOrder = useOrdersStore(s => s.fetchOrder);
    const deleteOrder = useOrdersStore(s => s.deleteOrder);
    const updateOrder = useOrdersStore(s => s.updateOrder);

    const isAtTop = useIsAtTop(5);

    const {
        formActive,
        setFormActive,
        status,
        setStatus,
        orderType,
        setOrderType,
        notificationOpen,
        setNotificationOpen,
        fetchUserOrder,
        handleSubmit,
        handleDelete
        } = useOrderDetails(orderData, fetchOrder, formattedOrderId, updateOrder, deleteOrder);


    useEffect(() => {

        fetchUserOrder(); 

    }, []);

    return(
        <>

            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed/>

            
            <div className="order-details">


                <form onSubmit={handleSubmit}>

                    <div className="order-details-container">

                        <OrderDeleteNotification notificationOpen={notificationOpen} setNotificationOpen={setNotificationOpen} handleDelete={handleDelete}/>

                        <div className="order-details-title">

                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>

                                <FaFileAlt className="order-details-icon"/>
                                
                                <h1>Auftragsübersicht</h1>
                            
                            </div>

                            <OrderDetailsButtonGroup formActive={formActive} setFormActive={setFormActive} setNotificationOpen={setNotificationOpen}/>
                            
                        </div>

                        <Divider orientation="horizontal" style={{marginTop: '1.5rem'}}/>

                        {loading ? (

                            <ComponentLoading/>

                        ) : error ? (

                            <ErrorView/>

                        ) : (

                            <OrderDetailsItem orderType={orderType} setOrderType={setOrderType} orderData={orderData} status={status} setStatus={setStatus} formActive={formActive}/>

                        )}


                    </div>

                </form>
                
            </div>
            
        </>
    )
}


export default OrderDetails;