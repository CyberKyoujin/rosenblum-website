import React, { useEffect } from "react";
import useAuthStore from "../zustand/useAuthStore";
import orderStore from "../zustand/orderStore";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import translateIcon from '../assets/translate_icon.png'

const OrderWait = () => {


    const navigate = useNavigate();
    const { successfullyCreated } = orderStore.getState();

    useEffect(() => {
        let timer: any;

        if (successfullyCreated) {
            timer = setTimeout(() => {
                navigate('/profile');
            }, 4000);
        }

        return () => clearTimeout(timer);
    }, [successfullyCreated, navigate])


    return (
        <div className="order-wait-container">

            <div className="spinner-container">

                <CircularProgress size={80} sx={{color: 'rgb(76, 121, 212)'}}/>

                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <h1>Bearbeitung ihres</h1>
                    <h1 className="header-span">Auftrages</h1>
                    <h1>läuft...</h1>
                </div>

            </div>
            
        </div>
    )
}


export default OrderWait