import React from "react";
import logo from "../assets/logo.png";
import useAuthStore from "../zustand/useAuthStore";
import logo2 from "../assets/logo2.png"
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const { logoutUser, user, isAuthenticated } = useAuthStore.getState();

    const navigate = useNavigate();

    return (
        <div className="main-nav-container">
            <div className="nav-logo-container">
                <img src={logo} alt="" className="logo" onClick={() => navigate('/dashboard')}/>
                <img src={logo2} alt="" className="small-logo" onClick={() => navigate('/dashboard')}/>
            </div>

            {isAuthenticated && 
            <div className="navbar-user-container">
                <p>Hallo, {user?.first_name} {user?.last_name}</p>
                <button onClick={() => logoutUser()} className="btn" style={{padding: '0.5rem', fontSize: '16px'}}>AUSLOGGEN</button>
            </div>
            }

        </div>
    )
}


export default Navbar;