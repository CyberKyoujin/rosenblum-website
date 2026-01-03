import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown} from "react-icons/md";
import logo from '../assets/logo.webp'
import smallLogo from '../assets/logo2.webp'
import LanguageDropdown from './LanguageDropdown'
import { useTranslation } from 'react-i18next'
import ProfileDropdown from './ProfileDropdown'
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import MenuSlider from "./MenuSlider";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidMessageDetail } from "react-icons/bi";
import useAuthStore from "../zustand/useAuthStore";
import MessagesDropdown from "./MessagesDropdown";
import ServicesMenu from "./ServicesMenu";
import useMessageStore from "../zustand/useMessageStore";

type OpenedComponent = "services" | "messages" | "slider" | null;

const Navbar: React.FC = () => {
    
  const [openedComponent, setOpenedComponent] = useState<OpenedComponent>(null);
  
  const { isAuthenticated, user } = useAuthStore();
  const {messages} = useMessageStore();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const messagesCount = messages?.filter(m => m.receiver === user?.id && !m.viewed).length ?? 0;

  const handleOverlayClick = () => {
    if (openedComponent) {
      setOpenedComponent(null);
    }
  };

  const toggle = (name: OpenedComponent) => setOpenedComponent(openedComponent === name ? null : name);

  return (

      <div className='navbar'>

          <div className='nav-container'>

              <div className='nav-header'>
                  <img src={logo} fetchPriority="high" alt="Logo" className='logo' onClick={() => navigate('/')}/>
                  <img src={smallLogo} fetchPriority="high" alt="Small Logo" className="small-logo" onClick={() => navigate('/')}/>
              </div>

              <div className={openedComponent ? "overlay overlay-show" : "overlay"} onClick={handleOverlayClick}></div>

              <div className='nav-center'>

                  <button className='services-btn' onClick={(e) => {e.stopPropagation();  toggle("services");}}>
                      {t('services')} {openedComponent === 'services' ? <MdKeyboardArrowUp/> : <MdKeyboardArrowDown/>}
                  </button>

                  <ServicesMenu isOpened={openedComponent === 'services'} setOpened={() => toggle("services")}/>

                  <AiOutlineMenu className="services-menu"  onClick={(event) => {event.stopPropagation();  toggle("slider")}}/>
                  
                  <Link className="nav-link app-link" to="/about-us">{t('aboutUs')}</Link>
                  <Link className="nav-link app-link" to="/contact-us">{t('contact')}</Link>
                  <Link className='order-btn app-link' to="/order">{t('offer')}</Link>

                  <p>|</p>

                  <button className="nav-message-container" style={{ display: isAuthenticated ? 'block' : 'none' }} onClick={(e) => { e.stopPropagation(); toggle("messages"); }}>

                      <BiSolidMessageDetail size={45} className="app-icon"/>

                      <div className="messages-counter" style={{display: messagesCount > 0 ? 'block': 'none'}}>
                          <p style={{marginTop: '2px'}}>{messagesCount}</p>
                      </div>

                      <MessagesDropdown isOpened={openedComponent === 'messages'}/>

                  </button>

                  <div className="language-container">
                      <LanguageDropdown/>
                  </div>
                  
                  <ProfileDropdown/>

              </div>

          </div>

          <MenuSlider sliderOpened={openedComponent === 'slider'} setSliderOpened={() => toggle("slider")}/>

      </div>
  );
};


export default Navbar;