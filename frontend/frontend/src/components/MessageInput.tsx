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

const MessageInput = ({handleSubmit = () => {}, handleClick, message, setMessage, autoExpand, fileInputRef, handleFileInputChange, isLoading}: MessageInputProps) => {
 
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit({} as React.FormEvent<HTMLFormElement>); 
        }
    };

    return (

        <form className="message-input-container" onSubmit={handleSubmit}>
            
            <textarea
            className="message-input"
            data-testid="message-input"
            value={message}
            onChange={(e) => {
                setMessage && setMessage(e.target.value);
                autoExpand && autoExpand(e);
            }}
            onKeyDown={handleKeyDown}
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
                data-testid="message-file-input"
            />
        
            <button className="send-message-container hover-btn" type="submit" data-testid="message-submit">
                {isLoading ? <CircularProgress size={24} style={{color: 'white'}}/> : <RiMailSendLine/>}
            </button>

        </form>
    )
}

export default MessageInput