import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useOrdersStore from "../zustand/useOrdersStore";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import ErrorView from "../components/ErrorView";
import OrderDeleteNotification from "../components/OrderDeleteNotification";
import OrderDetailsButtonGroup from "../components/OrderDetailsButtonGroup";
import OrderDetailsItem from "../components/OrderDetailsItem";
import { useOrderDetails } from "../hooks/useOrderDetails";
import ComponentLoading from "../components/ComponentLoading";
import { IoChevronBack } from "react-icons/io5";

const OrderDetails = () => {

    const { orderId } = useParams();
    const navigate = useNavigate();
    const formattedOrderId = Number(orderId);

    const orderData = useOrdersStore(s => s.order);
    const loading = useOrdersStore(s => s.loading);
    const error = useOrdersStore(s => s.error);

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
        paymentStatus,
        setPaymentStatus,
        notificationOpen,
        setNotificationOpen,
        documentPrices,
        setDocumentPrices,
        addDocument,
        removeDocument,
        fetchUserOrder,
        handleSubmit,
        handleDelete
    } = useOrderDetails(orderData, fetchOrder, formattedOrderId, updateOrder, deleteOrder);

    useEffect(() => {
        fetchUserOrder();
    }, []);

    return (
        <>
            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed/>

            <div className="od">

                <OrderDeleteNotification
                    notificationOpen={notificationOpen}
                    setNotificationOpen={setNotificationOpen}
                    handleDelete={handleDelete}
                />

                <button className="od__back-btn" type="button" onClick={() => navigate('/dashboard')}>
                    <IoChevronBack />
                    Zurück zum Dashboard
                </button>

                <form onSubmit={handleSubmit}>

                    <div className="od__header-card">
                        <div className="od__header-content">
                            <div className="od__header-info">
                                <h1 className="od__order-id">{`#ro-${orderData?.id}`}</h1>
                                <p className="od__order-date">Bestellt am {orderData?.formatted_timestamp}</p>
                            </div>
                        </div>
                        <div className="od__header-actions">
                            <OrderDetailsButtonGroup
                                formActive={formActive}
                                setFormActive={setFormActive}
                                setNotificationOpen={setNotificationOpen}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <ComponentLoading/>
                    ) : error ? (
                        <ErrorView/>
                    ) : orderData ? (
                        <OrderDetailsItem
                            orderType={orderType}
                            setOrderType={setOrderType}
                            orderData={orderData}
                            status={status}
                            setStatus={setStatus}
                            paymentStatus={paymentStatus}
                            setPaymentStatus={setPaymentStatus}
                            formActive={formActive}
                            documentPrices={documentPrices}
                            setDocumentPrices={setDocumentPrices}
                            addDocument={addDocument}
                            removeDocument={removeDocument}
                        />
                    ) : (
                        <p>Nicht gefunden</p>
                    )}

                </form>

            </div>
        </>
    );
};


export default OrderDetails;
