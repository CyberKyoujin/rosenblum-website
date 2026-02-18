import { useNavigate } from "react-router-dom";
import { IoDocumentTextOutline, IoChevronForward } from "react-icons/io5";
import useOrdersStore from "../zustand/useOrdersStore";
import { getStatusConfig } from "../types/order";

const paymentStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
    paid:              { label: 'Bezahlt',       color: '#166534', bg: '#dcfce7' },
    not_paid:          { label: 'Nicht bezahlt', color: '#92400e', bg: '#fef3c7' },
    payment_pending:   { label: 'Ausstehend',   color: '#1e40af', bg: '#dbeafe' },
};

const paymentTypeConfig: Record<string, { label: string; color: string; bg: string }> = {
    rechnung: { label: 'Rechnung',       color: '#6b21a8', bg: '#f3e8ff' },
    stripe:   { label: 'Online-Zahlung', color: '#0f766e', bg: '#ccfbf1' },
};

interface OrderProps {
    id: number;
    name: string;
    formatted_timestamp: string;
    status: string;
    is_new: boolean;
    payment_status: string;
    payment_type: string | null;
}


const Order = ({id, name, formatted_timestamp, status, is_new, payment_status, payment_type}: OrderProps) => {

    const navigate = useNavigate();
    const toggleOrder = useOrdersStore(s => s.toggleOrder);
    const statusConfig = getStatusConfig(status);
    const payConfig = paymentStatusConfig[payment_status] || paymentStatusConfig.not_paid;
    const ptConfig = payment_type ? paymentTypeConfig[payment_type] : null;

    return (
        <div
            className={`oi ${is_new ? 'oi--new' : ''}`}
            onClick={() => { navigate(`/order/${id}`); toggleOrder(id); }}
        >
            <div className="oi__icon">
                <IoDocumentTextOutline />
            </div>

            <div className="oi__content">
                <span className="oi__id">#ro-{id}</span>
                <span className="oi__name">{name}</span>
            </div>

            <div className="oi__right">
                <div className="oi__badges-row">
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
                    <div
                        className="oi__status-badge"
                        style={{ backgroundColor: payConfig.bg, color: payConfig.color }}
                    >
                        <span
                            className="oi__status-dot"
                            style={{ backgroundColor: payConfig.color }}
                        />
                        <span className="oi__status-text">{payConfig.label}</span>
                    </div>
                    {ptConfig && (
                        <div
                            className="oi__status-badge"
                            style={{ backgroundColor: ptConfig.bg, color: ptConfig.color }}
                        >
                            <span
                                className="oi__status-dot"
                                style={{ backgroundColor: ptConfig.color }}
                            />
                            <span className="oi__status-text">{ptConfig.label}</span>
                        </div>
                    )}
                </div>
                <span className="oi__timestamp">{formatted_timestamp}</span>
            </div>

            <IoChevronForward className="oi__chevron" />
        </div>
    );
};


export default Order;
