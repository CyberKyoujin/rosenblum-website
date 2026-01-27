import { Link } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import useAuthStore from "../zustand/useAuthStore";
import defaultAvatar from "../assets/default_avatar.webp"
import useOrderStore from "../zustand/useOrderStore";
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone } from "react-icons/hi";
import { IoDocumentTextOutline, IoCalendarOutline } from "react-icons/io5";

const UserProfileSection = () => {

    const {user, userData} = useAuthStore();
    const {orders} = useOrderStore();

    const profileImg = user?.profile_img_url || userData?.image_url || defaultAvatar;

    const handleImageError = (e: any) => {
        e.target.src = defaultAvatar;
        console.error("Failed to load user image from URL:", e.target.src);
    };

    const address = userData?.street && userData?.zip && userData?.city
        ? `${userData.street}, ${userData.zip} ${userData.city}`
        : null;

    return (
        <section className="profile-cards">

            {/* Avatar Card */}
            <div className="profile-card profile-card--avatar">
                <div className="profile-card__avatar-wrapper">
                    <img
                        src={profileImg}
                        alt=""
                        className="profile-card__avatar"
                        onError={handleImageError}
                    />
                </div>

                <h2 className="profile-card__name">{user?.first_name} {user?.last_name}</h2>

                <div className="profile-card__stats">
                    <div className="profile-card__stat">
                        <IoDocumentTextOutline className="profile-card__stat-icon" />
                        <span className="profile-card__stat-value">{orders?.length || 0}</span>
                        <span className="profile-card__stat-label">Aufträge</span>
                    </div>
                    <div className="profile-card__stat-divider" />
                    <div className="profile-card__stat">
                        <IoCalendarOutline className="profile-card__stat-icon" />
                        <span className="profile-card__stat-label">Mitglied seit</span>
                        <span className="profile-card__stat-value">{userData?.date_joined?.slice(0,10)}</span>
                    </div>
                </div>
            </div>

            {/* Contact Card */}
            <div className="profile-card profile-card--contact">
                <div className="profile-card__header">
                    <h3 className="profile-card__title">Kontaktdaten</h3>
                    <button className="profile-card__delete-btn">Konto löschen</button>
                </div>

                <div className="profile-card__info-list">
                    <div className="profile-card__info-item">
                        <HiOutlineMail className="profile-card__info-icon" />
                        <div className="profile-card__info-content">
                            <span className="profile-card__info-label">E-Mail</span>
                            <span className="profile-card__info-value">{user?.email || "Nicht angegeben"}</span>
                        </div>
                    </div>

                    <div className="profile-card__info-item">
                        <HiOutlineLocationMarker className="profile-card__info-icon" />
                        <div className="profile-card__info-content">
                            <span className="profile-card__info-label">Anschrift</span>
                            <span className="profile-card__info-value">{address || "Nicht angegeben"}</span>
                        </div>
                    </div>

                    <div className="profile-card__info-item">
                        <HiOutlinePhone className="profile-card__info-icon" />
                        <div className="profile-card__info-content">
                            <span className="profile-card__info-label">Telefon</span>
                            <span className="profile-card__info-value">{userData?.phone_number || "Nicht angegeben"}</span>
                        </div>
                    </div>
                </div>

                <Link to="/edit-profile" className="profile-card__edit-btn">
                    <FaUserEdit />
                    Profil bearbeiten
                </Link>
            </div>

        </section>
    )
}

export default UserProfileSection;