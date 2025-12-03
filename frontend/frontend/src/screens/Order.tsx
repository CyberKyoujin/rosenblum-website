import React, { useEffect, useState, DragEvent, useRef } from "react";
import Divider from '@mui/material/Divider';
import { GrContactInfo } from "react-icons/gr";
import TextField from '@mui/material/TextField';
import useAuthStore from "../zustand/useAuthStore";
import sendIcon from '../assets/send_icon.webp'
import { IoWarningOutline } from "react-icons/io5";
import parsePhoneNumber from 'libphonenumber-js'
import { BiSolidMessageDetail } from "react-icons/bi";
import { PiUploadFill } from "react-icons/pi";
import Footer from "../components/Footer";
import { FaFile } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import useOrderStore from "../zustand/useOrderStore";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import { ApiErrorResponse } from "../types/error";
import NavigationSection from "../components/NavigationSection";
import OrderSectionHeader from "../components/OrderSectionHeader";
import OrderInfoAccordion from "../components/OrderInfoAccordion";
import OrderFormGroup from "../components/OrderFormGroup";


const Order = () => {

    const { user, userData } = useAuthStore();

    const createOrderLoading  = useOrderStore(s=> s.createOrderLoading);
    const createOrder = useOrderStore(s => s.createOrder);

    const [createOrderError, setCreateOrderError] = useState<ApiErrorResponse | null>(null);

    const [name, setName] = useState(user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '')
    const [email, setEmail] = useState(user?.email || '');
    const [number, setNumber] = useState(userData?.phone_number || '')
    const [showNotification, setShowNotification] = useState<boolean>(true);
    const [city, setCity] = useState(userData?.city || '')
    const [street, setStreet] = useState(userData?.street || '')
    const [plz, setPlz] = useState(userData?.zip || '')
    const [message, setMessage] = useState('')

    const {t} = useTranslation();
    const navigate = useNavigate();

    const [dragging, setDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isAtTop = useIsAtTop(10);

    const handleFiles = (newFiles: File[]) => {
        setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
      };
    
      const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.items) {
          const newFiles = Array.from(e.dataTransfer.items)
            .filter(item => item.kind === 'file')
            .map(item => item.getAsFile())
            .filter((file): file is File => file !== null);
          handleFiles(newFiles);
          e.dataTransfer.clearData();
        }
      };
    
      const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!dragging) {
          setDragging(true);
        }
      };
    
      const handleDragLeave = () => {
        setDragging(false);
      };
    
      const handleClick = () => {
        fileInputRef.current?.click();
      };
    
      const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const filesArray: File[] = Array.from(e.target.files);
          handleFiles(filesArray);
        }
      };
    
      const removeFile = (index: number) => {
        setUploadedFiles(currentFiles => currentFiles.filter((_, fileIndex) => fileIndex !== index));
      };

    const validatePhoneNumber = (number: string) => {
        try {
            const phoneNumber = parsePhoneNumber(number, 'DE');
            return !phoneNumber || !phoneNumber.isValid();
        } catch(error) {
            return true;
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        setCreateOrderError(null);

        const formData = new FormData();
        uploadedFiles.forEach(file => {
            formData.append('files', file); 
        });
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone_number', number);
        formData.append('city', city);
        formData.append('street', street);
        formData.append('zip', plz);
        formData.append('message', message);

        try {
            await createOrder(formData);
            navigate("/profile", {state: {orderCreateSuccess: true}});
        } catch (err: unknown){ 

            setCreateOrderError(err as ApiErrorResponse);

        }
        
        
    }

    useEffect(() => {
        setShowNotification(validatePhoneNumber(number));
    }, [number])
    

    return(

        <>
        
        <div className="main-app-container">

            <ApiErrorAlert error={createOrderError} belowNavbar={isAtTop} fixed/>

            <NavigationSection first_link="Auftrag"/>

            <form className="order-container" onSubmit={handleSubmit} style={{marginTop: '2rem'}}>


                <div className="order-title">
                    <div className="order-title-text">
                        <h1>{t('documents')}</h1>
                        <h1 className="header-span">{t('sendSmall')}</h1>
                    </div>
                    <div>
                        <img src={sendIcon} alt="" className="send-icon" loading="lazy"/>
                    </div>
                </div>

                <Divider flexItem orientation="horizontal" style={{height: '32px'}}/>

                <OrderSectionHeader Icon={GrContactInfo} headerText={t('contactInformation')}/>

                <div className="order-contacts-content">
                    <TextField required id="outlined-basic" label={name ? "" : t('name')} variant="outlined" style={{width: '100%'}} value={name} onChange={(e) => setName(e.target.value)}/>
                    <TextField required id="outlined-basic" label={email ? "" : t('email')} variant="outlined" style={{width: '100%'}} value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <div className={showNotification ? "phone-notification show-notification" : 'phone-notification'}>
                        <IoWarningOutline className="warning-icon"/>
                        <p>{t('onlyGerman')}</p>
                    </div>
                    <TextField value={number} type="number" required id="outlined-basic" label={number ? "" : t('phoneNumber')} variant="outlined" style={{width: '100%'}}  onChange={(e) => setNumber(e.target.value)}/>
                    <TextField value={city} required id="outlined-basic" label={city ? "" : t('city')} variant="outlined" style={{width: '100%'}}  onChange={(e) => setCity(e.target.value)}/>
                    <TextField value={street} required id="outlined-basic" label={street ? "" : t('street')} variant="outlined" style={{width: '100%'}} onChange={(e) => setStreet(e.target.value)}/>
                    <TextField value={plz} type="number" required id="outlined-basic" label={plz ? "" : t('zip')} variant="outlined" style={{width: '100%'}}  onChange={(e) => setPlz(e.target.value)}/>
                </div>

                <Divider flexItem orientation="horizontal" style={{height: '32px', marginTop: '1rem'}}/>

                <OrderSectionHeader Icon={BiSolidMessageDetail} headerText={t('yourMessageSecond')}/>

                <OrderInfoAccordion/>

                <div className="order-contacts-content">
                    <TextField type="number" multiline label={t('yourMessage')} variant="outlined" style={{width: '100%'}}  onChange={(e) => setMessage(e.target.value)} rows={10}/>
                </div>

                <OrderFormGroup/>

                <Divider flexItem orientation="horizontal" style={{height: '32px', marginTop: '1rem'}}/>

                <OrderSectionHeader Icon={PiUploadFill} headerText={t('uploadDocuments')}/>

                <div className="phone-notification show-notification" style={{marginTop: '2rem'}}>
                        <IoWarningOutline className="warning-icon"/>
                        <p>{t('qualityDocuments')}</p>
                </div>
                

                <div className="order-contacts-content">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={handleClick}
                        className="file-upload"
                          >
                        <PiUploadFill style={{fontSize: '50px', color: 'rgb(76, 121, 212)'}}/>
                        <p style={{fontSize: '20px'}}>{t('uploadArea')}</p>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }} 
                        multiple 
                        accept=".jpg,.png,.jpeg,.pdf,.doc,.docx,.xlsx"
                    />

                    <div>

                        {uploadedFiles.length > 0 && (
                            <div className="files-container">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="file-container">
                                        <FaFile style={{fontSize: '40px', color: 'rgb(76, 121, 212)'}}/>
                                        <p>{file.name.length > 10 ? `${file.name.slice(0, 10)}...` : file.name}</p>
                                        <button className="file-remove-btn" onClick={() => removeFile(index)}><RiDeleteBin6Fill style={{fontSize: '20px'}}/></button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                    </div>
        
                    <button type="submit" className="send-btn hover-btn">
                        {createOrderLoading ? (<CircularProgress style={{color: "white"}}/>): <>{t('send')} <IoSendSharp/></>}
                    </button>

                </div>

            </form>
            
        </div>

        <Footer/>

        </>
        
        
    )
}


export default Order