import { RequestAnswer } from '../types/request';

interface RequestDetailsAnswersSectionProps {
    requestAnswers: RequestAnswer[] | null;
}

const RequestDetailsAnswersSection = ({ requestAnswers }: RequestDetailsAnswersSectionProps) => {

    if (!requestAnswers || requestAnswers.length === 0) {
        return null;
    }

    return (
        <div className="od__card od__card--full">
            <h3 className="od__card-title">Ihre Antworten</h3>
            <div className="od__answers-list">
                {requestAnswers.map((answer, idx) => (
                    <div key={idx} className="od__answer-item">
                        <span className="od__answer-timestamp">{answer.formatted_timestamp}</span>
                        <p className="od__answer-text">{answer.answer_text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RequestDetailsAnswersSection;
