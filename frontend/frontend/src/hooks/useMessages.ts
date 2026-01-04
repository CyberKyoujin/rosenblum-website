import { useState, useRef, useEffect, useMemo } from 'react';
import useAuthStore from '../zustand/useAuthStore';
import useMessageStore from '../zustand/useMessageStore';
import { ApiErrorResponse } from '../types/error';

export const useMessages = () => {
    const user = useAuthStore(s => s.user);
    const { 
        messages, messagesLoading, sendMessagesLoading, 
        toggleMessages, fetchUserMessages, sendMessage, fetchMessagesError 
    } = useMessageStore();

    const [message, setMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [uploadLimit, setUploadLimit] = useState(false);
    const [error, setError] = useState<ApiErrorResponse | null>(null);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        toggleMessages(46);
    }, [toggleMessages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    const sortedMessages = useMemo(() => {
        if (!messages) return [];
        return [...messages].sort(
            (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
        );
    }, [messages]);

    const handleFiles = (newFiles: File[]) => {
        const totalFiles = uploadedFiles.length + newFiles.length;
        if (totalFiles > 3) {
            setUploadLimit(true);
            return;
        }
        setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => {
            const updated = prev.filter((_, i) => i !== index);
            if (updated.length <= 3) setUploadLimit(false);
            return updated;
        });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (sendMessagesLoading || (!message.trim() && uploadedFiles.length === 0)) return;

        const formData = new FormData();
        setUploadLimit(false);

        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach(file => formData.append('uploaded_files', file));
        }
        formData.append('message', message);

        try {
            await sendMessage(formData);
            setMessage('');
            setUploadedFiles([]);
            fetchUserMessages();
        } catch (err) {
            setError(err as ApiErrorResponse);
        }
    };

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const filesArray = Array.from(e.target.files);
        handleFiles(filesArray);
        e.target.value = ''; 
    }
};

    return {
        user,
        messages: sortedMessages,
        loading: messagesLoading,
        sending: sendMessagesLoading,
        error,
        fetchMessagesError,
        messageState: { message, setMessage, onSubmit },
        fileState: { 
            uploadedFiles, 
            removeFile, 
            handleFiles, 
            onFileInputChange,
            uploadLimit, 
            fileInputRef,
            triggerClick: () => fileInputRef.current?.click()
        },
        messagesEndRef
    };
};