import React, { useState, useRef } from "react";
import Divider from '@mui/material/Divider';
import { SiGooglemessages } from "react-icons/si";
import { useEffect } from "react";
import useAuthStore from "../zustand/useAuthStore";
import smallLogo from '../assets/logo2.png'
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { FaFile } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Alert from '@mui/material/Alert';
import { useTranslation } from "react-i18next";
import useMessageStore from "../zustand/useMessageStore"
import MessagesSkeleton from "../components/MessagesSkeleton";
import MessageInput from "../components/MessageInput";
import defaultAvatar from "../assets/default_avatar.png"
import ApiErrorView from "../components/ApiErrorView";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import { ApiError } from "../types/auth";

const Messages = () => {

    const { userData, user } = useAuthStore();
    const { messages, messagesLoading, sendMessagesLoading, toggleMessages, fetchUserMessages, sendMessage, fetchMessagesError, sendMessagesError } = useMessageStore();

    const [message, setMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadLimit, setUploadLimit] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const isAtTop = useIsAtTop(10);

    const testError: ApiError = {status: 500, message: "TEST ERROR"}

    const fileInputRef = useRef(null);

    const { t } = useTranslation();

    useEffect(() => {
        toggleMessages();
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    const sortMessagesAscending = () => {
        if (!messages) return [];
        return [...messages].sort(
            (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
        );
    };

    const handleImageError = (e: any) => {
    e.target.src = defaultAvatar; 
    console.error("Failed to load user image from URL:", e.target.src);
    };  


    const handleClick = () => {
        fileInputRef.current?.click();
    };


    const removeFile = (index: number) => {
        setUploadedFiles(currentFiles => {
            const newFiles = currentFiles.filter((_, fileIndex) => fileIndex !== index);
            if (newFiles.length <= 3) {
                setUploadLimit(false);
            }
            return newFiles;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData();
            if (message.length > 0) {
                if (uploadedFiles.length > 0) {
                    uploadedFiles.forEach(file => {
                        formData.append('files', file);
                    });
                }
                formData.append('message', message);
    
                try {
                    await sendMessage(formData);
                    setMessage('');
                    setUploadedFiles([]);
                    fetchUserMessages();
                } catch (error) {
                    console.error('Failed to send message:', error);
                }
             
            } else {
                setMessage('');
            }
        }
    
        const handleFiles = (newFiles: File[]) => {
            const totalFiles = uploadedFiles.length + newFiles.length;
            if (totalFiles > 3) {
                setUploadLimit(true);
                return; 
            }
            setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
        };
    
        const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const filesArray = Array.from(e.target.files);
                handleFiles(filesArray);
            }
        };
    
        const autoExpand = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const element = e.target;
            element.style.height = 'auto';
            const computed = window.getComputedStyle(element);
            let height = element.scrollHeight;
            height += parseInt(computed.getPropertyValue('border-top-width'), 10)
                     + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
            element.style.height = `${height}px`;
        };

        const errorToShow = fetchMessagesError ?? sendMessagesError;

    if (messagesLoading) {
        return <MessagesSkeleton/>
    }

    return(

        <div className="messages-container" style={{padding: '1rem'}}>

        {testError && (
            <ApiErrorAlert error={testError} belowNavbar={isAtTop} fixed={true} />
        )}

        <div role="presentation" style={{marginBottom: '3rem'}}>
            <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">Home</Link>
            <Typography color="text.primary">Nachrichten</Typography>
            </Breadcrumbs>
        </div>

            <div className="messages-title-container">
                <SiGooglemessages style={{fontSize: '45px', color: 'rgb(76, 121, 212)'}}/>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <h1>{t('messagesTitleFirst')}</h1>
                    <h1 className="header-span">{t('messagesTitleSecond')}</h1>  
                </div>
            </div>

            <Divider sx={{marginTop: '1rem'}}/>

            {fetchMessagesError ? (

                <div className="messages-main-container">
                    <ApiErrorView message={fetchMessagesError.message || 'MESSAGES_ERROR'} />
                </div>

                ) : (

                <div className="messages-main-container" id="scroll-div" ref={messagesEndRef}>
                    {messages && messages.length > 0 ? (
                    sortMessagesAscending().map((message) => (
                        <div
                        key={message.id}
                        className={`message ${message.sender === user?.id ? 'message-user' : ''}`}
                        >
                        <img
                            src={
                            message.sender === user?.id
                                ? user.profile_img_url || userData?.image_url
                                : smallLogo
                            }
                            className="message-avatar"
                            onError={handleImageError}
                        />
                        <div className="message-item">
                            <div
                            className="message-body"
                            style={{
                                background:
                                message.sender === user?.id ? 'rgb(177, 203, 248)' : undefined,
                            }}
                            >
                            <p>{message.message}</p>
                            </div>

                            {message.files && message.files.length > 0 && (
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
                                </div>
                                ))}
                            </div>
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
                    ))

                    ) : (

                    <div className="no-messages-container">
                        <SiGooglemessages style={{ fontSize: '80px', color: 'rgb(76 121 212)' }} />
                        <p>Sie haben noch keine Nachrichten</p>
                    </div>
                    )}

                </div>
            )}

            <div>
                {uploadedFiles.length > 0 && (
                            <div className="files-container" style={{marginTop:'1rem', marginBottom: '1.5rem', justifyContent: 'flex-start', gap: '0.7rem', fontSize: '14px'}}>
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="file-container">
                                        <FaFile style={{fontSize: '40px', color: 'rgb(76, 121, 212)'}}/>
                                        <p>{file.name.length > 15 ? `${file.name.slice(0, 12)}...` : file.name}</p>
                                        <button className="file-remove-btn" onClick={() => removeFile(index)}><RiDeleteBin6Fill style={{fontSize: '20px'}}/></button>
                                    </div>
                                ))}
                            </div>
                )}
            </div>

            <div style={{marginBottom: '2rem', display: uploadLimit ? 'block': 'none'}}>
                <Alert severity="error">Sie können maximal 3 Files hochladen</Alert>
            </div>

            

            <MessageInput handleSubmit={handleSubmit} handleClick={handleClick} message={message} setMessage={setMessage} autoExpand={autoExpand} fileInputRef={fileInputRef} handleFileInputChange={handleFileInputChange} isLoading={sendMessagesLoading}/>


        </div>
        
    )
}


export default Messages