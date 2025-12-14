import { useNavigate } from "react-router-dom";
import { FaRegFileLines } from "react-icons/fa6";
import useOrdersStore from "../zustand/useOrdersStore";
import { statusColors, StatusKeys } from "../types/order";


interface OrderProps {
    id: number;
    name: string;
    formatted_timestamp: string;
    status: string;
    is_new: boolean;
}


const Order = ({id, name, formatted_timestamp, status, is_new}: OrderProps) => {

    const navigate = useNavigate();

    const toggleOrder = useOrdersStore(s => s.toggleOrder);

    return (
        <div className="small-order-container" key={id} onClick={() => {navigate(`/order/${id}`); toggleOrder(id)}}>

            <div className="order-container-info">

                <FaRegFileLines size={45} className="app-icon"/>

                <div className="order-header">
                    <p style={{fontWeight: 'bold', color: is_new ? 'RGB(68 113 203)': 'black'}}># ro-{id}</p>
                    <p>{name}</p>
                </div>

            </div>

            <div className="order-status-container">
                <div>
                    <p>{formatted_timestamp}</p>
                </div>

                <div className="order-status"
                    style={{backgroundColor: statusColors[status as StatusKeys]}}
                />

            </div>
            
        </div>
    )
}


export default Order

