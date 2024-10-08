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

    const { orderId } = useParams();
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [formActive, setFormActive] = useState<boolean>(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try{
                const response = await axiosInstance.get(`/order/${orderId}/`);
                setOrderData(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchOrder();
    }, [])

    const navigate = useNavigate();

    return(
        <div className="order-details">
            <div className="order-details-container">

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
                        onClick={() => setFormActive(!formActive)}
                        >
                        {formActive ? (
                            <>
                            <FaCheck style={{ fontSize: '18px' }} /> Speichern
                            </>
                        ) : (
                            <>
                            <MdEditSquare style={{ fontSize: '18px' }} /> Bearbeiten
                            </>
                        )}
                    </button>

                    <button 
                        className="order-action-btn red-btn"
                        onClick={() => setFormActive(!formActive)}
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
                                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Age" style={{width: '150px'}}>
                                    <MenuItem value="wird überprüft">wird überprüft</MenuItem>
                                    <MenuItem value="wird bearbeitet">wird bearbeitet</MenuItem>
                                    <MenuItem value="bei Martha">bei Martha</MenuItem>
                                    <MenuItem value="erledigt">erledigt</MenuItem>
                                    <MenuItem value="per Post geschickt">per Post geschickt</MenuItem>
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


            </div>
        </div>
    )
}


export default OrderDetails;