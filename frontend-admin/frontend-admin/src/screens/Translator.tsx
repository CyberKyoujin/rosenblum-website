import Textarea from '@mui/joy/Textarea';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import ukrFlag from "../assets/ua.svg"
import ruFlag from "../assets/ru.svg"
import deFlag from "../assets/de.svg"
import { useEffect, useState } from 'react';
import { useStreamTranslation } from '../hooks/useStreamTranslation';
import { CircularProgress } from '@mui/material';

const Translator = () => {

    const [inputText, setInputText] = useState("");
    const [lanTo, setLanTo] = useState("");

    const handleLanguageChange = (event: React.SyntheticEvent | null, newValue: string | null) => {
        
        setLanTo(newValue || ""); 

    };

    const { translate, streamedText, isLoading, error } = useStreamTranslation();

    const handleTranslateClick = () => {
    if (inputText.trim()) {
      translate(inputText, lanTo);
    }
  };

    return (
        <main className="main-container">
            
            <article className="translation-container">

                <section className='translator__text-input'>

                    <div className='translator__select-container'>

                        <h2>Eingangstext</h2>

                        <Select defaultValue="German" className='translator__select' onChange={handleLanguageChange}>
                            <Option value="Ukrainian">
                                <img src={ukrFlag} alt="" className='translation-select-img'/>
                                <h4>UKR</h4>
                            </Option>
                            <Option value="Russian">
                                <img src={ruFlag} alt="" className='translation-select-img'/>
                                <h4>RU</h4>
                            </Option>
                            <Option value="German">
                                <img src={deFlag} alt="" className='translation-select-img'/>
                                <h4>DE</h4>
                            </Option>
                        </Select>

                    </div>


                    <Textarea
                        placeholder="Text zur Übersetzung…"
                        defaultValue="Try to put text longer than 4 lines."
                        minRows={12}
                        onChange={(e) => setInputText(e.target.value)}
                        value={inputText}
                    />

                    <button className='btn' style={{width: "100%"}} onClick={() => handleTranslateClick()}> 
                        
                        {isLoading? <CircularProgress/> : "WEITER"} 

                    </button>

                </section>

                <section>

                    <h2>Übersetzungsergebnis</h2>

                    <Card variant="outlined" className='translator__results-container'>
                        
                        
                            {(streamedText || isLoading && (
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                    {streamedText}
                                    {isLoading && (
                                        <span style={{ 
                                            display: 'inline-block', 
                                            width: '8px', 
                                            height: '16px', 
                                            backgroundColor: '#1976d2', 
                                            marginLeft: '4px',
                                            verticalAlign: 'middle',
                                            animation: 'blink 1s step-end infinite' 
                                        }} />
                                    )}
                                </Typography>
                            ))}

                            <style>{`
                            @keyframes blink { 50% { opacity: 0; } }
                            `}</style>
                        

                    </Card>

                    <button className='btn' style={{width: "100%"}}> WEITER </button>

                </section>

            </article>

        </main>
    )
}


export default Translator