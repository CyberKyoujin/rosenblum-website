import React, { useState } from "react";
import Divider from '@mui/material/Divider';
import { SiGooglemessages } from "react-icons/si";
import { useEffect } from "react";
import useAuthStore from "../zustand/useAuthStore";
import { useNavigate } from "react-router-dom";
import smallLogo from '../assets/logo2.png'
import { MdWidthFull } from "react-icons/md";
import { RiMailSendLine } from "react-icons/ri";
import { Textarea } from '@mui/base/TextareaAutosize';


const Messages = () => {

    const { fetchUserMessages, userMessages, fetchUserData, userData, user, toggleMessages, sendMessage } = useAuthStore.getState();

    const [message, setMessage] = useState<string>('');

    const navigate = useNavigate();
    

    useEffect(() => {
        fetchUserData();
        fetchUserMessages();
        toggleMessages();
    }, [toggleMessages, fetchUserMessages])

    const sortMessagesAscending = () => {
        return userMessages?.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sendMessage( message );
            setMessage('');

        } catch (error) {
            console.error("Error sending message:", error);
           
        }
    };

    return(
        <div className="messages-container">

            <div className="messages-title-container">
                <SiGooglemessages style={{fontSize: '45px', color: 'rgb(76, 121, 212)'}}/>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <h1>Ihre</h1>
                    <h1 className="header-span">Nachrichten</h1>  
                </div>
            </div>

            <Divider sx={{marginTop: '1rem'}}/>

            <div className="messages-main-container">
                {userMessages?.length > 0 ? (

                    sortMessagesAscending()?.map((message) => (
                        <div key={message.id} className={`message ${message.sender === user?.id ? 'message-user' : ''}`} onClick={() => navigate('/messages')}>
                            <img src={message.sender === user?.id ? user.profile_img_url || userData?.image_url : smallLogo} alt="" className="message-avatar"/>
                            <div className="message-item">
                                <div className="message-body" style={{background: message.sender === user?.id && 'rgb(177, 203, 248)'}}>
                                    <p>{message.message}</p>
                                </div>
                                <p className="timestamp" style={{textAlign: message.sender === user?.id && 'right'}}>{message.formatted_timestamp}</p>
                            </div>
                        </div>
                    ))

                ) 
                : 
                (
                    <div className="no-messages-container">
                        <SiGooglemessages style={{fontSize: '80px', color: 'rgb(76 121 212)'}}/>
                        <p>Sie haben noch keine Nachrichten</p>
                    </div>
                )}
            </div>

            <form className="message-input-container" onSubmit={handleSubmit}>
                <textarea type="text" className="message-input" onChange={(e) => setMessage(e.target.value)}/>
                

                <button className="send-message-container hover-btn" type="submit">
                    <RiMailSendLine/>
                </button>

            </form>

        </div>
    )
}


export default Messages