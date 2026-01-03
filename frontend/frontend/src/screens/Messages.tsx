import React, { useState, useRef } from "react";
import Divider from '@mui/material/Divider';
import { SiGooglemessages } from "react-icons/si";
import { useEffect } from "react";
import useAuthStore from "../zustand/useAuthStore";
import smallLogo from '../assets/logo2.webp'
import { FaFile } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Alert from '@mui/material/Alert';
import { useTranslation } from "react-i18next";
import useMessageStore from "../zustand/useMessageStore"
import MessagesSkeleton from "../components/MessagesSkeleton";
import MessageInput from "../components/MessageInput";
import defaultAvatar from "../assets/default_avatar.webp"
import ApiErrorView from "../components/ApiErrorView";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import { ApiErrorResponse } from "../types/error";
import NavigationSection from "../components/NavigationSection";

const Messages = () => {

    const user = useAuthStore(s => s.user);

    const messages = useMessageStore(s => s.messages);
    const messagesLoading = useMessageStore(s => s.messagesLoading);
    const sendMessagesLoading = useMessageStore(s => s.sendMessagesLoading);
    const toggleMessages = useMessageStore(s => s.toggleMessages);
    const fetchUserMessages = useMessageStore(s => s.fetchUserMessages);
    const sendMessage = useMessageStore(s => s.sendMessage);
    const fetchMessagesError = useMessageStore(s => s.fetchMessagesError);

    
    const [message, setMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [uploadLimit, setUploadLimit] = useState(false);

    const [error, setError] = useState<ApiErrorResponse | null> (null);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const isAtTop = useIsAtTop(10);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { t } = useTranslation();

    useEffect(() => {
        toggleMessages(46);
    }, [toggleMessages]);

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

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = defaultAvatar; 
    console.error("Failed to load user image from URL:", e.currentTarget.src);
    };  


    const handleClick = () => {
        if (fileInputRef.current) {
        fileInputRef.current.click();
    }
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

            if (sendMessagesLoading) return;

            const formData = new FormData();

            setUploadLimit(false);

            if (message.length > 0 || uploadedFiles.length > 0) {
                if (uploadedFiles.length > 0) {
                    uploadedFiles.forEach(file => {
                        formData.append('uploaded_files', file);
                    });
                }
                formData.append('message', message);
    
                try {
                    await sendMessage(formData);
                    setMessage('');
                    setUploadedFiles([]);
                    fetchUserMessages();
                } catch (err: unknown) {

                    setError(err as ApiErrorResponse);

                    console.error(err)
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
                e.target.value = '';
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


    if (messagesLoading) {
        return <MessagesSkeleton/>
    }

    return(

        <div className="messages-container" style={{padding: '1rem'}}>

        {fetchMessagesError && (
            <ApiErrorAlert error={fetchMessagesError} belowNavbar={isAtTop} fixed={true} />
        )}

        {error && (
            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed={true} />
        )}


        <NavigationSection first_link="Nachrichten"/>

            <div className="messages-title-container">
                <SiGooglemessages className="app-icon" size={45}/>
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
                                ? user.profile_img_url
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