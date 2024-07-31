import React from "react";
import logo from "../assets/logo.png";


const Navbar = () => {
    return (
        <div className="main-nav-container">
            <div className="nav-logo-container">
                <img src={logo} alt="" className="logo"/>
            </div>
        </div>
    )
}


export default Navbar;