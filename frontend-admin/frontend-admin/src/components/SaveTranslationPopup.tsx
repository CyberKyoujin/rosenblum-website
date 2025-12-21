import React, { SetStateAction } from 'react';
import TextField from '@mui/material/TextField';
import { CircularProgress, Divider } from '@mui/material';
import { HiOutlineSaveAs } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

interface SaveTranslationPopupProps {
    popupOpen: boolean;
    togglePopup: () => void;
    translationName: string;
    setTranslationName: React.Dispatch<SetStateAction<string>>;
    handleTranslationSave: () => Promise<void>;
    loading: boolean;
}

const SaveTranslationPopup = ({
    popupOpen, 
    togglePopup,
    translationName,
    setTranslationName,
    handleTranslationSave,
    loading
    }: SaveTranslationPopupProps) => {

    if (!popupOpen) {
        return null;
    }

    return (

        <div className='save-translation-popup'>

            <IoClose className='translation-popup-close' size={25} onClick={togglePopup}/>

            <div className='translator-title'>
                <HiOutlineSaveAs size={25} className='app-icon'/>
                <h3> Speichern</h3>
            </div>

            <Divider/>
            <TextField value={translationName} id="outlined-basic" label="Name der Übersetzung..." variant="outlined" onChange={(e) => setTranslationName(e.target.value)}/>
            <button className='btn' onClick={() => handleTranslationSave()}>
                {loading ? <CircularProgress size={25} sx={{color: "white"}}/> : "WEITER"}
            </button>
        </div>

    );
}

export default SaveTranslationPopup;
