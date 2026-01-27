import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../zustand/useOrderStore";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { FaRegFileLines } from "react-icons/fa6";
import { IoChevronForward } from "react-icons/io5";

const getStatusConfig = (status: string, t: (key: string) => string) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
        review: { label: t('beeingChecked'), color: '#92400e', bg: '#fef3c7' },
        completed: { label: t('completed'), color: '#166534', bg: '#dcfce7' },
        processing: { label: t('processing'), color: '#1e40af', bg: '#dbeafe' },
        cancelled: { label: t('cancelled'), color: '#991b1b', bg: '#fee2e2' },
    };
    return configs[status] || configs.review;
};

const OrdersSection = () => {

    const orders = useOrderStore(s => s.orders);

    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <section className="orders-section">

            <h2 className="orders-section__title" data-testid="order-title">Aufträge</h2>

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

                                    <IoChevronForward className="order-item__chevron" />
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <div className="orders-empty">
                        <MdOutlineStickyNote2 className="orders-empty__icon" />
                        <p className="orders-empty__text">Sie haben noch keine Aufträge</p>
                        <button className="orders-empty__btn hover-btn" onClick={() => navigate('/order')}>
                            ANGEBOT ANFORDERN
                        </button>
                    </div>
                )}
            </div>

        </section>
    )
}

export default OrdersSection;