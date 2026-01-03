import React from "react";
import useAuthStore from "../zustand/useAuthStore";
import Divider from '@mui/material/Divider';
import { Link } from "react-router-dom";
import { SiGooglemessages } from "react-icons/si";
import { useTranslation } from "react-i18next";
import useMessageStore from "../zustand/useMessageStore";
import MessagesDropdownDisplaySection from "./MessagesDropdownDisplaySection";

interface Props {
    isOpened: boolean;
}

const MessagesDropdown: React.FC<Props> = ({ isOpened }) => {

    const user = useAuthStore(s => s.user);
    const userMessages = useMessageStore(s => s.messages);
    
    const {t} = useTranslation();

    const messages = userMessages?.filter((message) => message.receiver === user?.id);
    const slicedMessages = messages?.slice(0,3)

    return (
        <div className={`messages-dropdown ${isOpened ? 'show-messages-dropdown' : ''}`}>

            {messages && messages?.length > 0 ? (

                <MessagesDropdownDisplaySection messages={slicedMessages}/>
            ) 
            : 
            (   
                <>

                    <div className="no-messages">
                        <SiGooglemessages className="app-icon" size={40}/>
                        <p>{t('noMessages')}</p>
                    </div>

                    <Divider />

                </>
                
            )}

            <Link to="/messages" className="messages-footer app-link">
                
                <button className="messages-btn">
                    {t('allMessages')}
                </button>

            </Link>

        </div>
    );
};

export default MessagesDropdown;