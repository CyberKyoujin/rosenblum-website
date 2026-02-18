import Textarea from '@mui/joy/Textarea';
import { CircularProgress } from "@mui/material";
import { SetStateAction } from "react";

interface RequestAnswerFormProps {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    answer: string;
    setAnswer: React.Dispatch<SetStateAction<string>>;
    sendAnswerLoading: boolean;
}

const RequestAnswerForm = ({
    handleSubmit,
    answer,
    setAnswer,
    sendAnswerLoading
}: RequestAnswerFormProps) => {

    return (
        <form className="od__card od__card--full" onSubmit={handleSubmit}>
            <h3 className="od__card-title">Anfrage beantworten</h3>
            <Textarea
                placeholder="Ihre Antwort..."
                minRows={3}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                sx={{ mb: 2 }}
            />
            <button className="od__submit-btn" type="submit">
                {sendAnswerLoading ? <CircularProgress size={20} sx={{color: "white"}}/> : "Senden"}
            </button>
        </form>
    );
};


export default RequestAnswerForm;
