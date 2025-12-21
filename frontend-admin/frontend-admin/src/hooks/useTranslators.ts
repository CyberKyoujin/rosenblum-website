import React, { SetStateAction, useState } from 'react';
import useTranslations from '../zustand/useTranslations';

interface UseTranslatorsReturn {
    handleLanguageChange: (event: React.SyntheticEvent | null, newValue: string | null) => void;
    handleTranslateClick: () => void;
    handleTranslationSave: () => Promise<void>;
    lanTo: string;
    inputText: string;
    setInputText: React.Dispatch<SetStateAction<string>>;
}

const useTranslators = (

    translate: (inputText: string, lanTo: string) => void,
    streamedText: string,
    translationName: string,
    togglePopup: () => void,
    setTranslationName: React.Dispatch<SetStateAction<string>>,
    fetchTranslations: (id: number) => Promise<void>
    
    ): UseTranslatorsReturn => {

    const saveTranslation = useTranslations(s => s.saveTranslation);

    const [inputText, setInputText] = useState("");
    const [lanTo, setLanTo] = useState("German");

    const handleLanguageChange = (event: React.SyntheticEvent | null, newValue: string | null) => {   
        event?.preventDefault();
        setLanTo(newValue || ""); 
    };
    
    const handleTranslateClick = () => {
        if (inputText.trim()) {
            translate(inputText, lanTo);
        }
    };
    
    const handleTranslationSave = async () => {
    
        if (inputText && streamedText && translationName){
            try {
                const formData = new FormData();
                formData.append("name", translationName);
                formData.append("initial_text", inputText);
                formData.append("translated_text", streamedText);
                await saveTranslation(formData);
    
                togglePopup();
                setTranslationName("");
    
                await fetchTranslations(1);
    
            } catch (err: unknown) {
                console.error(err);
            }
        }
    }

    return {
        handleLanguageChange,
        handleTranslateClick,
        handleTranslationSave,
        lanTo,
        inputText,
        setInputText
    }
    
}


export default useTranslators;
