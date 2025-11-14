import React from "react";
import { useEffect } from "react";
import useAuthStore from "../zustand/useAuthStore";
import smallLogo from '../assets/logo2.png'
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";
import { SiGooglemessages } from "react-icons/si";
import { useTranslation } from "react-i18next";


interface Props {
    isOpened: boolean;
}

const MessagesDropdown: React.FC<Props> = ({ isOpened }) => {
    const { userMessages, toggleMessages, user } = useAuthStore.getState();
    const navigate = useNavigate();

    const {t} = useTranslation();

    const messages = userMessages?.filter((message) => message.receiver === user?.id)

    return (
        <div className={`messages-dropdown ${isOpened ? 'show-messages-dropdown' : ''}`}>
            {messages && messages?.length > 0 ? (
                messages?.slice(0, 3).map((message) => (
                    <React.Fragment key={message.id}>
                        <div className="message-container" onClick={() => navigate('/messages')}>
                            <img src={smallLogo} alt="" style={{width: '45px', height: '45px'}} />
                            <div className="message-content">
                                <div className="message-timestamp">
                                    <p style={{fontWeight: 'bold', fontSize: '14px', marginLeft: 'auto'}}>Rosenblum Übersetzungsbüro</p>
                                    <p style={{fontSize: '12px', color: 'grey', marginRight: 'auto', marginTop: '4px'}}>{message.formatted_timestamp}</p>
                                </div>
                                <p style={{fontSize: '12px'}}>
                                    {message.message ? (
                                        message.message.length > 40 ? message.message.slice(0, 40) + '...' : message.message
                                    ) : 'No message content'}
                                </p>
                            </div>
                            <div className="viewed-container" style={{display: message.viewed ? 'none' : 'block'}} />
                        </div>
                        <Divider />
                    </React.Fragment>
                ))
            ) 
            : 
            (   
                <>
                    <div className="no-messages">
                        <SiGooglemessages style={{fontSize: '40px', color: 'rgb(76 121 212)'}}/>
                        <p>{t('noMessages')}</p>
                    </div>

                    <Divider />
                </>
                
            )}
            <div className="messages-footer" onClick={() => { toggleMessages(); navigate('/messages'); }}>
                <button className="messages-btn">
                    {t('allMessages')}
                </button>
            </div>
        </div>
    );
};

export default MessagesDropdown;