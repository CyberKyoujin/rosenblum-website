import React, { useState } from "react";
import logo from "../assets/logo.png";
import useAuthStore from "../zustand/useAuthStore";
import logo2 from "../assets/logo2.png"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { MdGTranslate } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BiSolidMessageSquareDetail } from "react-icons/bi";


const Navbar = () => {

    const { logoutUser, user, isAuthenticated } = useAuthStore.getState();
    const [searchQuery, setSearchQuery] = useState<string>("");

    const navigate = useNavigate();

    const handleClick = () => {
        if (searchQuery.trim().length > 0) {
            navigate('/search', { state: { message: searchQuery } });
        }
    }

    return (
        <div className="main-nav-container">
            <div className="nav-logo-container">
                <img src={logo} alt="" className="logo" onClick={() => navigate('/dashboard')}/>
                <img src={logo2} alt="" className="small-logo" onClick={() => navigate('/dashboard')}/>
            </div>

            <div className="nav-links-container">
                <div className="nav-link-container">
                    <MdGTranslate style={{fontSize: "20px"}}/>
                    <Link to="/translator" className="nav-link">Übersetzer</Link>
                </div>

                <div className="nav-link-container">
                    <FaUser style={{fontSize: "20px"}}/>
                    <Link to="/customers" className="nav-link">Kunden</Link>
                </div>

                <div className="nav-link-container">
                    <BiSolidMessageSquareDetail style={{fontSize: "20px"}}/>
                    <Link to="/messages" className="nav-link">Nachrichten</Link>
                </div>

            </div>


            {isAuthenticated && 
            <div className="navbar-user-container">

                <div className="search-container">
                    <input type="text" placeholder="Suche..." onChange={(e) => setSearchQuery(e.target.value)}/>
                    <button type="button" onClick={handleClick}><IoSearch/></button>
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