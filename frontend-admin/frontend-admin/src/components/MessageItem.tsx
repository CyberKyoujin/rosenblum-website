import { Message } from "../types/message"
import defaultAvatar from "../assets/default_avatar.webp"
import { useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/useAuthStore";
import { IoCheckmarkDoneSharp, IoCheckmarkSharp, IoChevronForward } from "react-icons/io5";


const MessageItem = ({formatted_timestamp, message, partner_data, viewed, sender, receiver}: Message) => {

    const user = useAuthStore(s => s.user);
    const isNewMessage = receiver === user?.id && !viewed;
    const profileImg = partner_data?.image_url || partner_data?.profile_img_url || defaultAvatar;
    const navigate = useNavigate();
    const messageText = message?.length > 50 ? message.slice(0, 48) + "..." : message;

    return (
        <div
            className={`oi ${isNewMessage ? 'oi--new' : ''}`}
            onClick={() => navigate(`/user/${partner_data?.id}/messages`)}
        >
            <img
                src={profileImg}
                alt=""
                className="oi__avatar"
                referrerPolicy="no-referrer"
            />

            <div className="oi__content">
                <span className="oi__id">{partner_data?.first_name} {partner_data?.last_name}</span>
                <span className="oi__name oi__message-preview">
                    {sender === user?.id && !viewed ? (
                        <>
                            <IoCheckmarkSharp className="oi__check-icon" />
                            Sie: {messageText}
                        </>
                    ) : sender === user?.id && viewed ? (
                        <>
                            <IoCheckmarkDoneSharp className="oi__check-icon" />
                            Sie: {messageText}
                        </>
                    ) : (
                        messageText
                    )}
                </span>
            </div>

            <div className="oi__right">
                <span className="oi__timestamp">{formatted_timestamp}</span>
            </div>

            <IoChevronForward className="oi__chevron" />
        </div>
    );
};

export default MessageItem;
