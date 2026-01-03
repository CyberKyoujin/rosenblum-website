import logo from "../assets/logo.webp";
import useAuthStore from "../zustand/useAuthStore";
import logo2 from "../assets/logo2.webp"
import { useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import NavLinks from "../components/NavLinks";
import TemporaryDrawer from "../components/Drawer";

const Navbar = () => {

    const logoutUser = useAuthStore(s => s.logoutUser);
    const user = useAuthStore(s => s.user);
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    const navigate = useNavigate();

    return (
        <div className="main-nav-container">

            <section className="nav-content">

                <div className="nav-logo-container">
                <img src={logo} alt="" className="logo" onClick={() => navigate('/dashboard')}/>
                <img src={logo2} alt="" className="small-logo" onClick={() => navigate('/dashboard')}/>
                
            </div>


            {isAuthenticated && 
            <>
                <div className="nav-links-container">
                    
                    <NavLinks/>

                </div>

                <div className="navbar-user-container">

                    <p>Hallo, {user?.first_name}</p>

                    <button 
                    onClick={() => {logoutUser(); navigate('/')}} 
                    className="btn"
                    style={{padding: '0.5rem'}}>
                    <TbLogout2 size={25}/>
                    </button>

                </div>
            </>
            }

            <TemporaryDrawer userName={user?.first_name} logout={logoutUser}/>

            </section>

        </div>
    )
}


export default Navbar;