import { IoCloseOutline } from "react-icons/io5";
import Divider from '@mui/material/Divider';
import logo from '../assets/logo.webp'
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
import MenuSliderTitle from "./MenuSliderTitle";
import SliderLinksSection from "./SliderLinksSection";
import MenuSliderLargeLink from "./MenuSliderLargeLink";
import LanguageDropdown from "./LanguageDropdown";

interface MenuSliderProps {
    sliderOpened: boolean;
    setSliderOpened: (open: boolean) => void;
}

const menuSliderLinks = {
  1: [
    {link: "sworn-translations", linkText: "sworn_translations"}, 
    {link: "verbal-translations", linkText: "verbalTranslations"}, 
    {link: "apostille", linkText: "appostile"}
  ],
  2: [
    {link: "languages", linkText: "german", image: deFlag}, 
    {link: "languages", linkText: "ukrainian", image: uaFlag}, 
    {link: "languages", linkText: "russian", image: ruFlag}
  ],
  3: [
    {link: "pricing", linkText: "prices"}, 
    {link: "areas", linkText: "expertise"}, 
    {link: "faq", linkText: "faq"}
  ],
}

const MenuSlider: React.FC<MenuSliderProps> = ({ sliderOpened, setSliderOpened }) => {

  const {t} = useTranslation();

  return (
    <aside className={sliderOpened ? "menu-slider show-slider": "menu-slider"}>

        <div className="slider-header">

          <img src={logo} alt="" loading="lazy" className="slider-logo"/>
          
          <IoCloseOutline className="services-close" onClick={() => setSliderOpened(!sliderOpened)}/>

        </div>

        <LanguageDropdown/>

        <div className="slider-content">

          <p className="services-title">{t('services')}</p>

          <Divider sx={{backgroundColor: 'rgb(235, 235, 235)'}}/>

          <div className="slider-item-container">

            <MenuSliderTitle Icon={BsTranslate} text="translations"/>

            <SliderLinksSection sectionLinks={menuSliderLinks[1]} toggleSlider={setSliderOpened}/>

          </div>

          <div className="slider-item-container">

            <MenuSliderTitle Icon={FaLanguage} text="languages"/>

            <SliderLinksSection sectionLinks={menuSliderLinks[2]} toggleSlider={setSliderOpened}/>

          </div>

          <div className="slider-item-container">

            <MenuSliderTitle Icon={TbTools} text="expertise"/>

            <SliderLinksSection sectionLinks={menuSliderLinks[3]} toggleSlider={setSliderOpened}/>

          </div>

          <Divider sx={{backgroundColor: 'rgb(235, 235, 235)', marginTop: '1rem'}}/>
          <MenuSliderLargeLink link="about-us" linkText="aboutUs" Icon={FaInfo} toggleSlider={setSliderOpened}/>


          <Divider sx={{backgroundColor: 'rgb(235, 235, 235)', padding: '0px'}}/>
          <MenuSliderLargeLink link="contact-us" linkText="contact" Icon={GrContactInfo} toggleSlider={setSliderOpened}/>


          <Divider sx={{backgroundColor: 'rgb(235, 235, 235)'}}/>
          <MenuSliderLargeLink link="order" linkText="offer" Icon={MdLocalOffer} toggleSlider={setSliderOpened}/>


          <Divider sx={{backgroundColor: 'rgb(235, 235, 235)'}}/>

        </div>

      </aside>
  )
}

export default MenuSlider
