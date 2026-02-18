import { useNavigate } from 'react-router-dom';
import { IoLanguageOutline, IoChevronForward } from "react-icons/io5";


interface TranslationProps {
    id: number;
    name: string;
    translated_text: string;
    formatted_timestamp: string;
}


const TranslationItem = ({id, name, translated_text, formatted_timestamp}: TranslationProps) => {

    const navigate = useNavigate();

    return (
        <div className="oi" onClick={() => { navigate(`/translation/${id}`); }}>
            <div className="oi__icon">
                <IoLanguageOutline />
            </div>

            <div className="oi__content">
                <span className="oi__id">{name}</span>
                <span className="oi__name">{translated_text.slice(0, 30) + "..."}</span>
            </div>

            <div className="oi__right">
                <span className="oi__timestamp">{formatted_timestamp}</span>
            </div>

            <IoChevronForward className="oi__chevron" />
        </div>
    );
}

export default TranslationItem;
