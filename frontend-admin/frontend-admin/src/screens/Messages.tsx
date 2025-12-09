import React, { useState, useRef } from "react";
import { SiGooglemessages } from "react-icons/si";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import smallLogo from '../assets/logo2.png'
import { RiMailSendLine } from "react-icons/ri";
import { FaPaperclip } from "react-icons/fa6";
import { FaFile } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import defaultAvatar from "../assets/default_avatar.webp"
import Alert from '@mui/material/Alert';
import { Divider } from "@mui/material";
import useMainStore from "../zustand/useMainStore";
import { IoMdDownload } from "react-icons/io";
import useMessages from "../zustand/useMessages";
import useAuthStore from "../zustand/useAuthStore";
import MessageInput from "../components/MessageInput";
import ErrorView from "../components/ErrorView";
import ApiErrorAlert from "../components/ApiErrorAlert";
import AppSkeleton from "../components/Skeleton";
import { ApiErrorResponse } from "../types/error";
import { useIsAtTop } from "../hooks/useIsAtTop";
import useCustomersStore from "../zustand/useCustomers";

const Messages = () => {
    const { userId } = useParams();

    const messages = useMessages(s => s.userMessages);
    const messagesLoading = useMessages(s => s.messagesLoading);
    const sendMessagesLoading = useMessages(s => s.sendMessagesLoading);
    const toggleMessages = useMessages(s => s.toggleMessages);
    const fetchUserMessages = useMessages(s => s.fetchUserMessages);
    const sendMessage = useMessages(s => s.sendMessage);
    const fetchMessagesError = useMessages(s => s.fetchMessagesError);
    
    const fetchCustomerData = useCustomersStore(s => s.fetchCustomerData);

    const customerData = useCustomersStore(s => s.customerData);

    const [error, setError] = useState<ApiErrorResponse | null>(null);

    const isAtTop = useIsAtTop(5);

    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const user = useAuthStore(s => s.user);

    const [uploadLimit, setUploadLimit] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        fetchCustomerData(Number(userId));
        fetchUserMessages(Number(userId));
        toggleMessages(Number(userId));
    }, [userId, fetchUserMessages, toggleMessages]);

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
                        formData.append('files', file);
                    });
                }
                formData.append('message', message);
    
                try {
                    await sendMessage(formData, Number(user?.id));
                    setMessage('');
                    setUploadedFiles([]);
                    fetchUserMessages(Number(userId));
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
        return <AppSkeleton/>
    }

    return (
        <div className="messages-container" style={{padding: '1rem'}}>

        {fetchMessagesError && (
            <ApiErrorAlert error={fetchMessagesError} belowNavbar={isAtTop} fixed={true} />
        )}

        {error && (
            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed={true} />
        )}


            <div className="messages-title-container">
                <SiGooglemessages style={{fontSize: '45px', color: 'rgb(76, 121, 212)'}}/>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <h1>Ihre</h1>
                    <h1 className="header-span">Nachrichten</h1>  
                </div>
            </div>

            <Divider sx={{marginTop: '1rem'}}/>

            {fetchMessagesError ? (

                <div className="messages-main-container">
                    <ErrorView />
                </div>

                ) : (

                <div className="messages-main-container" id="scroll-div" ref={messagesEndRef}>
                    {messages && messages.length > 0 ? (
                    sortMessagesAscending().map((message) => (
                        <div
                        key={message.id}
                        className={`message ${message.sender === user?.id ? '' : 'message-user'}`}
                        >
                        <img
                            src={
                            message.sender === user?.id
                                ? customerData?.profile_img
                                : smallLogo
                            }
                            className="message-avatar"
                            onError={handleImageError}
                            referrerPolicy="no-referrer"
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
                                    <button className="download-btn-small" onClick={() => window.open(file.file, '_blank')}><IoMdDownload/></button>
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
    );
}


export default Messages