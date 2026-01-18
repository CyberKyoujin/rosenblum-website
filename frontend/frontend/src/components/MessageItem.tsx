import { FaFile } from "react-icons/fa";
import smallLogo from '../assets/logo2.webp'
import defaultAvatar from '../assets/default_avatar.webp'

const MessageItem = ({ msg, userId }: any) => {
    const isUser = msg.sender === userId;

    const senderAvatar = msg.sender_data.profile_img_url || defaultAvatar;

    return (
        <div className={`message ${isUser ? 'message-user' : ''}`} data-testid="message-div">
            <img
                src={isUser ? senderAvatar : smallLogo}
                className="message-avatar"
            />
            <div className="message-item">
                <div className="message-body" style={{ background: isUser ? 'rgb(177, 203, 248)' : undefined }}>
                    <p>{msg.message}</p>
                </div>

                {msg.files?.length > 0 && (
                    <div className="small-files-container">
                        {msg.files.map((file: any) => (
                            <div className="small-file-container" key={file.id}>
                                <FaFile style={{ color: 'rgb(76,121,212)', fontSize: '30px' }} />
                                <p>{file.file_name?.length > 8 ? file.file_name.slice(0, 7) + '...' : file.file_name}</p>
                                <p>{file.file_size} MB</p>
                            </div>
                        ))}
                    </div>
                )}
                <p className="timestamp" style={{ textAlign: isUser ? 'right' : 'left' }}>
                    {msg.formatted_timestamp}
                </p>
            </div>
        </div>
    );
};

export default MessageItem;