import { Message } from "../types/message"
import defaultAvatar from "../assets/default_avatar.webp"
import { useNavigate } from "react-router-dom";


const MessageItem = ({id, formatted_timestamp, files, message, partner_data, viewed, sender, receiver, sender_data, receiver_data}: Message) => {
    
    const profileImg = partner_data?.image_url || partner_data?.profile_img_url || defaultAvatar

    const senderProfileImg = sender_data?.image_url || sender_data?.profile_img_url;

    const navigate = useNavigate();
    
    return (
        <div className="message-item-container" style={!viewed ? { backgroundColor: "#e7efffff" } : {}} onClick={() => navigate(`/user/${partner_data?.id}/messages`)}>

            <div className="message-item__info">

                <img src={profileImg} alt="" className="message-item-avatar"/>

                <div className="message-item__message-info">
                    <h3>{partner_data?.first_name} {partner_data?.last_name}</h3>
                    <div className="message-item__message-text">
                        {sender === 46 && <img src={senderProfileImg} alt="" className="message-item-avatar small-avatar"/>}
                        <p>{sender === 46 ? `Sie: ${message}` : message}</p>
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