import React from "react";
import { useEffect } from "react";
import useAuthStore from "../zustand/useAuthStore";
import smallLogo from '../assets/logo2.png'
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";
import { SiGooglemessages } from "react-icons/si";


interface Props {
    isOpened: boolean;
}

const MessagesDropdown: React.FC<Props> = ({ isOpened }) => {
    const { fetchUserMessages, userMessages, toggleMessages } = useAuthStore.getState();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserMessages();
    }, [fetchUserMessages]);

    return (
        <div className={`messages-dropdown ${isOpened ? 'show-messages-dropdown' : ''}`}>
            {userMessages?.length > 0 ? (
                userMessages?.slice(0, 3).map((message) => (
                    <React.Fragment key={message.id}>
                        <div className="message-container">
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
                        <p>Sie haben noch keine Nachrichten</p>
                    </div>

                    <Divider />
                </>
                
            )}
            <div className="messages-footer">
                <button className="messages-btn" onClick={() => { toggleMessages(); navigate('/messages'); }}>
                    Alle Nachrichten
                </button>
            </div>
        </div>
    );
};

export default MessagesDropdown;