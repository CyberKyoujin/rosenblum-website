import { useTranslation } from "react-i18next";
import { FaFileAlt } from "react-icons/fa";
import { Divider } from "@mui/material";

const OrderDetailsSkeleton = () => {

    const {t} = useTranslation();

    return (
        <div className="main-app-container">

            <div className="order-details-container">
            
                <div className="order-details-title">

                    <FaFileAlt className="app-icon" size={25} style={{marginBottom: '4px'}}/>

                    <div style={{display: 'flex'}}>
                        <h1>{t('order')}</h1>
                        <h1 className="header-span">{t('übersicht')}</h1>
                    </div>

                </div>

                <Divider orientation="horizontal" style={{marginTop: '1.5rem'}}/>

                <div className="order-details-content skeleton" style={{height: "40rem"}}/>

            </div>
        </div>
    )
}

export default OrderDetailsSkeleton;