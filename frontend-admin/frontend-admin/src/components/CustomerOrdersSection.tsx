import { useNavigate } from "react-router-dom";
import { IoDocumentTextOutline, IoChevronForward } from "react-icons/io5";
import { MdOutlineStickyNote2 } from "react-icons/md";
import useCustomersStore from "../zustand/useCustomers";
import { getStatusConfig } from "../types/order";

const CustomerOrdersSection = () => {

    const orders = useCustomersStore(s => s.customerOrders);
    const navigate = useNavigate();

    if (!orders || orders.length === 0) {
        return (
            <div className="od__empty-state">
                <MdOutlineStickyNote2 className="od__empty-icon" />
                <p className="od__empty-text">Der Nutzer hat noch keine Aufträge</p>
            </div>
        );
    }

    return (
        <div className="od__orders-list">
            {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                    <div
                        key={order.id}
                        className="oi"
                        onClick={() => navigate(`/order/${order.id}`)}
                    >
                        <div className="oi__icon">
                            <IoDocumentTextOutline />
                        </div>
                        <div className="oi__content">
                            <span className="oi__id">#ro-{order.id}</span>
                            <span className="oi__name">Bestellt am {order.formatted_timestamp}</span>
                        </div>
                        <div className="oi__right">
                            <div
                                className="oi__status-badge"
                                style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
                            >
                                <span
                                    className="oi__status-dot"
                                    style={{ backgroundColor: statusConfig.color }}
                                />
                                <span className="oi__status-text">{statusConfig.label}</span>
                            </div>
                        </div>
                        <IoChevronForward className="oi__chevron" />
                    </div>
                );
            })}
        </div>
    );
};

export default CustomerOrdersSection;
