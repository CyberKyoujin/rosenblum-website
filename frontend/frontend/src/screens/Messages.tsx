import Divider from '@mui/material/Divider';
import { SiGooglemessages } from "react-icons/si";
import { FaFile } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import MessagesSkeleton from "../components/MessagesSkeleton";
import MessageInput from "../components/MessageInput";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import MessageItem from "../components/MessageItem";
import { useMessages } from "../hooks/useMessages";
import Footer from '../components/Footer';

const Messages = () => {
    const { t } = useTranslation();
    const isAtTop = useIsAtTop(10);
    const logic = useMessages();

    if (logic.loading) return <MessagesSkeleton />;

    return (
        <>
        <div className="messages-container" style={{ padding: '1rem' }}>

            {(logic.fetchMessagesError || logic.error) && (
                <ApiErrorAlert error={logic.fetchMessagesError || logic.error} belowNavbar={isAtTop} fixed />
            )}


            <div className="messages-title-container">
                <SiGooglemessages className="app-icon" size={45} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <h1>{t('messagesTitleFirst')}</h1>
                    <h1 className="header-span">{t('messagesTitleSecond')}</h1>
                </div>
            </div>

            <Divider sx={{ marginTop: '1rem' }} />

            <div className="messages-main-container" id="scroll-div" ref={logic.messagesEndRef}>
                {logic.messages.length > 0 ? (
                    logic.messages.map((msg) => (
                        <MessageItem 
                            key={msg.id} 
                            msg={msg} 
                            userId={logic.user?.id} 
                        />
                    ))
                ) : (
                    <div className="no-messages-container">
                        <SiGooglemessages style={{ fontSize: '80px', color: 'rgb(76 121 212)' }} />
                        <p>{t('noMessages')}</p>
                    </div>
                )}
            </div>

            {logic.fileState.uploadedFiles.length > 0 && (
                <div className="files-container" style={{ marginTop: '1rem', fontSize: '14px' }}>
                    {logic.fileState.uploadedFiles.map((file, index) => (
                        <div key={index} className="file-container">

                            <div className='file-container-name'>

                                <FaFile size={25} className='app-icon'/>
                      

                                <p>{file.name.length > 35 ? `${file.name.slice(0, 28)}...` : file.name}</p>

                            </div>
                        
                            <button className="file-remove-btn" onClick={() => logic.fileState.removeFile(index)}>
                                <RiDeleteBin6Fill style={{ fontSize: '20px' }} />
                            </button>

               
                            
                        </div>
                    ))}
                </div>
            )}

            {logic.fileState.uploadLimit && (
                <ApiErrorAlert error={{status: 400, code: "Error", message: "Sie können maximal 3 Files hochladen"}} belowNavbar={isAtTop} fixed></ApiErrorAlert>
            )}

            <MessageInput 
                handleSubmit={logic.messageState.onSubmit}
                handleClick={logic.fileState.triggerClick}
                message={logic.messageState.message}
                setMessage={logic.messageState.setMessage}
                fileInputRef={logic.fileState.fileInputRef}
                handleFileInputChange={logic.fileState.onFileInputChange}
                isLoading={logic.sending}
            />

            
        </div>
        <Footer/>
        </>
    );
};

export default Messages