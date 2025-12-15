import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Translation } from '../types/translation';
import { BsTranslate } from "react-icons/bs";
import Divider from '@mui/material/Divider';


const TranslationDetails = ({id, name, initial_text, translated_text}: Translation) => {

    const { translationId } = useParams();

    useEffect(() => {
        console.log(name)
    }, [name])

    return (
        <div className='main-container'>

            <article className='translation-container'>

                <div className='translator-title'>
                    <BsTranslate size={40} className='app-icon'/>
                    <h1>Übersetzungsübersicht</h1>
                </div>

                <Divider/>

                <div>
                    {name}
                </div>


            </article>
            
        </div>
    );
}

export default TranslationDetails;
