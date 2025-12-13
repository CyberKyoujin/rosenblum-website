

import React, { useEffect, useState } from 'react';
import useRequestsStore from '../zustand/useRequests';
import { useParams } from 'react-router-dom';


const useRequestDetails = () => {

    const { requestId } = useParams();
    const idAsNumber = Number(requestId);
    const isValidId = !isNaN(idAsNumber) && requestId !== undefined;

    const [answer, setAnswer] = useState<string>("");
    
    const fetchRequest = useRequestsStore(s => s.fetchRequestData);
    const fetchRequestAnswers = useRequestsStore(s => s.fetchRequestAnswers);
    const sendRequestAnswer = useRequestsStore(s => s.sendRequestAnswer);

    const request = useRequestsStore(s => s.request);
    const requestAnswers = useRequestsStore(s => s.requestAnswers);
    

    const loading = useRequestsStore(s => s.loading);
    const error = useRequestsStore(s => s.error);
    const sendAnswerLoading = useRequestsStore(s => s.sendAnswerLoading);
    const sendAnswerSuccess = useRequestsStore(s => s.sendAnswerSuccess);

    useEffect(() => {
        fetchRequest(idAsNumber);
        fetchRequestAnswers(idAsNumber);
    }, [idAsNumber, isValidId, fetchRequest, fetchRequestAnswers])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
            e.preventDefault();
    
            if (requestId && answer.length > 0){
    
                const formData = new FormData();
    
                try {
                    formData.append("request", requestId);
                    formData.append("answer_text", answer);
                    
                    await sendRequestAnswer(formData);
                    await fetchRequestAnswers(idAsNumber);
    
                    setAnswer("")
                } catch (err: unknown) {
                    console.error(err);
                }
            }
        }
    

    return {
        answer,
        setAnswer,
        fetchRequest,
        fetchRequestAnswers,
        sendRequestAnswer,
        request,
        requestAnswers,
        loading,
        error,
        sendAnswerLoading,
        sendAnswerSuccess,
        handleSubmit,
        isValidId
    };
}

export default useRequestDetails;
