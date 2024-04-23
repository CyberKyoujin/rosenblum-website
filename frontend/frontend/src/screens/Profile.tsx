import useAuthStore from "../zustand/useAuthStore";
import Divider from '@mui/material/Divider';
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";
import orderStore from "../zustand/orderStore";
import defaultAvatar from '../assets/default_avatar.png'
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { MdOutlineStickyNote2 } from "react-icons/md";
import Footer from "../components/Footer";



const Profile = () => {

    const { user, fetchUserData, userData} = useAuthStore.getState();
    const { orders, fetchOrders } = orderStore.getState();

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
        fetchOrders();
    }, []);


    console.log("User Data:", userData);
    console.log("User:", user);

    const profileImg = user?.profile_img_url || userData?.image_url || defaultAvatar;

    const handleImageError = (e) => {
        e.target.src = defaultAvatar; 
        console.error("Failed to load user image from URL:", e.target.src);
    };


    return (
        <>
        <div style={{padding: '1rem'}}>

        <div role="presentation" className="profile-navigation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/">Home</Link>
                        <Typography color="text.primary">Profil</Typography>
                    </Breadcrumbs>
                </div>




            <div className="profile-container">

                

            <div className="profile-avatar-container">
                        <div className='image-container'>
                            <img src={profileImg} alt="User Avatar" className="user-avatar" onError={handleImageError} />
                        </div>
                        <div className="profile-name-container">
                            <h2>{`${user?.first_name} ${user?.last_name}`}</h2>
                            <p>Mitglied seit {userData?.date_joined?.slice(0,10)}</p>
                        </div>
                        <button className="profile-btn hover-btn" onClick={() => navigate('/edit-profile')}>
                            <FaUserEdit style={{fontSize: '22px'}}/><p>Profil bearbeiten</p>
                        </button>
                    </div>

                <Divider className='divider-vertical' orientation="vertical" sx={{height: '260px', width: '1px', background: 'rgb(76, 121, 212)', margin: 0}}/>
                <Divider className="divider-horizontal" orientation="horizontal" sx={{background: 'rgb(76, 121, 212)', margin: 0}}/>

                <div className="profile-data-container">

                    <div className="data-title">
                        <h2>Kontanktdaten</h2>
                        <div className="data-items">
                            <div className="data-item"><p className="data-header"><IoMail style={{fontSize: '25px'}}/> Email :</p> <span>{user?.email}</span></div>
                            <div className="data-item"><p className="data-header"><FaPhone style={{fontSize: '25px'}}/> Telefonnumer : </p><span>{userData?.phone_number ? userData.phone_number : 'nicht angegeben'}</span></div>
                            <div className="data-item"><p className="data-header"><MdLocationPin style={{fontSize: '30px'}}/> Anschrift : </p><span>{userData?.street ? `${userData?.street}, ${userData?.zip} ${userData?.city}` : 'nicht angegeben'}</span></div>
                        </div>
                    </div>

                </div>



            </div>

            <div className="profile-orders-container">

                <div className="orders-title">
                    <h1>Ihre </h1>
                    <h1 className="header-span">Aufträge</h1>
                </div>

            

                {orders?.length === 0 ? (

                    <div className="no-orders-container">
                            <MdOutlineStickyNote2 style={{fontSize: '100px'}}/>
                            <h3>Sie haben noch keine Aufträge</h3>
                            <button className="no-orders-btn hover-btn" onClick={() => navigate('/order')}>ANGEBOT ANFORDERN</button>
                    </div>

                ) 
                : 
                (

                <div className="orders-container">
                    {orders?.map((order) => (
                        <div key={order.id} className="profile-order-container" onClick={() => navigate(`/order/${order.id}`)}>
                            <h4>{`# ro-${order.id}-2024`}</h4>
                            <p className="order-date">Bestellt am {order.date}</p>
                            <div className="order-status-container">
                                <p>{order.status === 'review' ? 'wird überprüft...': ''}</p>
                                <div className="order-status"></div>
                            </div>
                        </div>
                    ))}
                </div>

                )}

            </div>

        </div>
        <Footer/>
        </>
    )
}


export default Profile