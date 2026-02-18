import { useNavigate } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";
import default_avatar from "../assets/default_avatar.png"

interface CustomerProps {
    id: number;
    profile_img_url: string;
    profile_img: string;
    first_name: string;
    last_name: string;
    email: string;
    orders: string;
}

const Customer = ({id, profile_img_url, profile_img, first_name, last_name, email, orders}: CustomerProps) => {

    const navigate = useNavigate();

    return (
        <div
            className="oi"
            onClick={() => navigate(`/user/${id}`)}
        >
            <img
                src={profile_img_url || profile_img || default_avatar}
                alt=""
                className="oi__avatar"
                referrerPolicy="no-referrer"
            />

            <div className="oi__content">
                <span className="oi__id">{first_name} {last_name}</span>
                <span className="oi__name">{email}</span>
            </div>

            <div className="oi__right">
                <span className="oi__order-count">{orders} Aufträge</span>
            </div>

            <IoChevronForward className="oi__chevron" />
        </div>
    );
};


export default Customer;
