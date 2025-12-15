import Textarea from '@mui/joy/Textarea';
import Card from '@mui/material/Card';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import ukrFlag from "../assets/ua.svg"
import ruFlag from "../assets/ru.svg"
import deFlag from "../assets/de.svg"
import { useEffect, useState } from 'react';
import { useStreamTranslation } from '../hooks/useStreamTranslation';
import { CircularProgress, Divider } from '@mui/material';
import { BsTranslate } from "react-icons/bs";
import ApiErrorAlert from '../components/ApiErrorAlert';
import { useIsAtTop } from '../hooks/useIsAtTop';
import SaveTranslationPopup from '../components/SaveTranslationPopup';
import useTranslations from '../zustand/useTranslations';
import DashboardSection from '../components/DashboardSection';
import TranslationItem from '../components/TranslationItem';
import TranslationsFilter from '../components/TranslationsFilter';


const Translator = () => {

    const [inputText, setInputText] = useState("");
    const [lanTo, setLanTo] = useState("German");

    const saveTranslation = useTranslations(s => s.saveTranslation);
    const saveTranslationLoading = useTranslations(s => s.loading);
    const translations = useTranslations(s => s.translations);
    const fetchTranslations = useTranslations(s => s.fetchTranslations)
    const setFilters = useTranslations(s => s.setFilters)

    const [translationName, setTranslationName] = useState('');

    const [popupOpen, setPopupOpen] = useState(false);

    const togglePopup = () => setPopupOpen(!popupOpen);

    const isAtTop = useIsAtTop(5);

    const handleLanguageChange = (event: React.SyntheticEvent | null, newValue: string | null) => {   
        setLanTo(newValue || ""); 
    };

    const { translate, streamedText, isLoading, error } = useStreamTranslation();

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

    return (
        <main className="main-container">

            <SaveTranslationPopup loading={saveTranslationLoading} handleTranslationSave={handleTranslationSave} popupOpen={popupOpen} togglePopup={togglePopup} translationName={translationName} setTranslationName={setTranslationName}/>

            <div className='overlay' style={{ display: popupOpen ? 'block' : 'none' }}/>

            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed/>

            
            <article className="translation-container">

                <section className='translator-title'>
                    <BsTranslate size={40} className='app-icon'/>
                    <h1>Übersetzer</h1>
                </section>

                <Divider sx={{width: "100%"}}/>

                <section className='translation-info-container'>

                    <div className='translation-container-section'>

                        <div className='translator__select-container'>

                            <h2>Eingangstext</h2>

                            <Select value={lanTo} className='translator__select' onChange={handleLanguageChange}>
                                <Option value="Ukrainian">
                                    <img src={ukrFlag} alt="UKR" className='translation-select-img'/>
                                    <h4>UKR</h4>
                                </Option>
                                <Option value="Russian">
                                    <img src={ruFlag} alt="RU" className='translation-select-img'/>
                                    <h4>RU</h4>
                                </Option>
                                <Option value="German">
                                    <img src={deFlag} alt="DE" className='translation-select-img'/>
                                    <h4>DE</h4>
                                </Option>
                            </Select>

                        </div>


                        <Textarea
                            placeholder="Text zur Übersetzung…"
                            minRows={12}
                            onChange={(e) => setInputText(e.target.value)}
                            value={inputText}
                            sx={{lineHeight: "1,5rem"}}
                        />

                        <button className='btn' style={{width: "100%"}} onClick={() => handleTranslateClick()}> 
                            
                            {isLoading ? <CircularProgress sx={{color:'white'}}/> : "WEITER"} 

                        </button>

                    </div>

                    <div className='translation-container-section'>

                        <h2>Übersetzungsergebnis</h2>

                        <Card variant="outlined" className='translator__results-container'>
                                
                                {(streamedText || isLoading) && (
                                    <p  className='translation-result'>

                                        {streamedText}

                                        {isLoading && (
                                            <span className='cursor-span'/>
                                        )}

                                    </p>
                                )}
                            
                        </Card>

                        <button className='btn' style={{width: "100%"}} onClick={() => togglePopup()}> SPEICHERN </button>

                    </div>

                </section>

                <div style={{marginTop: "2rem"}}>
                    <DashboardSection data={translations} title='Übersetzungen' Icon={BsTranslate} fetchData={fetchTranslations} ItemComponent={TranslationItem} loading={saveTranslationLoading} error={error} setFilters={setFilters} Filter={TranslationsFilter}/>
                </div>

            </article>

        </main>
    )
}


export default Translator