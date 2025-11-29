import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Footer from "../components/Footer";
import OrdersSection from "../components/OrdersSection";
import UserProfileSection from "../components/UserProfileSection";
import useAuthStore from '../zustand/useAuthStore';
import ProfileSkeleton from '../components/ProfileSkeleton';
import ApiErrorAlert from '../components/ApiErrorAlert';
import { ApiError } from '../types/auth';
import ApiErrorView from '../components/ApiErrorView';
import { useIsAtTop } from '../hooks/useIsAtTop';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Profile = () => {

    const { userDataLoading, userDataError } = useAuthStore();

    const [showOrderSuccessAlert, setShowOrderSuccessAlert] = useState(false);
    const [showUpdateSuccessAlert, setShowUpdateSuccessAlert] = useState(false);

    const isAtTop = useIsAtTop(10);
    const location = useLocation();
    const navigate = useNavigate();

    if (userDataLoading) {
        return <ProfileSkeleton/>
    }

    useEffect(() => {
        if (location.state?.orderCreateSuccess){
            setShowOrderSuccessAlert(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
        if (location.state?.profileUpdateSuccess){
            setShowOrderSuccessAlert(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname])
    

    return (
        <>
        {userDataError && <ApiErrorAlert error={userDataError} belowNavbar={isAtTop} fixed={true}/>}

        {showOrderSuccessAlert && <ApiErrorAlert successMessage={"Der Auftrag erfolgreich bearbeitet"} belowNavbar={isAtTop} fixed/>}

        {showOrderSuccessAlert && <ApiErrorAlert successMessage={"Profil erfolgreich bearbeitet"} belowNavbar={isAtTop} fixed/>}


            <main className="main-app-container">


                <section role="presentation" className="profile-navigation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/">Home</Link>
                        <Typography color="text.primary">Profil</Typography>
                    </Breadcrumbs>
                </section>

                <article className="profile__main-section">
                    {userDataError ? (
                        <ApiErrorView message='"Es ist ein technisches Fehler aufgetreten. Versuchen Sie es bitte später."'/>
                    ) : (
                        <>
                            <UserProfileSection/>

                            <h1 className="profile__orders-title">Aufträge</h1>

                            <OrdersSection/>  
                        </>
                    )}

                    

                </article>
        
            </main>

            <Footer/>
            
        </>
    )
}


export default Profile