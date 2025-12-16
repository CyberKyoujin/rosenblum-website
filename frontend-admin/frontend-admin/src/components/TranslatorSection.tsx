import Select from '@mui/joy/Select';
import Textarea from '@mui/joy/Textarea';
import Card from '@mui/material/Card';
import Option from '@mui/joy/Option';
import ukrFlag from "../assets/ua.svg"
import ruFlag from "../assets/ru.svg"
import deFlag from "../assets/de.svg"
import CircularProgress from '@mui/material/CircularProgress';
import React, { SetStateAction } from 'react';

interface TranslationSectionProps {
    lanTo: string;
    handleLanguageChange: (event: React.SyntheticEvent | null, newValue: string | null) => void;
    inputText: string;
    setInputText: React.Dispatch<SetStateAction<string>>;
    handleTranslateClick: () => void;
    isLoading: boolean;
    streamedText: string;
    togglePopup: () => void;
}

const TranslatorSection = ({

    lanTo,
    handleLanguageChange,
    inputText,
    setInputText,
    handleTranslateClick,
    isLoading,
    streamedText,
    togglePopup,

    }: TranslationSectionProps) => {

    return (

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

    );
}

export default TranslatorSection;
