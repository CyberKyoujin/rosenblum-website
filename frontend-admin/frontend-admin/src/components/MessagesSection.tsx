import { useEffect, useMemo, useRef } from "react";
import { Message } from "../types/message";
import defaultAvatar from "../assets/default_avatar.webp"
import smallLogo from '../assets/logo2.png'
import { IoMdDownload } from "react-icons/io";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoCheckmarkSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaFile } from "react-icons/fa";
import { SiGooglemessages } from "react-icons/si";
import { User } from "../types/user";
import { CustomerData } from "../types/customer";
import ComponentLoading from "./ComponentLoading";

interface MessagesSectionProps {
    messages: Message[];
    userId: number;
    user: User;
    customerData: CustomerData;
    loading: boolean;
}

const MessagesSection = ({messages, userId, user, customerData, loading} : MessagesSectionProps) => {

    const navigate = useNavigate();

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = defaultAvatar; 
        console.error("Failed to load user image from URL:", e.currentTarget.src);
    }; 
    
    const sortedMessages = useMemo(() => {
    if (!messages) return [];
    return [...messages].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    }, [messages]);

    useEffect(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
            }
    }, [messages]); 

    const userAvatar = customerData?.profile_img || customerData?.profile_img_url || defaultAvatar

    return(

        <div className="messages-main-container" id="scroll-div" ref={messagesEndRef}>

                    {loading ? (

                      <ComponentLoading/>

                    ) : messages && messages.length > 0 ? 
                    
                    (sortedMessages.map((message) => (

                        <div
                        key={message.id}
                        className={`message ${message.sender === userId ? '' : 'message-user'}`}>

                            <img
                                src={
                                message.sender === userId
                                    ? userAvatar
                                    : smallLogo
                                }
                                className="message-avatar"
                                onError={handleImageError}
                                referrerPolicy="no-referrer"
                                onClick={() => navigate(`/user/${userId}`)}
                            />

                            <div className="message-item">

                                <div
                                className="message-body"
                                style={{
                                    background:
                                    message.sender === user?.id ? 'rgb(177, 203, 248)' : undefined,
                                }}>

                                <p>{message.message}</p>

                                </div>

                                {message.files.length > 0 && (

                                <div className="small-files-container">

                                    {message.files.map((file) => (

                                    <div className="small-file-container" key={file.id || file.file_name}>

                                        <FaFile style={{ color: 'rgb(76,121,212)', fontSize: '30px' }} />
                                        <p>
                                        {file.file_name?.length > 8
                                            ? file.file_name.slice(0, 7) + '...'
                                            : file.file_name}
                                        </p>

                                        <p>{file.file_size} MB</p>

                                        <button className="download-btn-small" onClick={() => window.open(file.file, '_blank')}><IoMdDownload/></button>

                                    </div>

                                    ))}

                                </div>

                                )}

                                <div className="message-timestamp">

                                        {message.sender === user?.id && (
                                            message.viewed ? <IoCheckmarkDoneSharp size={22} className="app-icon"/> : <IoCheckmarkSharp className="app-icon" />
                                        )}

                                        <p
                                        className="timestamp"
                                        style={{
                                            textAlign: message.sender === user?.id ? 'right' : 'left',
                                        }}
                                        >
                                        {message.formatted_timestamp}
                                        </p>
                                        
                                </div>

                            </div>

                        </div>
                    ))

                    ) : (

                    <div className="no-messages-container">

                        <SiGooglemessages style={{ fontSize: '80px', color: 'rgb(76 121 212)' }} />
                        <p>Sie haben noch keine Nachrichten</p>

                    </div>

                    )}

                </div>

    )
}

export default MessagesSection