import { useEffect } from 'react';
import { BsTranslate } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';


interface TranslationProps {
    id: number;
    name: string;
    translated_text: string;
    formatted_timestamp: string;
}


const TranslationItem = ({id, name, translated_text, formatted_timestamp}: TranslationProps) => {

    const navigate = useNavigate();

    useEffect(()=> {
        console.log(formatted_timestamp);
    })

    return (

        <div className="small-order-container" key={id} onClick={() => {navigate(`/translation/${id}`)}}>
                    
            <div className="order-container-info">
                
                <BsTranslate size={45} className="app-icon"/>
                        
                <div className="order-header">
                    <p style={{fontWeight: 'bold'}}>{name}</p>
                    <p>{translated_text.slice(0,30) + "..."}</p>
                </div>

            </div>
        
            <div>
                <p>{formatted_timestamp}</p>
            </div>
        
        </div>
        
    );
}

export default TranslationItem;
