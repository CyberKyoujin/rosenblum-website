import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown} from "react-icons/md";
import logo from '../assets/logo.png'
import smallLogo from '../assets/logo2.png'
import LanguageDropdown from './LanguageDropdown'
import { useTranslation } from 'react-i18next'
import ProfileDropdown from './ProfileDropdown'
import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import MenuSlider from "./MenuSlider";
import { useNavigate } from "react-router-dom";
import { BiSolidMessageDetail } from "react-icons/bi";
import useAuthStore from "../zustand/useAuthStore";
import MessagesDropdown from "./MessagesDropdown";
import ServicesMenu from "./ServicesMenu";

const Navbar: React.FC = () => {
    
  const [openedComponent, setOpenedComponent] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fetchUserMessages, userMessages, isAuthenticated } = useAuthStore.getState();

  useEffect(() => {
    fetchUserMessages();
  }, [fetchUserMessages]);

  const messagesCount = userMessages?.filter(message => !message.viewed).length;

  const handleOverlayClick = () => {
    if (openedComponent) {
      setOpenedComponent(null);
    }
  };

  const toggleServices = () => {
    setOpenedComponent(openedComponent === 'services' ? null : 'services');
  };

  const toggleMessages = () => {
    setOpenedComponent(openedComponent === 'messages' ? null : 'messages');
  };

  const toggleSlider = () => {
    setOpenedComponent(openedComponent === 'slider' ? null : 'slider');
  };


  return (
      <div className='navbar'>
          <div className='nav-container'>
              <div className='nav-header'>
                  <img src={logo} alt="Logo" className='logo' onClick={() => navigate('/')}/>
                  <img src={smallLogo} alt="Small Logo" className="small-logo" onClick={() => navigate('/')}/>
              </div>

              <div className={openedComponent ? "overlay overlay-show" : "overlay"} onClick={handleOverlayClick}></div>

              <div className='nav-center'>
                  <button className='services-btn' onClick={(e) => {e.stopPropagation(); toggleServices();}}>
                      {t('services')} {openedComponent === 'services' ? <MdKeyboardArrowUp/> : <MdKeyboardArrowDown/>}
                  </button>

                  <ServicesMenu isOpened={openedComponent === 'services'} setOpened={toggleServices}/>

                  <AiOutlineMenu className="services-menu"  onClick={(event) => {event.stopPropagation(); toggleSlider();}}/>
                  
                  <p className="nav-link">{t('aboutUs')}</p>
                  <p className="nav-link">{t('contact')}</p>
                  <button className='order-btn' onClick={() => navigate('/order')}>{t('offer')}</button>
                  <p>|</p>

                  <button className="nav-message-container" style={{ display: isAuthenticated ? 'block' : 'none' }} onClick={(e) => {e.stopPropagation(); toggleMessages();}}>
                      <BiSolidMessageDetail style={{fontSize: '45px', color: 'rgb(68 113 203)'}}/>
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

          <MenuSlider sliderOpened={openedComponent === 'slider'} setSliderOpened={() => setOpenedComponent('slider')}/>
      </div>
  );
};


export default Navbar;