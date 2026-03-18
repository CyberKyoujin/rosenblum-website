import OrdersSection from "../components/OrdersSection";
import UserProfileSection from "../components/UserProfileSection";
import useAuthStore from '../zustand/useAuthStore';
import ProfileSkeleton from '../components/ProfileSkeleton';
import ApiErrorAlert from '../components/ApiErrorAlert';
import ApiErrorView from '../components/ApiErrorView';
import { useIsAtTop } from '../hooks/useIsAtTop';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useOrderStore from "../zustand/useOrderStore";

const Profile = () => {

    const { userDataLoading, userDataError } = useAuthStore();
    const { fetchOrders } = useOrderStore();

    const [showOrderSuccessAlert, setShowOrderSuccessAlert] = useState(false);
    const [showUpdateSuccessAlert, setShowUpdateSuccessAlert] = useState(false);

    const isAtTop = useIsAtTop(10);
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (userDataLoading) {
        return <ProfileSkeleton/>
    }

    useEffect(() => {
        if (location.state?.orderCreateSuccess){
            setShowOrderSuccessAlert(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
        if (location.state?.profileUpdateSuccess){
            setShowUpdateSuccessAlert(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname])

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders])
    

    return (
        <>
        {userDataError && <ApiErrorAlert error={userDataError} belowNavbar={isAtTop} fixed={true}/>}

        {showOrderSuccessAlert && <ApiErrorAlert successMessage={t('orderSuccessMessage')} belowNavbar={isAtTop} fixed/>}

        {showUpdateSuccessAlert && <ApiErrorAlert successMessage={t('profileUpdateSuccess')} belowNavbar={isAtTop} fixed/>}


            <main className="main-app-container">

                <article className="profile__main-section">

                    {userDataError ? (

                        <ApiErrorView error={userDataError}/>

                    ) : (

                        <>
                            <UserProfileSection/>

                            

                            <OrdersSection/>  
                        </>

                    )}
                    
                </article>

        
            </main>
            
        </>
    )
}


export default Profile