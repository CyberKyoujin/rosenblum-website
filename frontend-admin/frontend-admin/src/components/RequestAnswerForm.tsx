import { RiEdit2Fill } from "react-icons/ri";
import Textarea from '@mui/joy/Textarea';
import { CircularProgress } from "@mui/material";
import { SetStateAction } from "react";

interface RequestAnswerFormProps {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    answer: string
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
        <form className="request-details-contact-info" onSubmit={handleSubmit}>

                    <div className="request-details-item-title-container">

                            <RiEdit2Fill size={30} className="app-icon"/>

                            <h2>Anfrage beantworten</h2>

                    </div>

                    <div className="request-details-input-container">
                        <Textarea placeholder="Ihr Antwort..." minRows={3} value={answer} onChange={(e) => setAnswer(e.target.value)}/>
                    </div>

                    <button className="request-datails-btn" type="submit">
                        {sendAnswerLoading ? <CircularProgress sx={{color: "white"}}/> : "WEITER"}
                    </button>

        </form>
    )
}


export default RequestAnswerForm