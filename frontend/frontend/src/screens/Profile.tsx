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

const Profile = () => {

    const { userDataLoading, userDataError } = useAuthStore();

    const isAtTop = useIsAtTop(10);

    if (userDataLoading) {
        return <ProfileSkeleton/>
    }
    
    const testError: ApiError = {status: 500, message: "TEST ERROR"};

    return (
        <>
        {testError && <ApiErrorAlert error={testError} belowNavbar={isAtTop}/>}
            <main className="main-app-container">


                <section role="presentation" className="profile-navigation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/">Home</Link>
                        <Typography color="text.primary">Profil</Typography>
                    </Breadcrumbs>
                </section>

                <article className="profile__main-section">
                    {!testError ? (
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