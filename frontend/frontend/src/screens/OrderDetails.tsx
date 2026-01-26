import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../axios/axiosInstance";
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
import OrderDetailsSkeleton from "../components/OrderDetailsSkeleton";
import { ApiErrorResponse } from "../types/error";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import ApiErrorView from "../components/ApiErrorView";
import { IoMdDownload } from "react-icons/io";
import Footer from "../components/Footer";

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
    const [loading, setLoading] = useState(false);
    const [orderDetailsError, setOrderDetailsError] = useState<ApiErrorResponse | null>(null);

    const { t } = useTranslation();

    const isAtTop = useIsAtTop(10);

    useEffect(() => {

        const fetchOrderDetails = async () => {

            setLoading(true);
            setOrderDetailsError(null);

            try{
                const response = await axiosInstance.get(`/orders/${orderId}/`);
                setOrderData(response.data);
            } catch (err: unknown) {
                
                setOrderDetailsError(err as ApiErrorResponse);

            } finally{
                setLoading(false);
            }
        }

        fetchOrderDetails();

    }, [orderId]);

    if (loading) {
        return <OrderDetailsSkeleton/>
    }

    return (
        <>
        
        <div className="main-app-container">

        <ApiErrorAlert error={orderDetailsError} belowNavbar={isAtTop} fixed/>

            <div className="order-details-container">

                <div className="order-details-title">
                    <FaFileAlt size={35} style={{ color: 'rgb(76, 121, 212)', marginBottom: '4px'}}/>
                    <div style={{display: 'flex', fontSize: "14px", gap: "0.5rem"}}>
                        <h1>{t('order')}</h1>
                        <h1 className="header-span">{t('orderReview')}</h1>
                    </div>
                </div>

                <Divider orientation="horizontal" style={{marginTop: '1.5rem'}}/>

                { orderDetailsError ? (
                    <ApiErrorView message={orderDetailsError?.message}/>
                ) : (
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
                                        <div className="small-file-name">
                                            <FaFile size={30} className="app-icon"/>
                                            <p>{file.file_name.length > 15 ? `${file.file_name.slice(0, 15)}...` : file.file_name}</p>
                                        </div>

                                        <div className="small-file-name">
                                            <p>{`${file.file_size} MB`}</p>
                                            <button className="download-btn-small" onClick={() => window.open(file.file, '_blank')}><IoMdDownload/></button>
                                        </div>
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
                )}


            </div>

            
                
        </div>

        <Footer/>
        </>
    )

}


export default OrderDetails