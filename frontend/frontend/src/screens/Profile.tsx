import useAuthStore from "../zustand/useAuthStore";
import { FaUserEdit } from "react-icons/fa";
import useOrderStore from "../zustand/useOrderStore";
import defaultAvatar from '../assets/default_avatar.png'
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import {Link as RouterLink} from "react-router-dom"
import Footer from "../components/Footer";
import { FaInfoCircle } from "react-icons/fa";
import { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import OrdersSection from "../components/OrdersSection";
import UserProfileSection from "../components/UserProfileSection";

const Profile = () => {
    

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