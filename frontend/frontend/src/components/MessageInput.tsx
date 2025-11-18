import React from "react";
import { FaPaperclip } from "react-icons/fa6";
import { CircularProgress } from "@mui/material";
import { RiMailSendLine } from "react-icons/ri";

interface MessageInputProps {
    handleSubmit? : (e: React.FormEvent<HTMLFormElement>) => void;
    handleClick?: () => void;
    message?: string;
    setMessage?: React.Dispatch<React.SetStateAction<string>>;
    autoExpand?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    fileInputRef?: React.RefObject<HTMLInputElement>;
    handleFileInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isLoading?: boolean;
}


const MessageInput = ({handleSubmit, handleClick, message, setMessage, autoExpand, fileInputRef, handleFileInputChange, isLoading}: MessageInputProps) => {

    return (
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
                <FaPaperclip/>
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
                {isLoading ? <CircularProgress style={{color: 'white', width: '24px', height: '24px'}}/> : <RiMailSendLine/>}
            </button>

        </form>
    )
}

export default MessageInput