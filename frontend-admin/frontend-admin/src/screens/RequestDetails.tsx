import { useNavigate } from "react-router-dom";
import RequestDetailsSkeleton from "../components/RequestDetailsSkeleton";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import RequestAnswerForm from "../components/RequestAnswerForm";
import RequestDetailsAnswersSection from "../components/RequestDetailsAnswersSection";
import RequestDetailsContactsSection from "../components/RequestDetailsContactsSection";
import useRequestDetails from "../hooks/useRequestDetails";
import { IoChevronBack } from "react-icons/io5";


const RequestDetails = () => {

    const isAtTop = useIsAtTop(5);
    const navigate = useNavigate();

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

            <div className="od">

                <button className="od__back-btn" type="button" onClick={() => navigate('/messages')}>
                    <IoChevronBack />
                    Zurück zu Nachrichten
                </button>

                {/* Header Card */}
                <div className="od__header-card">
                    <div className="od__header-content">
                        <div className="od__header-info">
                            <h1 className="od__order-id">Anfrage #{request?.id}</h1>
                            <p className="od__order-date">{request?.formatted_timestamp}</p>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="od__body">
                    <div className="od__cards-grid">
                        <RequestDetailsContactsSection request={request}/>

                        <div className="od__card">
                            <h3 className="od__card-title">Nachricht</h3>
                            <div className="od__message-box">
                                {request?.message || 'Keine Nachricht.'}
                            </div>
                        </div>
                    </div>

                    <RequestDetailsAnswersSection requestAnswers={requestAnswers}/>

                    <RequestAnswerForm
                        handleSubmit={handleSubmit}
                        answer={answer}
                        setAnswer={setAnswer}
                        sendAnswerLoading={sendAnswerLoading}
                    />
                </div>

            </div>

        </main>
    );
};


export default RequestDetails;
