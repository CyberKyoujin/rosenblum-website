import React from "react";
import logo from "../assets/logo.png";
import useAuthStore from "../zustand/useAuthStore";
import logo2 from "../assets/logo2.png"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";

const Navbar = () => {

    const { logoutUser, user, isAuthenticated } = useAuthStore.getState();

    const navigate = useNavigate();

    return (
        <div className="main-nav-container">
            <div className="nav-logo-container">
                <img src={logo} alt="" className="logo" onClick={() => navigate('/dashboard')}/>
                <img src={logo2} alt="" className="small-logo" onClick={() => navigate('/dashboard')}/>
            </div>

            <div className="nav-links-container">
                <div className="nav-link-container">
                    <Link to="/" className="nav-link">Übersetzer</Link>
                </div>

                <div className="nav-link-container">
                    <Link to="/" className="nav-link">Kunden</Link>
                </div>
            </div>


            {isAuthenticated && 
            <div className="navbar-user-container">

                <div className="search-container">
                    <input type="text" placeholder="Suche..."/>
                    <button><IoSearch/></button>
                </div>

                <p>Hallo, {user?.first_name}</p>

                <button 
                onClick={() => logoutUser()} 
                className="btn"
                style={{padding: '0.5rem'}}>
                <TbLogout2 style={{fontSize: '25px'}}/>
                </button>

            </div>
            }

        </div>
    )
}


export default Navbar;