import React from "react";
import logo from "../assets/logo.png";
import useAuthStore from "../zustand/useAuthStore";


const Navbar = () => {

    const { logoutUser } = useAuthStore.getState();


    return (
        <div className="main-nav-container">
            <div className="nav-logo-container">
                <img src={logo} alt="" className="logo"/>
            </div>
            <div>
                <button onClick={() => logoutUser()}>LOG OUT</button>
            </div>
        </div>
    )
}


export default Navbar;