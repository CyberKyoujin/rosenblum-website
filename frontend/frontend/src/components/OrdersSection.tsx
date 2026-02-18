import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../zustand/useOrderStore";
import { MdOutlineStickyNote2, MdPayment } from "react-icons/md";
import { FaRegFileLines } from "react-icons/fa6";
import { IoChevronForward } from "react-icons/io5";

const getStatusConfig = (status: string, t: (key: string) => string) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
        review:              { label: t('status_review'),              color: '#92400e', bg: '#fef3c7' },
        in_progress:         { label: t('status_in_progress'),         color: '#1e40af', bg: '#dbeafe' },
        completed:           { label: t('status_completed'),           color: '#166534', bg: '#dcfce7' },
        ready_pick_up:       { label: t('status_ready_pick_up'),       color: '#7c3aed', bg: '#ede9fe' },
        sent:                { label: t('status_sent'),                color: '#0369a1', bg: '#e0f2fe' },
        canceled:            { label: t('status_canceled'),            color: '#991b1b', bg: '#fee2e2' },
        waiting_for_payment: { label: t('status_waiting_for_payment'), color: '#92400e', bg: '#fef3c7' },
    };
    return configs[status] || configs.review;
};

const OrdersSection = () => {

    const orders = useOrderStore(s => s.orders);

    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <section className="orders-section">

            <h2 className="orders-section__title" data-testid="order-title">{t('orders')}</h2>

            <div className="orders-list">
                {orders && orders.length > 0 ? (
                    <>
                        {orders.map((order) => {
                            const statusConfig = getStatusConfig(order.status || 'review', t);
                            return (
                                <div
                                    key={order.id}
                                    className="order-item"
                                    onClick={() => navigate(`/order/${order.id}`)}
                                >
                                    <div className="order-item__icon">
                                        <FaRegFileLines />
                                    </div>

                                    <div className="order-item__content">
                                        <span className="order-item__id">{`#ro-${order.id}`}</span>
                                        <span className="order-item__date">{order.date}</span>
                                    </div>

                                    <div className="order-item__status-wrapper">
                                        <div
                                            className="order-item__status-badge"
                                            style={{
                                                backgroundColor: statusConfig.bg,
                                                color: statusConfig.color
                                            }}
                                        >
                                            <span className="order-item__status-dot" style={{ backgroundColor: statusConfig.color }} />
                                            <span className="order-item__status-text">{statusConfig.label}</span>
                                        </div>
                                    </div>

                                    {order.order_type !== 'kostenvoranschlag' && (
                                        order.payment_status === 'paid' ? (
                                            <span className="order-item__paid-badge order-item__paid-badge--paid">
                                                <MdPayment />
                                                {t('paymentStatus_paid')}
                                            </span>
                                        ) : order.payment_status === 'payment_pending' ? (
                                            <span className="order-item__paid-badge order-item__paid-badge--pending">
                                                <MdPayment />
                                                {t('paymentStatus_pending')}
                                            </span>
                                        ) : (
                                            <button
                                                className="order-item__pay-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/order/${order.id}`);
                                                }}
                                            >
                                                <MdPayment />
                                                {t('pay')}
                                            </button>
                                        )
                                    )}

                                    <IoChevronForward className="order-item__chevron" />
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <div className="orders-empty">
                        <MdOutlineStickyNote2 className="orders-empty__icon" />
                        <p className="orders-empty__text">{t('noOrders')}</p>
                        <button className="orders-empty__btn hover-btn" onClick={() => navigate('/order')}>
                            {t('orderOffer')}
                        </button>
                    </div>
                )}
            </div>

        </section>
    )
}

export default OrdersSection;