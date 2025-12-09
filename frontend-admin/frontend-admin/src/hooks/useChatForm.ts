import { useState } from "react";
import { ApiErrorResponse } from "../types/error";

interface UseChatFormReturn {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    uploadedFiles: File[];
    uploadLimit: boolean;
    error: ApiErrorResponse | null;
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeFile: (index: number) => void;
}

export const useChatForm = (
    sendMessage: (formData: FormData, id: number) => Promise<void>,
    fetchUserMessages: (id: number) => Promise<void>,
    userId: number,
    isLoading: boolean
): UseChatFormReturn => {

    const [message, setMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [uploadLimit, setUploadLimit] = useState(false);
    const [error, setError] = useState<ApiErrorResponse | null>(null);

    const handleFiles = (newFiles: File[]) => {
        const totalFiles = uploadedFiles.length + newFiles.length;
        if (totalFiles > 3) {
            setUploadLimit(true);
            return;
        }
        setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
        setUploadLimit(false);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            handleFiles(filesArray);
            e.target.value = '';
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

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
 
        if (e) e.preventDefault();

        if (isLoading) return;

        setError(null);
        setUploadLimit(false);

        if (message.trim().length === 0 && uploadedFiles.length === 0) {
            return;
        }

        const formData = new FormData();

        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach(file => {
                formData.append('files', file);
            });
        }

        if (message.trim().length > 0) {
            formData.append('message', message);
        }

        try {
            await sendMessage(formData, userId);
            
            setMessage('');
            setUploadedFiles([]);
            
            await fetchUserMessages(userId);
            
        } catch (err: unknown) {
            setError(err as ApiErrorResponse);
            console.error(err);
        }
    };

    return {
        message,
        setMessage,
        uploadedFiles,
        uploadLimit,
        error,
        handleSubmit,
        handleFileInputChange,
        removeFile
    };
};