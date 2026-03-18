import { IoIosWarning } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { ApiErrorResponse } from "../types/error";

interface ApiErrorViewProps {
    error: ApiErrorResponse;
}

const ApiErrorView: React.FC<ApiErrorViewProps> = ({ error }) => {
    const { t } = useTranslation();
    const translatedMessage = t(error.code, { defaultValue: '' });
    const displayMessage = translatedMessage || error.message;

    return (
        <div className="error-view-container">
            <IoIosWarning size={70} color="#4C79D4"/>
            <p>{displayMessage}</p>
        </div>
    )
}

export default ApiErrorView;