import React, { useState, useRef } from "react";
import Divider from '@mui/material/Divider';
import { SiGooglemessages } from "react-icons/si";
import { useEffect } from "react";
import useAuthStore from "../zustand/useAuthStore";
import { useNavigate } from "react-router-dom";
import smallLogo from '../assets/logo2.png'
import { RiMailSendLine } from "react-icons/ri";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

const Messages = () => {

    const { fetchUserMessages, userMessages, fetchUserData, userData, user, toggleMessages, sendMessage } = useAuthStore.getState();

    const [message, setMessage] = useState<string>('');
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    

    useEffect(() => {
        fetchUserData();
        fetchUserMessages();
        toggleMessages();
    }, [toggleMessages, fetchUserMessages])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [userMessages]);

    const sortMessagesAscending = () => {
        return userMessages?.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(message.length > 0) {
        try {
            await sendMessage( message );
            fetchUserMessages();
            setMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
           
        }
        } else {
            setMessage('');
        }
    };

    const autoExpand = (e: any) => {
        const element = e.target as HTMLTextAreaElement;
        element.style.height = 'auto';
        const computed = window.getComputedStyle(element);
        let height = element.scrollHeight; 
        height += parseInt(computed.getPropertyValue('border-top-width'), 10)
               + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
        element.style.height = `${height}px`;
    };

    return(

        <div className="messages-container">

        <div role="presentation" style={{marginBottom: '3rem'}}>
            <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">Home</Link>
            <Typography color="text.primary">Nachrichten</Typography>
            </Breadcrumbs>
        </div>

            <div className="messages-title-container">
                <SiGooglemessages style={{fontSize: '45px', color: 'rgb(76, 121, 212)'}}/>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <h1>Ihre</h1>
                    <h1 className="header-span">Nachrichten</h1>  
                </div>
            </div>

            <Divider sx={{marginTop: '1rem'}}/>

            <div className="messages-main-container" id="scroll-div" ref={messagesEndRef}>
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
                <textarea type="text" className="message-input" value={message} onChange={(e) => {setMessage(e.target.value); autoExpand(e);}} 
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault(); 
                        handleSubmit(e); 
                    }
                }}
                oninput="autoExpand(this)"
                />
                

                <button className="send-message-container hover-btn" type="submit">
                    <RiMailSendLine/>
                </button>

            </form>

        </div>
        
    )
}


export default Messages