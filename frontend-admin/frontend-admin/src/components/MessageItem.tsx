import { Message } from "../types/message"
import defaultAvatar from "../assets/default_avatar.webp"
import { useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/useAuthStore";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoCheckmarkSharp } from "react-icons/io5";


const MessageItem = ({id, formatted_timestamp, files, message, partner_data, viewed, sender, receiver, sender_data, receiver_data}: Message) => {
    
    
    const user = useAuthStore(s => s.user);

    const isNewMessage = receiver === user?.id && !viewed;

    const profileImg = partner_data?.image_url || partner_data?.profile_img_url || defaultAvatar

    const navigate = useNavigate();

    const messageText = message?.length > 50 ? message.slice(0, 48) + "..." : message
    
    return (
        <div className="message-item-container" style={isNewMessage ? { backgroundColor: "#e7efffff" } : {}} onClick={() => navigate(`/user/${partner_data?.id}/messages`)}>

            <div className="message-item__info">

                <img src={profileImg} alt="" className="message-item-avatar" referrerPolicy="no-referrer"/>

                <div className="message-item__message-info">
                    <h3>{partner_data?.first_name} {partner_data?.last_name}</h3>
                    <div className="message-item__message-text">
                        

                        <p className="message-item__message-text-info">
                            {sender === 46 && !viewed ? (
                                <>
                                
                                <IoCheckmarkSharp className="app-icon" size={25}/>
                                Sie: {messageText}
                                </>
                            ) : sender === 46 && viewed ? (
                                <>
                                <IoCheckmarkDoneSharp className="app-icon" size={25}/>
                                Sie: {messageText}
                                </>
                            ) : (
                                <>
                                    {messageText}
                                </>
                            )}
                        </p>

                    </div>
                </div>

            </div>

            <div className="timestamp-container">
                <p>{formatted_timestamp}</p>
            </div>
            
            
        </div>
    )
}

export default MessageItem