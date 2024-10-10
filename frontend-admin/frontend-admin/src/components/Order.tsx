import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../zustand/axiosInstance";
import useMainStore from "../zustand/useMainStore";

interface OrderProps {
    id: number;
    name: string;
    timestamp: string;
    status: string;
    is_new: boolean;
}

const Order = ({id, name, timestamp, status, is_new}: OrderProps) => {

    const navigate = useNavigate();

    const { toggleOrder } = useMainStore.getState();

    return (
        <div className="small-order-container" key={id} onClick={() => {navigate(`/order/${id}`); toggleOrder(id)}}>
            <div className="order-header">
                <p style={{fontWeight: 'bold', color: is_new ? 'RGB(68 113 203)': 'black'}}># ro-{id}</p>
                <p>{name}</p>
            </div>

            <div>
                <p>{timestamp}</p>
            </div>

            <div className="order-footer" style={{backgroundColor: status === 'review' ? 'RGB(248 255 100)' : 'green'}}>

            </div>
        </div>
    )
}


export default Order

