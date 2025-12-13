import { FaQuestionCircle } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import RequestDetailsSkeleton from "../components/RequestDetailsSkeleton";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import RequestAnswerForm from "../components/RequestAnswerForm";
import RequestDetailsAnswersSection from "../components/RequestDetailsAnswersSection";
import RequestDetailsContactsSection from "../components/RequestDetailsContactsSection";
import useRequestDetails from "../hooks/useRequestDetails";


const RequestDetails = () => {

    const isAtTop = useIsAtTop(5);

    const {

        request, 
        requestAnswers, 
        loading, 
        error, 
        answer, 
        setAnswer, 
        handleSubmit, 
        sendAnswerLoading,
        sendAnswerSuccess,
        isValidId

    } = useRequestDetails();


    if (loading) {
        return <RequestDetailsSkeleton/>
    }

    return (
        <main className="main-container">

            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed/>
            {sendAnswerSuccess && <ApiErrorAlert successMessage={"Anfrage erfolgreich beantwortet"} belowNavbar={isAtTop} fixed/>}
            {!isValidId && <ApiErrorAlert error={{status:404, code: "InvalidId", message: "Invalid Request ID"}} belowNavbar={isAtTop} fixed/>}

            <article className="request-details-container">

            
                <header className="request-details-title">

                    <div className="request-details-item-title-container">

                        <FaQuestionCircle className="order-details-icon" size={40}/>           
                        <h1>Anfrageübersicht</h1>
                                
                    </div>
                                
                </header>

                <Divider orientation="horizontal"/>

                <RequestDetailsContactsSection request={request}/>

                <Divider orientation="horizontal"/>

                <section className="request-details-contact-info">

                    <div className="request-details-item-title-container">

                            <BiSolidMessageSquareDetail size={25} className="app-icon"/>
                            <h2>Nachricht</h2>

                    </div>
                    
                    <div>
                        <p>{request?.message}</p>
                    </div>

                    <RequestDetailsAnswersSection requestAnswers={requestAnswers}/>

                </section>

                <Divider orientation="horizontal"/>

                <RequestAnswerForm handleSubmit={handleSubmit} answer={answer} setAnswer={setAnswer} sendAnswerLoading={sendAnswerLoading}/>

            </article>

        </main>
    )
}


export default RequestDetails