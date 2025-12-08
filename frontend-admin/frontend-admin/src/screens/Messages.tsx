import React, { useState, useRef } from "react";
import { SiGooglemessages } from "react-icons/si";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import smallLogo from '../assets/logo2.png'
import { RiMailSendLine } from "react-icons/ri";
import { FaPaperclip } from "react-icons/fa6";
import { FaFile } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Divider } from "@mui/material";
import useMainStore from "../zustand/useMainStore";
import { IoMdDownload } from "react-icons/io";

const Messages = () => {
    const { userId } = useParams();
    const { userData, fetchUserData, fetchUserMessages, messages, toggleMessages, sendMessage } = useMainStore((state) => state); 
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const [uploadLimit, setUploadLimit] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchUserData(userId);
        fetchUserMessages(userId);
        toggleMessages(userId);
    }, [userId, fetchUserData, fetchUserMessages, toggleMessages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    const sortMessagesAscending = () => {
        return messages?.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        if (message.trim().length > 0) {
            if (uploadedFiles.length > 0) {
                uploadedFiles.forEach(file => {
                    formData.append('files', file);
                });
            }
            formData.append('message', message);
            try {
                await sendMessage(formData, userId);
                setMessage('');
                setUploadedFiles([]);
                await fetchUserMessages(userId);
            } catch (error) {
                console.error('Failed to send message:', error);
            }
            setIsLoading(false);
        } else {
            setMessage('');
            setIsLoading(false);
        }
    };

    const handleFiles = (newFiles) => {
        const totalFiles = uploadedFiles.length + newFiles.length;
        if (totalFiles > 3) {
            setUploadLimit(true);
            return;
        }
        setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: React.FormEvent<HTMLFormElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            handleFiles(filesArray);
        }
    };

    const removeFile = (index) => {
        setUploadedFiles(currentFiles => {
            const newFiles = currentFiles.filter((_, fileIndex) => fileIndex !== index);
            if (newFiles.length <= 3) {
                setUploadLimit(false);
            }
            return newFiles;
        });
    };

    const autoExpand = (e) => {
        const element = e.target;
        element.style.height = 'auto';
        const computed = window.getComputedStyle(element);
        let height = element.scrollHeight;
        height += parseInt(computed.getPropertyValue('border-top-width'), 10)
            + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
        element.style.height = `${height}px`;
    };

    return (
        <div className="messages-container" style={{ padding: '1rem' }}>
            <div className="messages-title-container">
                <SiGooglemessages style={{ fontSize: '45px', color: 'rgb(76, 121, 212)' }} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <h1 className="header-span">Nachrichten</h1>
                </div>
            </div>

            <Divider sx={{ marginTop: '1rem' }} />

            <div className="messages-main-container" id="scroll-div" ref={messagesEndRef}>
                {messages && messages.length > 0 ? (
                    sortMessagesAscending()?.map((message) => (
                        <div key={message.id} className={`message ${message.sender === userData?.id ? '' : 'message-user'}`}>
                            <img src={message.sender === userData?.id ? userData.profile_img_url || userData?.profile_img : smallLogo} alt="" className="message-avatar" />
                            <div className="message-item">
                                <div className="message-body" style={{ background: message.sender === userData?.id && 'rgb(177, 203, 248)' }}>
                                    <p>{message.message}</p>
                                </div>
                                {message.files &&
                                    <div className="small-files-container" key={message.id} style={{ display: message.files.length === 0 && 'none' }}>
                                        {message.files.map((file) => (
                                            <div className="small-file-container" key={file.id}>
                                                <FaFile style={{ color: 'rgb(76,121,212)', fontSize: '30px' }} />
                                                <p>{file.file_name?.length > 8 ? file.file_name.slice(0, 7) + '...' : file.file_name}</p>
                                                <p>{file.file_size} MB</p>
                                                <button className="download-btn-small" onClick={() => window.open(file.file, '_blank')}><IoMdDownload/></button>
                                            </div>
                                        ))}
                                    </div>
                                }
                                <p className="timestamp" style={{ textAlign: message.sender === userData?.id && 'right' }}>{message.formatted_timestamp}</p>
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

            {uploadedFiles.length > 0 && (
                <div className="files-container" style={{ marginTop: '1rem', marginBottom: '1.5rem', justifyContent: 'flex-start', gap: '0.7rem', fontSize: '14px' }}>
                    {uploadedFiles.map((file, index) => (
                        <div key={index} className="file-container">
                            <FaFile style={{ fontSize: '40px', color: 'rgb(76, 121, 212)' }} />
                            <p>{file.name.length > 15 ? `${file.name.slice(0, 12)}...` : file.name}</p>
                            <button className="file-remove-btn" onClick={() => removeFile(index)}><RiDeleteBin6Fill style={{ fontSize: '20px' }} /></button>
                        </div>
                    ))}
                </div>
            )}

            {uploadLimit && (
                <div style={{ marginBottom: '2rem' }}>
                    <Alert severity="error">Sie können maximal 3 Files hochladen</Alert>
                </div>
            )}

            <form className="message-input-container" onSubmit={handleSubmit}>
                <textarea
                    type="text"
                    className="message-input"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        autoExpand(e);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />

                <button type="button" className="send-message-container hover-btn" style={{ right: '4.5rem' }} onClick={handleClick}>
                    <FaPaperclip />
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                    multiple
                    accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .xlsx"
                />

                <button className="send-message-container hover-btn" type="submit">
                    {isLoading ? <CircularProgress style={{ color: 'white', width: '24px', height: '24px' }} /> : <RiMailSendLine />}
                </button>
            </form>
        </div>
    );
}


export default Messages