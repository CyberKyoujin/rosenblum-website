import { FaFile } from "react-icons/fa";
import smallLogo from '../assets/logo2.webp'
import defaultAvatar from '../assets/default_avatar.webp'
import { IoMdDownload } from "react-icons/io";

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

                                <div className="small-file-name">

                                    <FaFile size={20} className="app-icon" />
                                    <p>{file.file_name?.length > 12 ? file.file_name.slice(0, 12) + '...' : file.file_name}</p>
                                </div>

                                <div className="small-file-name">
                                    <p>{file.file_size} MB</p>
                                    <button className="download-btn-small" onClick={() => window.open(file.file, '_blank')}><IoMdDownload/></button>
                                </div>
                                
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