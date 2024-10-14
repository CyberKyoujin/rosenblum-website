import React, { useEffect, useState } from "react";
import { LuContact } from "react-icons/lu";
import Divider from '@mui/material/Divider';
import { FaMapLocationDot } from "react-icons/fa6";
import { FaSquarePhone } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { RiContactsFill } from "react-icons/ri";
import { FaClock } from "react-icons/fa6";
import Footer from "../components/Footer";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IoWarningOutline } from "react-icons/io5";
import useAuthStore from "../zustand/useAuthStore";
import { Alert } from "@mui/material";
import { t } from "i18next";
import sutthausen1 from "../assets/sutthausen1.jpg"


const ContactUs = () => {

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [number, setNumber] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const [successfullySent, setSuccessfullySent] = useState<boolean>(false);

    const {sendRequest} = useAuthStore.getState();

    useEffect(() => {
        if(successfullySent){
            const timeout = setTimeout(() =>{
                setSuccessfullySent(false);
            }, 5000);

            return () => clearTimeout(timeout)
        }
    }, [successfullySent])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{

            await sendRequest(name, email, number, message);
            setSuccessfullySent(true);

        } catch(error: any) {

            console.error(error.mesage);

        }
    }

    return (
        <>
        <div style={{padding: '1rem 2rem'}}>
            <div className="contact-main-container">
                <div className="contact-title">
                    <LuContact style={{fontSize: '40px', color: 'rgb(76 121 212)'}}/>
                    <div className="contact-title-container">
                        <h1>{t('contactSmall')}</h1>
                    </div>
                </div>

                <Divider style={{marginTop: '1rem', marginBottom: '1rem'}}/>

                <div className="contact-info-container">

                    <div className="main-info contact-gap">

                        <div className="main-info-title">
                            <RiContactsFill style={{fontSize: '25px', color: 'rgb(76 121 212)'}}/>
                            <h3>{t('contactInformation')}</h3>
                        </div>

                        <div className="info-item">
                            <FaMapLocationDot style={{fontSize: '25px', color: 'rgb(76 121 212)'}}/>
                            <p>Sutthauser Str. 23, 49080 Osnabrück</p>
                        </div>

                        <div className="info-item">
                            <FaSquarePhone style={{fontSize: '25px', color: 'rgb(76 121 212)'}}/>
                            <p>+49 17677353978</p>
                        </div>

                        <div className="info-item" >
                            <IoMail style={{fontSize: '25px', color: 'rgb(76 121 212)'}}/>
                            <p>olegrosenblum@freenet.de</p>
                        </div>

                    </div>

                    
                    <div className="hours-info">

                        <div className="hours-title">
                            <FaClock className="hours-icon"/>
                            <h3>{t('hours')}</h3>
                            <p className="hours-detail">{"(" + t('hours') + ")"}</p>
                        </div>

                        <div className="hours-items-container">

                            <div className="hours-dots hours-item-container">
                                <p><GoDotFill className="dot-icon"/> Montag</p>
                                <p><GoDotFill className="dot-icon"/> Dienstag</p>
                                <p><GoDotFill className="dot-icon"/> Mittwoch</p>
                                <p><GoDotFill className="dot-icon"/> Donnerstag</p>
                                <p><GoDotFill className="dot-icon"/> Freitag</p>
                            </div>
                            <div className="hours-item-container">
                                <p>9:00-12:00</p>
                                <p>15:00-18:00</p>
                                <p>15:00-18:00</p>
                                <p>9:00-12:00</p>
                                <p>9:00-12:00</p>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="map-container">
                    <img src={sutthausen1} alt="" className="map-img"/>
                   <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4883.597447767886!2d8.048247212787198!3d52.26519995494562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b9e5859eaa8cdb%3A0x7060899a7a6ade65!2sOleg%20Rosenblum%20%C3%9Cbersetzungsb%C3%BCro!5e0!3m2!1sen!2sde!4v1710683696231!5m2!1sen!2sde" className="map"  loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>

                <Divider style={{marginTop: '3rem', marginBottom: '2rem'}}/>

                <div className="contact-form-title">
                    <h1 className="header-span">{t('contactUs')}</h1>
                    <h1>{t('us') + " !"}</h1>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <Alert severity="success" style={{border: '1px solid green', borderRadius: '0', padding: '0.6rem', display: !successfullySent && 'none'}}>Ihre Anfrage wurde erfolgreich versandt!</Alert>
                    <TextField required id="outlined-basic" label={name ? "" : t('name')} variant="outlined" style={{width: '100%'}} value={name} onChange={(e) => setName(e.target.value)}/>
                    <TextField required id="outlined-basic" label={email ? "" : t('email')} variant="outlined" style={{width: '100%'}} value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <div className={"phone-notification show-notification"}>
                        <IoWarningOutline className="warning-icon"/>
                        <p>{t('onlyGerman')}</p>
                    </div>
                    <TextField value={number} type="number" required id="outlined-basic" label={number ? "" : t('phoneNumber')} variant="outlined" style={{width: '100%'}}  onChange={(e) => setNumber(e.target.value)}/>
                    <TextField required multiline label={t('yourMessage')} variant="outlined" style={{width: '100%'}}  onChange={(e) => setMessage(e.target.value)} rows={10}/>
                    <button className="contact-btn hover-btn" type="submit">{t('send')}</button>
                </form>



            </div>
        </div>
        <Footer/>
        </>
    )
}


export default ContactUs