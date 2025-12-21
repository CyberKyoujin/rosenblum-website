import { RequestAnswer } from '../types/request';
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import Divider from "@mui/material/Divider";


interface RequestDetailsAnswersSectionProps {
    requestAnswers: RequestAnswer[] | null;

}

const RequestDetailsAnswersSection = ({

    requestAnswers

    }: RequestDetailsAnswersSectionProps) => {

    return (
        <>

            {requestAnswers && requestAnswers?.length > 0 &&
                        <>

                            <Divider orientation="horizontal"/>

                            <div className="request-details-answers-container">

                                <div className="request-details-item-title-container">

                                    <BiSolidMessageSquareDetail size={25} className="app-icon"/>
                                    <h2>Ihr Antwort</h2>

                                </div>     

                                <div className="request-answers-container">
                                    {requestAnswers?.map((answer, idx) => (

                                        <div key={idx} className="request-answers-content">
                                            <p className="request-answers-timestamp">{answer.formatted_timestamp}</p>
                                            <p>{answer.answer_text}</p>
                                        </div>

                                    ))}
                                </div>
                            </div>

                        </>
                    }
            
        </>
    );
}

export default RequestDetailsAnswersSection;
