import { IoCloseOutline } from "react-icons/io5";
import Divider from '@mui/material/Divider';
import logo from '../assets/logo.png'
import { FaLanguage } from "react-icons/fa6";
import { TbTools } from "react-icons/tb";
import { BsTranslate } from "react-icons/bs";
import { useTranslation } from 'react-i18next'
import { FaInfo } from "react-icons/fa";
import { GrContactInfo } from "react-icons/gr";
import ruFlag from '../assets/ru.svg';
import deFlag from '../assets/de.svg';
import uaFlag from '../assets/ua.svg';
import { MdLocalOffer } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface MenuSliderProps {
    sliderOpened: boolean;
    setSliderOpened: (open: boolean) => void;
}

const MenuSlider: React.FC<MenuSliderProps> = ({ sliderOpened, setSliderOpened }) => {

  const {t} = useTranslation();
  const navigate = useNavigate();

  return (
    <aside className={sliderOpened ? "menu-slider show-slider": "menu-slider"}>

        <div className="slider-header">
          <img src={logo} alt="" className="slider-logo"/>
          <IoCloseOutline className="services-close" onClick={() => setSliderOpened(!sliderOpened)}/>
        </div>

        <div className="slider-content">

          <p className="services-title">{t('services')}</p>
          <Divider sx={{backgroundColor: 'rgb(235, 235, 235)'}}/>

          <div className="slider-item-container">

            <div className="slider-title-top">
              <BsTranslate style={{color: 'RGB(76 121 212)'}}/>
              <p>{t('translations')}</p>
            </div>

            <div className="slider-item">
              <p>{t('prof_translations')}</p>
              <p>{t('sworn_translations')}</p>
              <p>{t('verbalTranslations')}</p>
            </div>

          </div>

          <div className="slider-item-container">

            <div className="slider-title-top">
              <FaLanguage style={{color: 'RGB(76 121 212)'}}/>
              <p>{t('languages')}</p>
            </div>

            <div className="slider-item">
              <p><img src={deFlag} alt="" />{t('german')}</p>
              <p><img src={uaFlag} alt="" />{t('ukrainian')}</p>
              <p><img src={ruFlag} alt="" />{t('russian')}</p>
            </div>

          </div>

          <div className="slider-item-container">

            <div className="slider-title-top">
              <TbTools style={{color: 'RGB(76 121 212)'}}/>
              <p>{t('expertise')}</p>
            </div>

            <div className="slider-item">
              <p>{t('pricesAndDocuments')}</p>
              <p>{t('medicine')}</p>
              <p>{t('law')}</p>
            </div>

          </div>

          <Divider sx={{backgroundColor: 'rgb(235, 235, 235)', marginTop: '1rem'}}/>

          <div className="slider-footer-container" onClick={() => {navigate('about-us/'); setSliderOpened(!setSliderOpened)}}>
                <FaInfo className="slider-icon"/>
                <p>{t('aboutUs')}</p>
          </div>

          <Divider sx={{backgroundColor: 'rgb(235, 235, 235)', padding: '0px'}}/>

          <div className="slider-footer-container" onClick={() => {navigate('contact-us/'); setSliderOpened(!setSliderOpened)}}>
                <GrContactInfo className="slider-icon"/>
                <p>{t('contact')}</p>
          </div>

          <Divider sx={{backgroundColor: 'rgb(235, 235, 235)'}}/>

          <div className="slider-footer-container" onClick={() => {navigate('/order'); setSliderOpened(!setSliderOpened)}}>
                <MdLocalOffer className="slider-icon"/>
                <p>{t('offer')}</p>
          </div>

          <Divider sx={{backgroundColor: 'rgb(235, 235, 235)'}}/>

        </div>

      </aside>
  )
}

export default MenuSlider
