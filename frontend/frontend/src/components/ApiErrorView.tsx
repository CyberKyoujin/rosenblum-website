import { IoIosWarning } from "react-icons/io";

interface ApiErrorViewProps {
    message: string;
}

const ApiErrorView: React.FC<ApiErrorViewProps> = ({message}) => {
    return (
        <div className="error-view-container">
            <IoIosWarning size={70} color="#4C79D4"/>
            <p>{message}</p>
        </div>
    )
}

export default ApiErrorView;