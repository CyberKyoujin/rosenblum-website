import { SiGooglemessages } from "react-icons/si";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import MessageInput from "./MessageInput";


const MessagesSkeleton = () => {

 const {t} = useTranslation();

 return (
    <div className="messages-container">

        <div className="messages-title-container">

            <SiGooglemessages size={45} className="app-icon"/>

            <div style={{display: 'flex', gap: '0.5rem'}}>
                <h1>{t('messagesTitleFirst')}</h1>
                <h1 className="header-span">{t('messagesTitleSecond')}</h1>  
            </div>

        </div>

        <Divider sx={{marginTop: '1rem'}}/>

         <div className="messages-main-container skeleton" id="scroll-div"/>

        <MessageInput/>
            

    </div>
 )
}


export default MessagesSkeleton