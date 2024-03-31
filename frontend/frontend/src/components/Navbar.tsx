import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown} from "react-icons/md";
import logo from '../assets/logo.png'
import smallLogo from '../assets/logo2.png'
import LanguageDropdown from './LanguageDropdown'
import { useTranslation } from 'react-i18next'
import ProfileDropdown from './ProfileDropdown'
import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsTranslate } from "react-icons/bs";
import { FaLanguage } from "react-icons/fa6";
import { TbTools } from "react-icons/tb";
import MenuSlider from "./MenuSlider";
import { useNavigate } from "react-router-dom";


const Navbar = () => {

  const [servicesOpened, setServicesOpened] = useState<boolean>(false);
  const [sliderOpened, setSliderOpened] = useState<boolean>(false);
  const {t} = useTranslation();
  const navigate = useNavigate();

  return (
    <div className='navbar'>

      <div className='nav-container'>

        <div className='nav-header'>
              <img src={logo} alt="" className='logo' onClick={() => navigate('/')}/>
              <img src={smallLogo} alt="" className="small-logo" onClick={() => navigate('/')}/>
        </div>

        <div className='nav-center'>
          <button className='services-btn' onClick={() => setServicesOpened(!servicesOpened)}>{t('services')} {servicesOpened ? <MdKeyboardArrowUp/> : <MdKeyboardArrowDown/>}</button>
          <div className={servicesOpened ? "overlay overlay-show" : "overlay"} onClick={() => setServicesOpened(!servicesOpened)}></div>

          <div className={servicesOpened ? 'services-container show-services' : 'services-container'}>

              <div className='services-header'>
                <h4 className="nav-link" style={{fontWeight: 'normal'}}>{t('services')}</h4>
              </div>

              <div className="services-content">

                <div className="services-col">
                  <BsTranslate className="translate-icon"/>
                  <h5>{t('translations')}</h5>
                  <p>{t('prof_translations')}</p>
                  <p>{t('sworn_translations')}</p>
                  <p>{t('verbalTranslations')}</p>
                </div>

                <div className="services-col">
                  <FaLanguage className="translate-icon"/>
                  <h5>{t('languages')}</h5>
                  <p>{t('german')}</p>
                  <p>{t('ukrainian')}</p>
                  <p>{t('russian')}</p>
                </div>

                <div className="services-col">
                  <TbTools className="translate-icon"/>
                  <h5>{t('expertise')}</h5>
                  <p>{t('pricesAndDocuments')}</p>
                  <p>{t('medicine')}</p>
                  <p>{t('law')}</p>
                </div>

                </div>

          

              <IoCloseOutline className="services-close" onClick={() => setServicesOpened(!servicesOpened)}/>

          </div>

          <AiOutlineMenu className="services-menu" onClick={() => setSliderOpened(!sliderOpened)}/>

          <p className="nav-link">{t('aboutUs')}</p>
          <p className="nav-link">{t('contact')}</p>
          <button className='order-btn' onClick={() => navigate('/order')}>{t('offer')}</button>
          <p>|</p>

          <div className="language-container">
            <LanguageDropdown/>
          </div>
          
          <ProfileDropdown/>
        </div>

      </div>

      <MenuSlider sliderOpened={sliderOpened} setSliderOpened={setSliderOpened}/>

      

    </div>
  )
}

export default Navbar