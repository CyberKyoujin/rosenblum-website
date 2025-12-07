import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../zustand/axiosInstance";
import { FaFileAlt } from "react-icons/fa";
import Divider from '@mui/material/Divider';
import { IoPersonSharp } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { FiPaperclip } from "react-icons/fi";
import { FaFile } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdEditSquare } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import CircularProgress from '@mui/material/CircularProgress';
import useOrdersStore from "../zustand/useOrdersStore";

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
    formatted_timestamp: string;
}

const statusValues = {
    "review": "wird überprüft",
    "sent": "Versand",
    "progress": "In Bearbeitung",
    "picked": "Abgeholt",
    "ready": "Abholbereit"
};

const OrderDetails = () => {

    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [formActive, setFormActive] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [notificationOpen, setNotificationOpen] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { orderId } = useParams();

    const navigate = useNavigate();

    const updateOrder = useOrdersStore(s => s.updateOrder);

    const fetchOrder = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/order/${orderId}/`);
            setOrderData(response.data);
            setStatus(response.data.status);
            
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder(); 
    }, [orderId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status !== orderData?.status) {
            try {
                await updateOrder(orderId, status); 
                setFormActive(false);
                fetchOrder(); 
            } catch (error) {
                console.log("Error updating the order: ", error);
            }
        }
    };

    const handleDelete = async () => {
        try { 
            const response = await axiosInstance.delete(`/admin-user/orders/${orderId}/delete/`);
            if (response.status === 204){
                navigate('/dashboard', { state: { message: "Order successfully deleted!" } });
                setNotificationOpen(false);
            }
        }catch (error) {
            console.log("Error deleting the order: ", error);
        }
    }

    useEffect(() => {
        console.log(orderData)
    }, [orderData])

    return(
        <>
        <div 
        className={notificationOpen ? "overlay show" : "overlay"}
        onClick={() => setNotificationOpen(false)}
        >
        </div>

        
        <div className="order-details">


            <form onSubmit={handleSubmit}>
            <div className="order-details-container">

                <div className={notificationOpen ? "confirm-notification-container show-flex" : "confirm-notification-container"}>
                    <p>Wollen Sie den Auftrag löschen?</p>
                    <div className="notification-btn-container">
                        <button 
                        className="notification-btn-confirm"
                        onClick={handleDelete}
                        >Löschen</button>
                        <button 
                        className="notification-btn-cancel"
                        onClick={() => setNotificationOpen(false)}
                        >Abbrechen</button>
                    </div>
                </div>

                <div className="order-details-title">

                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <FaFileAlt style={{fontSize: '25px', color: 'rgb(76, 121, 212)', marginBottom: '4px'}}/>
                        <div style={{display: 'flex'}}>
                            <h1>Auftrags</h1>
                            <h1 className="header-span">übersicht</h1>
                        </div>
                    </div>

                    <div className="order-btn-container">

                    <button
                        className="order-action-btn green-btn"
                        type="submit"
                        style={{display: formActive ? "flex" : "none"}}
                        >
                        
                        <FaCheck style={{ fontSize: '18px' }} /> Speichern
                            
                    </button>

                    <button
                        className="order-action-btn green-btn"
                        onClick={() => setFormActive(true)}
                        type="button"
                        style={{display: formActive ? "none" : "flex"}}
                        >
                        
                        <MdEditSquare style={{ fontSize: '18px' }} /> Bearbeiten
                            
                    </button>

                    <button 
                        className="order-action-btn red-btn"
                        onClick={() => {
                            if (formActive) {
                                setFormActive(false);
                            } else {
                                setNotificationOpen(true);
                            }
                        }}
                        type="button"
                        >
                        {formActive ? (
                            <>
                            <RxCross2 style={{fontSize: '18px'}}/> Abbrechen
                            </>
                        ) : (
                            <>
                            <FaRegTrashAlt style={{fontSize: '18px'}}/> Löschen
                            </>
                        )}
                    </button>
                    
                    </div>

                </div>

                <Divider orientation="horizontal" style={{marginTop: '1.5rem'}}/>

                {isLoading ? (

                    <div className="spinner-container">
                        <CircularProgress style={{width: 50, height: 50, marginTop: "10rem"}}/>
                    </div>

                ) : (

                    <div className="order-details-content">

                    <div className="order-details-top">

                        <div className="order-details-header">
                            <h3>{`# ro-${orderData?.id}`}</h3>
                            <p>Bestellt am {orderData?.formatted_timestamp}</p>
                        </div>

                        <div className="order-details-status">
                            <p>Status: {statusValues[orderData?.status]}</p>
                            <div className={(orderData?.status === "review" || orderData?.status === "progress") && "order-status yellow-div"}></div>

                                <FormControl style={{display: formActive ? "block" : "none", }}>
                                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Age" 
                                    style={{width: '150px'}}
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}>
                                    {Object.keys(statusValues).map((key) => (
                                    <MenuItem key={key} value={key}>
                                        {statusValues[key]}
                                    </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                        </div>

                    </div>

                    

                    <Divider orientation="horizontal" sx={{background: 'rgb(76, 121, 212)', marginTop: '2rem'}}/>

                    <div className="order-details-contacts">
                    <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><MdInfoOutline style={{fontSize: '25px', color: 'rgb(76, 121, 212)'}}/>Kontaktinformationen</h3>
                        <p className="order-details-item"><IoPersonSharp style={{fontSize: '22px', color: 'rgb(76, 121, 212)'}}/> {orderData?.name}</p>
                        <p className="order-details-item"><FaPhone style={{fontSize: '22px', color: 'rgb(76, 121, 212)'}}/> {orderData?.phone_number}</p>
                        <p className="order-details-item"><MdLocationPin style={{fontSize: '25px', color: 'rgb(76, 121, 212)'}}/> {`${orderData?.street}, ${orderData?.zip} ${orderData?.city}`}</p>
                        <button className="profile-btn" onClick={() => navigate(`/user/${orderData?.user}`)}><FaUserAlt/>{orderData?.name}<FaArrowRightLong/></button>
                    </div>

                    <Divider orientation="horizontal" sx={{background: 'rgb(76, 121, 212)', marginTop: '2rem', marginBottom: '2rem'}}/>

                    <div className="order-details-message">
                        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><BiMessageDetail style={{fontSize: '25px', color: 'rgb(76, 121, 212)'}}/>Nachricht</h3>
                        <p className="order-details-item">{orderData?.message || 'Sie haben keine Nachricht gelassen.'}</p>
                        
                    </div>

                    <Divider orientation="horizontal" sx={{background: 'rgb(76, 121, 212)', marginTop: '2rem', marginBottom: '2rem'}}/>

                    <div>
                        <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><FiPaperclip style={{fontSize: '25px', color: 'rgb(76, 121, 212)'}}/>Dateien</h3>
                        {orderData?.files.length != 0 ? (
                            <div className="files-container" style={{marginTop: '2rem'}}>
                                {orderData?.files.map((file, index) => (
                                    <div key={index} className="file-container">
                                        <FaFile style={{fontSize: '40px', color: 'rgb(76, 121, 212)'}}/>
                                        <p>{file.file_name.length > 15 ? `${file.file_name.slice(0, 12)}...` : file.file_name}</p>
                                        <p>{`${file.file_size} MB`}</p>
                                        <button className="download-btn" onClick={() => window.open(file.file, '_blank')}><IoMdDownload/></button>
                                    </div>
                                ))}
                            </div>
                        ):
                        (
                            <div className="files-container" style={{marginTop: '2rem'}}>
                                <p>Keine Daten vorhanden.</p>
                            </div>
                        )
                        }
                    </div>



                </div>

                )}

                


            </div>
            </form>
        </div>
        </>
    )
}


export default OrderDetails;