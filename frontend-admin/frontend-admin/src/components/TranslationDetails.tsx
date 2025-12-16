import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Translation } from '../types/translation';
import { BsTranslate } from "react-icons/bs";
import Divider from '@mui/material/Divider';
import useTranslations from '../zustand/useTranslations';
import { Card } from '@mui/material';
import ComponentLoading from './ComponentLoading';
import ApiErrorAlert from './ApiErrorAlert';
import ErrorView from './ErrorView';
import { useIsAtTop } from '../hooks/useIsAtTop';


const TranslationDetails = () => {

    const { translationId } = useParams();
    const idAsNumber = Number(translationId);

    const isAtTop = useIsAtTop(5);

    const fetchTranslation = useTranslations(s => s.fetchTranslation);
    const translation = useTranslations(s => s.translation);
    const loading = useTranslations(s => s.loading);
    const error = useTranslations(s => s.error);

    useEffect(() => {
        fetchTranslation(idAsNumber);
    }, [])

    return (
        <main className='main-container'>

            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed/>

            <article className='translation-container'>

                <section className='translator-title'>
                    <BsTranslate size={40} className='app-icon'/>
                    <h1>Übersetzungsübersicht</h1>
                </section>

                <Divider/>

                {loading ? (

                    <ComponentLoading/>

                ) : error ? (
                
                    <ErrorView/>

                ) : (

                    <>

                        <section className='translation-details-info'>
                            <h3>{translation?.name}</h3>
                            <p>{translation?.formatted_timestamp}</p>
                        </section>

                        <section className='translation-details-container'>

                            <div className='translation-details-section'>

                                <h3>Eingangstext</h3>

                                <Card className='translator__results-container'>
                                    {translation?.initial_text}
                                </Card>

                            </div>

                            <div className='translation-details-section'>

                                <h3>Ergebnis</h3>

                                <Card className='translator__results-container'>
                                    {translation?.translated_text}
                                </Card>

                            </div>

                        </section>
                    </>

                )}

            </article>
            
        </main>
    );
}

export default TranslationDetails;
