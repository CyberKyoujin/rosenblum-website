
import { useNavigate } from "react-router-dom";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { FaRegFileLines } from "react-icons/fa6";
import useOrdersStore from "../zustand/useOrdersStore";
import useCustomersStore from "../zustand/useCustomers";

const CustomerOrdersSection = () => {

    const orders = useCustomersStore(s => s.customerOrders);

    const navigate = useNavigate();
 
    return (
        <section className="profile-section-container profile__user-orders-section">

                    {orders && orders.length > 0 ? (
                        <>
                            {orders.map((order) => (

                                <div
                                key={order.id}
                                className="profile-order-container"
                                onClick={() => navigate(`/order/${order.id}`)}>

                                    <FaRegFileLines size={45} className="app-icon"/>

                                    <div className="order-info">
                                        <h4>{`# ro-${order.id}`}</h4>

                                        <div className="order-date">
                                            <p className="order-date-header">Bestellt am: </p>
                                            {order.formatted_timestamp}
                                        </div>
                                    </div>

                                    <div className="order-status-container">
                                        <p className="order-status-text">{order.status === 'review' ? "wird bearbeitet..." : ''}</p>
                                        <div className="order-status" />
                                    </div>

                                </div>

                            ))}
                        </>
                    ) : (
                        
                        <div className="no-orders-container">

                            <MdOutlineStickyNote2 style={{ fontSize: '100px' }} />

                            <h3>Sie haben noch keine Aufträge</h3>

                            <button className="no-orders-btn hover-btn" onClick={() => navigate('/order')}>
                                ANGEBOT ANFORDERN
                            </button>

                        </div>
                    )}

        </section>
    )
}

export default CustomerOrdersSection;