import React, { useState } from "react";
import logo from "../assets/logo.webp";
import useAuthStore from "../zustand/useAuthStore";
import logo2 from "../assets/logo2.webp"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { MdGTranslate } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { FaChartBar } from "react-icons/fa";
import NavLinks from "../components/NavLinks";
import TemporaryDrawer from "../components/Drawer";

const Navbar = () => {

    const { logoutUser, user, isAuthenticated } = useAuthStore.getState();
    const [searchQuery, setSearchQuery] = useState<string>("");

    const navigate = useNavigate();

    return (
        <div className="main-nav-container">

            <section className="nav-content">

                <div className="nav-logo-container">
                <img src={logo} alt="" className="logo" onClick={() => navigate('/dashboard')}/>
                <img src={logo2} alt="" className="small-logo" onClick={() => navigate('/dashboard')}/>
            </div>

            <div className="nav-links-container">
                
                <NavLinks/>

            </div>


            {isAuthenticated && 
            <div className="navbar-user-container">

                <p>Hallo, {user?.first_name}</p>

                <button 
                onClick={() => {logoutUser(); navigate('/')}} 
                className="btn"
                style={{padding: '0.5rem'}}>
                <TbLogout2 size={25}/>
                </button>

            </div>
            }

            <TemporaryDrawer userName={user?.first_name} logout={logoutUser}/>

            </section>

        </div>
    )
}


export default Navbar;