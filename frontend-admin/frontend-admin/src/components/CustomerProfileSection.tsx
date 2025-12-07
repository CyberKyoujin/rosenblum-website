import { Link } from "react-router-dom";
import { FaUserEdit, FaInfoCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useAuthStore from "../zustand/useAuthStore";
import defaultAvatar from "../assets/default_avatar.webp"
import useOrdersStore from "../zustand/useOrdersStore";
import useCustomersStore from "../zustand/useCustomers";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const UserProfileSection = () => {

    const { userId } = useParams();

    const customerData = useCustomersStore(s => s.customerData);
    const fetchCustomerData = useCustomersStore(s => s.fetchCustomerData);
    const customerOrders = useCustomersStore(s => s.customerOrders);

    const profileImg = customerData?.profile_img_url || defaultAvatar

     const handleImageError = (e: any) => {
        e.target.src = defaultAvatar; 
        console.error("Failed to load user image from URL:", e.target.src);
    };

    useEffect(() => {
        fetchCustomerData(userId);
    }, [fetchCustomerData])

    return (
        <section className="profile__user-data-section">

                    <div className="profile__img_container profile-section-container">

                        <div>
                            <img src={profileImg}  alt="" className="profile__user-avatar" onError={handleImageError}/>
                        </div>

                        <div className="profile__username">
                            <h2>{customerData?.first_name} {customerData?.last_name}</h2>
                        </div>

                        <div className="profile__user-stats-container">

                            <div className="profile__user-stats-item">
                                <p className="profile__user-stats-highlighted">{customerOrders?.length}</p>
                                <p>Aufträge</p>
                            </div>

                            <div className="profile__vertical-divider"></div>

                            <div className="profile__user-stats-item">
                                <p>Seit</p>
                                <p className="profile__user-stats-highlighted">{customerData?.date_joined?.slice(0,10)}</p>
                            </div>

                        </div>

                    </div>

                    <div className="profile__user-data-container profile-section-container">
                        <h2><FaInfoCircle className="profile__contact-icon"></FaInfoCircle>Kontanktdaten</h2>
                        <div className="profile__user-personal-info">
                            <p>Email: {customerData?.email}</p>
                            <p>Anschrift: {customerData?.street}, {customerData?.zip} {customerData?.city}</p>
                            <p>Telefonnummer: {customerData?.phone_number}</p>
                        </div>
                        <div className="profile__button-group">
                            <Link to="/edit-profile" className="profile__edit-btn">
                                <FaUserEdit className="profile__edit-icon"></FaUserEdit>
                                PROFIL BEARBEITEN
                            </Link>
                            <button className="profile__delete-btn">
                                <MdDelete className="profile__edit-icon"/>
                                KONTO LÖSCHEN
                            </button>
                        </div>
                    </div>

                </section>
    )
}

export default UserProfileSection;