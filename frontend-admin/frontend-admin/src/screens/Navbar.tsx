import logo from "../assets/logo.webp";
import useAuthStore from "../zustand/useAuthStore";
import logo2 from "../assets/logo2.webp"
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import NavLinks from "../components/NavLinks";
import TemporaryDrawer from "../components/Drawer";

const Navbar = () => {

    const logoutUser = useAuthStore(s => s.logoutUser);
    const user = useAuthStore(s => s.user);
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    const navigate = useNavigate();

    return (
        <nav className="nav">
            <div className="nav__inner">

                <div className="nav__logo-container">
                    <img src={logo} alt="" className="nav__logo" onClick={() => navigate('/dashboard')}/>
                    <img src={logo2} alt="" className="nav__logo--small" onClick={() => navigate('/dashboard')}/>
                </div>

                {isAuthenticated &&
                <>
                    <div className="nav__links">
                        <NavLinks/>
                    </div>

                    <div className="nav__user">
                        <div className="nav__user-info">
                            <div className="nav__avatar">
                                {user?.first_name?.charAt(0) || 'A'}
                            </div>
                            <span className="nav__greeting">{user?.first_name}</span>
                        </div>

                        <button
                            onClick={() => {logoutUser(); navigate('/')}}
                            className="nav__logout-btn"
                            title="Abmelden"
                        >
                            <IoLogOutOutline />
                        </button>
                    </div>
                </>
                }

                <TemporaryDrawer userName={user?.first_name} logout={logoutUser}/>

            </div>
        </nav>
    )
}

export default Navbar;