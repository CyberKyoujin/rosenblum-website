import React, { useState, useRef } from "react";
import { SiGooglemessages } from "react-icons/si";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { Divider } from "@mui/material";
import useMessages from "../zustand/useMessages";
import MessageInput from "../components/MessageInput";
import ErrorView from "../components/ErrorView";
import ApiErrorAlert from "../components/ApiErrorAlert";
import AppSkeleton from "../components/Skeleton";
import { useIsAtTop } from "../hooks/useIsAtTop";
import useCustomersStore from "../zustand/useCustomers";
import MessagesSection from "../components/MessagesSection";
import MessagesFileUpload from "../components/MessagesFileUpload";
import useAuthStore from "../zustand/useAuthStore";
import { useChatForm } from "../hooks/useChatForm";

const Messages = () => {

    const { userId } = useParams();
    const formattedUserId = Number(userId);

    const { 
        userMessages: messages, 
        messagesLoading, 
        sendMessagesLoading, 
        fetchMessagesError, 
        fetchUserMessages, 
        sendMessage, 
        toggleMessages 
    } = useMessages();

    const { 
        customerData, 
        fetchCustomerData 
    } = useCustomersStore();

    const user = useAuthStore(s => s.user);
    const loading = useMessages(s => s.messagesLoading);

    const { 
        message, 
        setMessage, 
        uploadedFiles, 
        uploadLimit, 
        error: formError, 
        handleSubmit, 
        handleFileInputChange, 
        removeFile 
    } = useChatForm(sendMessage, fetchUserMessages, formattedUserId, sendMessagesLoading);

    const isAtTop = useIsAtTop(5);

    useEffect(() => {
        if (!isNaN(formattedUserId)) {
            fetchCustomerData(formattedUserId);
            fetchUserMessages(formattedUserId);
            toggleMessages(formattedUserId);
        }
    }, [formattedUserId, fetchCustomerData, fetchUserMessages, toggleMessages]); 

    if (messagesLoading) {
        return <AppSkeleton />;
    }

    return (
        <div className="messages-container" style={{ padding: '1rem' }}>

            {fetchMessagesError && (
                <ApiErrorAlert error={fetchMessagesError} belowNavbar={isAtTop} fixed={true} />
            )}

            {formError && (
                <ApiErrorAlert error={formError} belowNavbar={isAtTop} fixed={true} />
            )}

            <div className="messages-title-container">
                <SiGooglemessages style={{ fontSize: '45px', color: 'rgb(76, 121, 212)' }} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <h1>Ihre</h1>
                    <h1 className="header-span">Nachrichten</h1>
                </div>
            </div>

            <Divider sx={{ marginTop: '1rem' }} />

            {fetchMessagesError ? (

                <div className="messages-main-container">
                    <ErrorView />
                </div>

            ) : (
                
                <MessagesSection 
                    messages={messages} 
                    userId={formattedUserId} 
                    user={user} 
                    customerData={customerData}
                    loading={messagesLoading}
                />

            )}

            <MessagesFileUpload uploadedFiles={uploadedFiles} removeFile={removeFile} />

            <div style={{ marginBottom: '2rem', display: uploadLimit ? 'block' : 'none' }}>
                <Alert severity="error">Sie können maximal 3 Files hochladen</Alert>
            </div>

            <MessageInput 
                handleSubmit={handleSubmit} 
                message={message} 
                setMessage={setMessage} 
                handleFileInputChange={handleFileInputChange} 
                isLoading={sendMessagesLoading} 
            />

        </div>
    );
}


export default Messages