import { useNavigate } from "react-router-dom";
import default_avatar from "../assets/default_avatar.png"
interface CustomerProps {
    id: string;
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
            className="customer-container"
            key={id}
            onClick={() => navigate(`/user/${id}`)}
            >
            <div className="customer-main">

                <div className="customer-top-section">
                    <img
                    src={profile_img_url || profile_img || default_avatar}
                    className="customer-avatar"
                    /> 
                </div>

                <div className="customer-content">
                    <h3>{first_name} {last_name}</h3>
                    <p>{email}</p>
                </div>

            </div>

            <div className="customer-bottom">
                <p>{orders} Aufträge</p>
            </div>
        </div>
    )
}


export default Customer;