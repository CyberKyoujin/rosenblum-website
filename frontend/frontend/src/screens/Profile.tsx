import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Footer from "../components/Footer";
import OrdersSection from "../components/OrdersSection";
import UserProfileSection from "../components/UserProfileSection";
import useAuthStore from '../zustand/useAuthStore';
import ProfileSkeleton from '../components/ProfileSkeleton';


const Profile = () => {

    const { userDataLoading } = useAuthStore();

    if (userDataLoading) {
        return <ProfileSkeleton/>
    }
    

    return (
        <>
            <main className="main-app-container">


                <section role="presentation" className="profile-navigation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/">Home</Link>
                        <Typography color="text.primary">Profil</Typography>
                    </Breadcrumbs>
                </section>

                <article className="profile__main-section">

                    <UserProfileSection/>

                    <h1 className="profile__orders-title">Aufträge</h1>

                    <OrdersSection/>  

                </article>
        
            </main>

            <Footer/>
            
        </>
    )
}


export default Profile