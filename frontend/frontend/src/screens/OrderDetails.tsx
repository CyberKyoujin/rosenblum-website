import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";
import Divider from '@mui/material/Divider';
import { IoPersonSharp } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { FiPaperclip } from "react-icons/fi";
import { FaFile } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

interface File{
    id: string;
    file: string;
    file_name: string;
    file_size: string;
    order: string;
}

interface OrderData {
    id: string;
    files: File[];
    name: string;
    email: string;
    phone_number: string;
    city: string;
    date: string;
    street: string;
    zip: string;
    message: string;
    status: string;
    user: string;
}




const OrderDetails = () => {

    const { orderId } = useParams();
    const [orderData, setOrderData] = useState<OrderData | null>(null);

    const { t } = useTranslation();

    useEffect(() => {

        const fetchOrderDetails = async () => {
            try{
                const response = await axios.get(`http://127.0.0.1:8000/order/${orderId}`);
                setOrderData(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchOrderDetails();

    }, [orderId]);

    console.log(orderData)

    return (
        <div className="order-details">
            <div className="order-details-container">

                <div className="order-details-title">
                    <FaFileAlt style={{fontSize: '25px', color: 'rgb(76, 121, 212)', marginBottom: '4px'}}/>
                    <div style={{display: 'flex'}}>
                        <h1>{t('order')}</h1>
                        <h1 className="header-span">{t('übersicht')}</h1>
                    </div>
                </div>

                <Divider orientation="horizontal" style={{marginTop: '1.5rem'}}/>

                <div className="order-details-content">

                    <div className="order-details-top">

                        <div className="order-details-header">
                            <h3>{`# ro-${orderData?.id}-2024`}</h3>
                            <p>{t('orderedAt')} {orderData?.date}</p>
                        </div>

                        <div className="order-details-status">
                            <p>Status: {orderData?.status === 'review' ? t('beeingChecked'): ''}</p>
                            <div className="order-status"></div>
                        </div>

                    </div>

                    <Divider orientation="horizontal" sx={{background: 'rgb(76, 121, 212)', marginTop: '2rem'}}/>

                    <div className="order-details-contacts">
                    <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><MdInfoOutline style={{fontSize: '25px', color: 'rgb(76, 121, 212)'}}/>{t('contactInformation')}</h3>
                        <p className="order-details-item"><IoPersonSharp style={{fontSize: '22px', color: 'rgb(76, 121, 212)'}}/> {orderData?.name}</p>
                        <p className="order-details-item"><FaPhone style={{fontSize: '22px', color: 'rgb(76, 121, 212)'}}/> {orderData?.phone_number}</p>
                        <p className="order-details-item"><MdLocationPin style={{fontSize: '25px', color: 'rgb(76, 121, 212)'}}/> {`${orderData?.street}, ${orderData?.zip} ${orderData?.city}`}</p>
                    </div>

                    <Divider orientation="horizontal" sx={{background: 'rgb(76, 121, 212)', marginTop: '2rem', marginBottom: '2rem'}}/>

                    <div className="order-details-message">
                        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><BiMessageDetail style={{fontSize: '25px', color: 'rgb(76, 121, 212)'}}/>{t('yourMessage')}</h3>
                        <p className="order-details-item">{orderData?.message || 'Sie haben keine Nachricht gelassen.'}</p>
                        
                    </div>

                    <Divider orientation="horizontal" sx={{background: 'rgb(76, 121, 212)', marginTop: '2rem', marginBottom: '2rem'}}/>

                    <div>
                        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><FiPaperclip style={{fontSize: '25px', color: 'rgb(76, 121, 212)'}}/>{t('data')}</h3>
                        {orderData?.files.length != 0 ? (
                            <div className="files-container" style={{marginTop: '2rem'}}>
                                {orderData?.files.map((file, index) => (
                                    <div key={index} className="file-container">
                                        <FaFile style={{fontSize: '40px', color: 'rgb(76, 121, 212)'}}/>
                                        <p>{file.file_name.length > 15 ? `${file.file_name.slice(0, 12)}...` : file.file_name}</p>
                                        <p>{`${file.file_size} MB`}</p>
                                    </div>
                                ))}
                            </div>
                        ):
                        (
                            <div className="files-container" style={{marginTop: '2rem'}}>
                                <p>Sie haben keine Daten angeknüpft</p>
                            </div>
                        )
                        }
                    </div>



                </div>


            </div>
        </div>
    )

}


export default OrderDetails