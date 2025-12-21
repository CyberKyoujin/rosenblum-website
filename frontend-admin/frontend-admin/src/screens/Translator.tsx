
import { useEffect, useState } from 'react';
import { useStreamTranslation } from '../hooks/useStreamTranslation';
import { Divider } from '@mui/material';
import { BsTranslate } from "react-icons/bs";
import ApiErrorAlert from '../components/ApiErrorAlert';
import { useIsAtTop } from '../hooks/useIsAtTop';
import SaveTranslationPopup from '../components/SaveTranslationPopup';
import useTranslations from '../zustand/useTranslations';
import DashboardSection from '../components/DashboardSection';
import TranslationItem from '../components/TranslationItem';
import TranslationsFilter from '../components/TranslationsFilter';
import TranslatorSection from '../components/TranslatorSection';
import useTranslators from '../hooks/useTranslators';


const Translator = () => {

    const saveTranslationLoading = useTranslations(s => s.loading);
    const translations = useTranslations(s => s.translations);
    const fetchTranslations = useTranslations(s => s.fetchTranslations)
    const setFilters = useTranslations(s => s.setFilters)
    const translationDeleteSuccess = useTranslations(s => s.deleteTranslationSuccess);
    const resetStatus = useTranslations(s => s.resetStatus);

    const translationStoreError = useTranslations(s => s.error)

    const [translationName, setTranslationName] = useState('');

    const [popupOpen, setPopupOpen] = useState(false);
    const togglePopup = () => setPopupOpen(!popupOpen);

    const isAtTop = useIsAtTop(5);

    const { translate, streamedText, isLoading } = useStreamTranslation();

    const {handleTranslationSave, handleLanguageChange, handleTranslateClick, lanTo, inputText, setInputText} = useTranslators(translate, streamedText, translationName, togglePopup, setTranslationName, fetchTranslations);

    useEffect(() => {
        
        return () => {
            
            resetStatus(); 
        }
    }, [resetStatus]);

    return (
        <main className="main-container">

            <SaveTranslationPopup loading={saveTranslationLoading} handleTranslationSave={handleTranslationSave} popupOpen={popupOpen} togglePopup={togglePopup} translationName={translationName} setTranslationName={setTranslationName}/>

            <div className='overlay' style={{ display: popupOpen ? 'block' : 'none' }}/>

            <ApiErrorAlert error={translationStoreError} belowNavbar={isAtTop} fixed/>

            {translationDeleteSuccess && <ApiErrorAlert successMessage={"Die Übersetzung wurde erfolgreich gelöscht"} belowNavbar={isAtTop} fixed/>}

            <article className="translation-container">

                <section className='translator-title'>
                    <BsTranslate size={40} className='app-icon'/>
                    <h1>Übersetzer</h1>
                </section>

                <Divider/>

                <TranslatorSection lanTo={lanTo} handleLanguageChange={handleLanguageChange} inputText={inputText} setInputText={setInputText} handleTranslateClick={handleTranslateClick} isLoading={isLoading} streamedText={streamedText} togglePopup={togglePopup}/>

                <div style={{marginTop: "2rem"}}>
                    <DashboardSection data={translations} title='Übersetzungen' Icon={BsTranslate} fetchData={fetchTranslations} ItemComponent={TranslationItem} loading={saveTranslationLoading} error={translationStoreError} setFilters={setFilters} Filter={TranslationsFilter}/>
                </div>

            </article>

        </main>
    )
}


export default Translator