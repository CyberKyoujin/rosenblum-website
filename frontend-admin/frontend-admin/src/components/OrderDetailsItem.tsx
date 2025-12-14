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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Order, statusColors, StatusKeys, statusValues } from "../types/order";
import { SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";


interface OrderDetailsItemProps {
    orderData: Order;
    status: string;
    setStatus: React.Dispatch<SetStateAction<string>>;
    formActive: boolean;
    orderType: string;
    setOrderType: React.Dispatch<SetStateAction<string>>;
}

const orderTypeValues = {
    "order": "Auftrag",
    "costs_estimate": "Kostenvoranschlag"
}

type OrderTypeKeys = 'order' | 'costs_estimate';

const OrderDetailsItem = ({

    orderData,
    status,
    setStatus,
    orderType,
    setOrderType,
    formActive

    }: OrderDetailsItemProps) => {

    
    const navigate = useNavigate();

    const {id, name, formatted_timestamp, phone_number, street, city, zip, files} = orderData;

    return(
         <div className="order-details-content">
        
                            <div className="order-details-top">
        
                                <div className="order-details-header">
                                    
                                    <h3>{`# ro-${id}`}</h3>
                                    <p>Bestellt am {formatted_timestamp}</p>
                                    <p>Auftragstyp: {orderTypeValues[orderType as OrderTypeKeys]}</p>

                                    <FormControl style={{display: formActive ? "block" : "none"}}>

                                            <InputLabel id="demo-simple-select-label">Typ</InputLabel>

                                            <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Age" 
                                            style={{width: '180px'}}

                                            value={orderType}

                                            onChange={(e) => setOrderType(e.target.value)}>

                                            {Object.keys(orderTypeValues).map((key) => (

                                                <MenuItem key={key} value={key}>
                                                    {orderTypeValues[key as OrderTypeKeys]}
                                                </MenuItem>

                                            ))}

                                            </Select>

                                    </FormControl>

                                </div>
        
                                <div className="order-details-status">
        
                                        <p>Status: {statusValues[status as StatusKeys]}</p>

                                        <div className="order-status"
                                            style={{backgroundColor: statusColors[status as StatusKeys]}}
                                        />
        
                                        <FormControl style={{display: formActive ? "block" : "none"}}>

                                            <InputLabel id="demo-simple-select-label">Status</InputLabel>

                                            <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Age" 
                                            style={{width: '180px'}}

                                            value={status}

                                            onChange={(e) => setStatus(e.target.value)}>

                                            {Object.keys(statusValues).map((key) => (

                                                <MenuItem key={key} value={key}>
                                                    {statusValues[key as StatusKeys]}
                                                </MenuItem>

                                            ))}

                                            </Select>

                                        </FormControl>
                                </div>
        
                            </div>
        
                            <Divider className="order-details-divider"/>
        
                            <div className="order-details-contacts">

                                <h3>

                                    <MdInfoOutline className="order-details-icon"/>
                                    Kontaktinformationen

                                </h3>
                                
                                <p className="order-details-item"><IoPersonSharp className="order-details-icon"/> {name}</p>
                                <p className="order-details-item"><FaPhone className="order-details-icon"/> {phone_number}</p>
                                <p className="order-details-item"><MdLocationPin className="order-details-icon"/> {`${street}, ${zip} ${city}`}</p>

                                <button className="profile-btn" onClick={() => navigate(`/user/${orderData?.user}`)}>
                                    <FaUserAlt/>
                                    {orderData?.name}
                                    <FaArrowRightLong/>
                                </button>

                            </div>
        
                            <Divider className="order-details-divider"/>
        
                            <div className="order-details-message">

                                <h3><BiMessageDetail className="order-details-icon"/>Nachricht</h3>
                                <p className="order-details-item">{orderData?.message || 'Sie haben keine Nachricht gelassen.'}</p>
                                
                            </div>
        
                            <Divider className="order-details-divider"/>
        
                            <div>

                                <h3>
                                    <FiPaperclip className="order-details-icon"/>
                                    Dateien
                                </h3>

                                {files.length != 0 ? (

                                    <div className="files-container" style={{marginTop: '2rem'}}>

                                        {orderData?.files.map((file, index) => (

                                            <div key={index} className="file-container">

                                                <FaFile size={40} className="app-icon"/>

                                                <p>{file.file_name.length > 15 ? `${file.file_name.slice(0, 12)}...` : file.file_name}</p>
                                                <p>{`${file.file_size} MB`}</p>
                                                
                                                <button className="download-btn" onClick={() => window.open(file.file, '_blank')}><IoMdDownload/></button>

                                            </div>

                                        ))}

                                    </div>

                                ) : (

                                    <div className="files-container" style={{marginTop: '2rem'}}>
                                        <p>Keine Daten vorhanden.</p>
                                    </div>

                                )
                                }
                            </div>
        
        
        
                        </div>
    )
}

export default OrderDetailsItem