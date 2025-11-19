import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../zustand/useOrderStore";
import { MdOutlineStickyNote2 } from "react-icons/md";


const OrdersSection = () => {

    const {orders} = useOrderStore();

    const { t } = useTranslation();
    const navigate = useNavigate();
 
    return (
        <section className="profile__user-orders-section profile-section-container" style={{gap: "1.5rem"}}>

                    {orders?.length > 0 ? (
                        <>
                        {orders.map((order) => (
                            <div
                            key={order.id}
                            className="profile-order-container"
                            onClick={() => navigate(`/order/${order.id}`)}
                            >
                            <h4>{`# ro-${order.id}`}</h4>
                            <div className="order-date">
                                <p className="order-date-header">{t('orderedAt')} </p>
                                {order.date}
                            </div>
                            <div className="order-status-container">
                                <p className="order-status-text">{order.status === 'review' ? t('beeingChecked') : ''}</p>
                                <div className="order-status" />
                            </div>
                            </div>
                        ))}
                        </>
                    ) : (
                        <div className="no-orders-container">
                        <MdOutlineStickyNote2 style={{ fontSize: '100px' }} />
                        <h3>Sie haben noch keine Aufträge</h3>
                        <button
                            className="no-orders-btn hover-btn"
                            onClick={() => navigate('/order')}
                        >
                            ANGEBOT ANFORDERN
                        </button>
                        </div>
                    )}

                </section>
    )
}

export default OrdersSection;