import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BsTranslate } from "react-icons/bs";
import Divider from '@mui/material/Divider';
import useTranslations from '../zustand/useTranslations';
import ComponentLoading from './ComponentLoading';
import ApiErrorAlert from './ApiErrorAlert';
import ErrorView from './ErrorView';
import { useIsAtTop } from '../hooks/useIsAtTop';
import OrderDeleteNotification from './OrderDeleteNotification';
import { FaRegTrashAlt } from 'react-icons/fa';
import TranslationDetailsContent from './TranslationDetailsContent';

const TranslationDetails = () => {

    const { translationId } = useParams();
    const idAsNumber = Number(translationId);

    const [notificationOpen, setNotificationOpen] = useState(false);

    const isAtTop = useIsAtTop(5);

    const navigate = useNavigate();

    const fetchTranslation = useTranslations(s => s.fetchTranslation);
    const deleteTranslation = useTranslations(s => s.deleteTranslation);
    const translation = useTranslations(s => s.translation);
    const loading = useTranslations(s => s.loading);
    const error = useTranslations(s => s.error);

    useEffect(() => {
        fetchTranslation(idAsNumber);
    }, [])

    const handleDelete = async () => {
        try{
            await deleteTranslation(idAsNumber);
            navigate("/translator", {replace: true})
        } catch (err: unknown) {
            console.error(err);
        }
    }

    return (

        <main className='main-container'>

            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed/>

            <OrderDeleteNotification notificationOpen={notificationOpen} setNotificationOpen={setNotificationOpen} handleDelete={handleDelete}/>

            <article className='translation-container'>

                <section className='translation-details-title'>

                    <div className='translator-title'>

                        <BsTranslate size={40} className='app-icon'/>
                        <h1>Übersetzungsübersicht</h1>

                    </div>

                    <button className='order-action-btn red-btn' onClick={() => setNotificationOpen(!notificationOpen)}>
                        <FaRegTrashAlt size={15}/>
                        Löschen
                    </button>
                    
                </section>

                <Divider/>

                {loading ? (

                    <ComponentLoading/>

                ) : error ? (
                
                    <ErrorView/>

                ) : translation ? (

                    <TranslationDetailsContent translation={translation}/>

                ): null}

            </article>
            
        </main>

    );
}

export default TranslationDetails;
