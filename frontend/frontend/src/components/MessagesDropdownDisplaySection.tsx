import React from 'react';
import { Message } from '../types/messages';
import Divider from '@mui/material/Divider';
import smallLogo from '../assets/logo2.webp'
import { Link } from 'react-router-dom';

interface MessagesDropdownDisplaySectionProps {
    messages: Message[] | undefined;
}

const MessagesDropdownDisplaySection: React.FC<MessagesDropdownDisplaySectionProps> = ({messages}) => {
    return (
        <>
            {messages?.map((message) => (

                    <React.Fragment key={message.id}>

                        <Link to="/messages" className="message-container app-link">

                            <img src={smallLogo} loading="lazy" alt="" style={{width: '45px', height: '45px'}} />

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
                            
                        </Link>

                        <Divider />

                    </React.Fragment>

                ))}
        </>
    );
}

export default MessagesDropdownDisplaySection;
