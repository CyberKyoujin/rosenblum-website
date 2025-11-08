import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../zustand/axiosInstance";
import useMainStore from "../zustand/useMainStore";

interface RequestProps {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    message: string;
    formatted_timestamp: string;
}

const Request = ({id, name, email, phone_number, message, formatted_timestamp}: RequestProps) => {

    const navigate = useNavigate();

    const { toggleOrder } = useMainStore.getState();

    return (
        <div className="small-order-container" key={id} onClick={() => {navigate(`/order/${id}`); toggleOrder(id)}}>
            <div className="order-header">
                <p>{name}</p>
            </div>

            <div>
                <p>{formatted_timestamp}</p>
            </div>


        </div>
    )
}


export default Request
