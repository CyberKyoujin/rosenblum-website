import { IoPersonOutline, IoMailOutline, IoCallOutline } from "react-icons/io5";
import { RequestData } from '../types/request';

interface RequestDetailsContactsSectionProps {
    request: RequestData | null;
}

const RequestDetailsContactsSection = ({request}: RequestDetailsContactsSectionProps) => {

    return (
        <div className="od__card">
            <h3 className="od__card-title">Kontaktdaten</h3>
            <div className="od__info-list">
                <div className="od__info-item">
                    <IoPersonOutline className="od__info-icon" />
                    <div className="od__info-content">
                        <span className="od__info-label">Name</span>
                        <span className="od__info-value">{request?.name}</span>
                    </div>
                </div>
                <div className="od__info-item">
                    <IoMailOutline className="od__info-icon" />
                    <div className="od__info-content">
                        <span className="od__info-label">E-Mail</span>
                        <span className="od__info-value">{request?.email}</span>
                    </div>
                </div>
                <div className="od__info-item">
                    <IoCallOutline className="od__info-icon" />
                    <div className="od__info-content">
                        <span className="od__info-label">Telefon</span>
                        <span className="od__info-value">{request?.phone_number}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailsContactsSection;
