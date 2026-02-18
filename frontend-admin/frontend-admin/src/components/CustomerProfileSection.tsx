import { useNavigate } from "react-router-dom";
import { IoPersonOutline, IoMailOutline, IoCallOutline, IoLocationOutline } from "react-icons/io5";
import { LuMessageSquare } from "react-icons/lu";
import { MdBlock } from "react-icons/md";
import defaultAvatar from "../assets/default_avatar.webp"
import useCustomersStore from "../zustand/useCustomers";

const UserProfileSection = () => {

    const customerData = useCustomersStore(s => s.customerData);
    const customerOrders = useCustomersStore(s => s.customerOrders);
    const navigate = useNavigate();

    const profileImg = customerData?.profile_img || customerData?.profile_img_url || defaultAvatar;

    const address = customerData?.street
        ? `${customerData.street}, ${customerData.zip} ${customerData.city}`
        : "Nicht angegeben";

    const phoneNumber = customerData?.phone_number || "Nicht angegeben";

    const handleImageError = (e: any) => {
        e.target.src = defaultAvatar;
    };

    return (
        <div className="od__cards-grid">
            {/* Avatar & Stats Card */}
            <div className="od__card cp__avatar-card">
                <div className="cp__avatar-section">
                    <img
                        src={profileImg}
                        alt=""
                        className="cp__avatar"
                        onError={handleImageError}
                        referrerPolicy="no-referrer"
                    />
                    <h2 className="cp__name">{customerData?.first_name} {customerData?.last_name}</h2>
                </div>
                <div className="cp__stats">
                    <div className="cp__stat-item">
                        <span className="cp__stat-value">{customerOrders?.length || 0}</span>
                        <span className="cp__stat-label">Aufträge</span>
                    </div>
                    <div className="cp__stat-divider" />
                    <div className="cp__stat-item">
                        <span className="cp__stat-label">Seit</span>
                        <span className="cp__stat-value">{customerData?.date_joined?.slice(0, 10)}</span>
                    </div>
                </div>
            </div>

            {/* Contact Info Card */}
            <div className="od__card">
                <h3 className="od__card-title">Kontaktdaten</h3>
                <div className="od__info-list">
                    <div className="od__info-item">
                        <IoPersonOutline className="od__info-icon" />
                        <div className="od__info-content">
                            <span className="od__info-label">Name</span>
                            <span className="od__info-value">{customerData?.first_name} {customerData?.last_name}</span>
                        </div>
                    </div>
                    <div className="od__info-item">
                        <IoMailOutline className="od__info-icon" />
                        <div className="od__info-content">
                            <span className="od__info-label">E-Mail</span>
                            <span className="od__info-value">{customerData?.email}</span>
                        </div>
                    </div>
                    <div className="od__info-item">
                        <IoCallOutline className="od__info-icon" />
                        <div className="od__info-content">
                            <span className="od__info-label">Telefon</span>
                            <span className="od__info-value">{phoneNumber}</span>
                        </div>
                    </div>
                    <div className="od__info-item">
                        <IoLocationOutline className="od__info-icon" />
                        <div className="od__info-content">
                            <span className="od__info-label">Anschrift</span>
                            <span className="od__info-value">{address}</span>
                        </div>
                    </div>
                </div>
                <div className="cp__btn-group">
                    <button className="cp__action-btn cp__action-btn--primary" type="button" onClick={() => navigate(`messages`)}>
                        <LuMessageSquare />
                        Nachricht schreiben
                    </button>
                    <button className="cp__action-btn cp__action-btn--danger" type="button">
                        <MdBlock />
                        Konto blockieren
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileSection;
