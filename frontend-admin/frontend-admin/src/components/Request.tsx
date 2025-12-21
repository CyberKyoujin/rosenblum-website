import { useNavigate } from "react-router-dom";
import { BiMessageDetail } from "react-icons/bi";
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
        className="small-order-container" 
        key={id} 
        onClick={() => {navigate(`/request/${id}`); toggleRequest(id)}}
        style={{ backgroundColor: is_new ? "rgb(230, 238, 252)" : undefined }}>
            
            <div className="order-container-info">
                <BiMessageDetail size={45} className="app-icon"/>
                
                <div className="order-header">

                    <p style={{fontWeight: 'bold'}}>{name}</p>
                    <p className="order-customer-name">{email}</p>

                </div>
            </div>

            <div>
                <p className="order-timestamp-text">{formatted_timestamp}</p>
            </div>


        </div>
    )
}


export default Request
