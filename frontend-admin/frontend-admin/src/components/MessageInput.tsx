import React, {useRef} from "react";
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

const MessageInput = ({handleSubmit = () => {}, message, setMessage, handleFileInputChange, isLoading}: MessageInputProps) => {
 
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
        }
    };

    const handleClick = () => {
        if (fileInputRef.current) {
        fileInputRef.current.click();
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

    return (
    
        <form className="message-input-container" onSubmit={handleSubmit}>
            
            <textarea
            className="message-input"
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
            />
        
            <button className="send-message-container hover-btn" type="submit">
                {isLoading ? <CircularProgress style={{color: 'white', width: '24px', height: '24px'}}/> : <RiMailSendLine/>}
            </button>

        </form>
    )
}

export default MessageInput