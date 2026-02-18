import { useNavigate } from "react-router-dom";
import { IoChatbubbleOutline, IoChevronForward } from "react-icons/io5";
import useRequestsStore from "../zustand/useRequests";


interface RequestProps {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    message: string;
    formatted_timestamp: string;
    is_new: boolean;
}

const Request = ({id, name, email, formatted_timestamp, is_new}: RequestProps) => {

    const navigate = useNavigate();
    const toggleRequest = useRequestsStore(s => s.toggleRequest);

    return (
        <div
            className={`oi ${is_new ? 'oi--new' : ''}`}
            onClick={() => { navigate(`/request/${id}`); toggleRequest(id); }}
        >
            <div className="oi__icon">
                <IoChatbubbleOutline />
            </div>

            <div className="oi__content">
                <span className="oi__id">{name}</span>
                <span className="oi__name">{email}</span>
            </div>

            <div className="oi__right">
                <span className="oi__timestamp">{formatted_timestamp}</span>
            </div>

            <IoChevronForward className="oi__chevron" />
        </div>
    );
};


export default Request;
