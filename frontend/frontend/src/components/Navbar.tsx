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
  const [servicesOpened, setServicesOpened] = useState<boolean>(false);
  const [sliderOpened, setSliderOpened] = useState<boolean>(false);
  const [messagesOpen, setMessagesOpen] = useState<boolean>(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fetchUserMessages, userMessages, isAuthenticated } = useAuthStore.getState();

  useEffect(() => {
      fetchUserMessages();
  }, [fetchUserMessages]);

  return (
      <div className='navbar'>
          <div className='nav-container'>
              <div className='nav-header'>
                  <img src={logo} alt="" className='logo' onClick={() => navigate('/')}/>
                  <img src={smallLogo} alt="" className="small-logo" onClick={() => navigate('/')}/>
              </div>

              <div className='nav-center'>
                  <button className='services-btn' onClick={() => setServicesOpened(!servicesOpened)}>
                      {t('services')} {servicesOpened ? <MdKeyboardArrowUp/> : <MdKeyboardArrowDown/>}
                  </button>
                  <div className={servicesOpened ? "overlay overlay-show" : "overlay"} onClick={() => setServicesOpened(!servicesOpened)}></div>
                  
                  <AiOutlineMenu className="services-menu" onClick={() => setSliderOpened(!sliderOpened)}/>
                  
                  <ServicesMenu isOpened={servicesOpened} setOpened={setServicesOpened}/>
                  
                  <p className="nav-link">{t('aboutUs')}</p>
                  <p className="nav-link">{t('contact')}</p>
                  <button className='order-btn' onClick={() => navigate('/order')}>{t('offer')}</button>
                  <p>|</p>

                  <div className="nav-message-container" style={{display: !isAuthenticated ? 'none' : 'block'}} onClick={() => setMessagesOpen(!messagesOpen)}>
                      <BiSolidMessageDetail style={{fontSize: '45px', color: 'rgb(68 113 203)', cursor: 'pointer'}}/>

                      <div className="messages-counter">
                          <p>1</p>
                      </div>

                      <MessagesDropdown isOpened={messagesOpen}/>
                  </div>

                  <div className="language-container">
                      <LanguageDropdown/>
                  </div>
                  
                  <ProfileDropdown/>
              </div>
          </div>

          <MenuSlider sliderOpened={sliderOpened} setSliderOpened={setSliderOpened}/>
      </div>
  );
};


export default Navbar