import { SiGooglemessages } from "react-icons/si";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MessageInput from "./MessageInput";


const MessagesSkeleton = () => {

 const {t} = useTranslation();

 return (
    <div className="messages-container">

        <div role="presentation" style={{marginBottom: '3rem'}}>
            <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">Home</Link>
            <Typography color="text.primary">Nachrichten</Typography>
            </Breadcrumbs>
        </div>

        <div className="messages-title-container">
            <SiGooglemessages style={{fontSize: '45px', color: 'rgb(76, 121, 212)'}}/>
            <div style={{display: 'flex', gap: '0.5rem'}}>
                <h1>{t('messagesTitleFirst')}</h1>
                <h1 className="header-span">{t('messagesTitleSecond')}</h1>  
            </div>
        </div>

        <Divider sx={{marginTop: '1rem'}}/>

         <div className="messages-main-container skeleton" id="scroll-div">
        </div>

        <MessageInput/>
            

    </div>
 )
}


export default MessagesSkeleton