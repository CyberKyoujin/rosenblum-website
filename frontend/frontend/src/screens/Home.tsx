import React from "react";
import planetIcon from '../assets/planet_icon.jpg'
import smartphoneIcon from '../assets/smartphone_icon.jpg'
import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import { useState, useEffect } from "react";
import tick from '../assets/tick.gif'
import { CustomSlider } from "../components/Slider";
import reviews from "../data";
import Rating from '@mui/material/Rating';
import Footer from "../components/Footer";
import { MdLocalOffer } from "react-icons/md";
import { FaInfo } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { HiPhone } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../zustand/useAuthStore";
import { translateReviews } from "../utils/TranslationService";

interface Review {
    author_name: string;
    author_url: string;
    profile_photo_url: string;
    rating: number;
    relative_time_description: string;
    text: string;
}

const Home = () => {

  const { t } = useTranslation();

  const [years, setYears] = useState<number>(0);
  const [translations, setTranslations] = useState<number>(0);
  const [languages, setLanguages] = useState<number>(0);

  const { fetchReviews, reviews } = useAuthStore.getState();

  const [translatedReviews, setTranslatedReviews] = useState<Review[]>([]);

  const navigate = useNavigate();

  const animateCounter = (from: number, to: number, duration: number, setFunction: React.Dispatch<React.SetStateAction<number>>): void => {
    const difference = to - from;
    const perTick = difference / (duration / 10);

    let timer = setInterval(() => {
      setFunction((currentValue) => {
        const newValue = currentValue + perTick;
        if ((perTick > 0 && newValue >= to) || (perTick < 0 && newValue <= to)) {
          clearInterval(timer);
          return to; 
        }
        return newValue;
      });
    }, 10); 
  };

  useEffect(() => {
    fetchReviews();
  }, [])

  useEffect(() => {
    
    const translate = async () => {
        try {
            if (reviews){
            const translated = await translateReviews(reviews);
            setTranslatedReviews(translated);
            }
        } catch (error) {
            console.error('Error translating reviews:', error);
        }
    };

    translate();

  }, [reviews])


  console.log(translatedReviews);


  useEffect(() => {
    animateCounter(0, 8, 3000, setYears); 
    animateCounter(0, 10000, 3000, setTranslations); 
    animateCounter(0, 5000, 3000, setLanguages);
  }, []);

  return(
    <>

    <div className="home-container">
        <div className="home-header">
        <img src={planetIcon} alt="" />
            <div className="home-header-text">
                <h1>{t('weTranslate')}</h1>
                <h1 className="header-span">{t('professional')}.</h1>
                <div className="home-header-content">
                    <p>{t('excellentTranslations')}</p>
                </div>
                <div className="btn-overlay"></div>
                <button className="home-header-btn hover-btn" onClick={() => navigate('/order')}>{t('orderOffer')}<MdLocalOffer/></button>
            </div>
        </div>

        <Divider orientation="horizontal" flexItem sx={{backgroundColor: 'lightgray', width: '100%', height: '2px', margin: 'auto', marginTop: '3rem', marginBottom: '4rem'}}/>

        <div className="reviews-header">
            <h1>{t('weStay')}</h1>
            <h1 className="header-span">{t('disposal')}</h1>
        </div>

        <div className="home-counter-container">
            <div className="years-container">
                <p>{t('since')}</p>
                <h1>{Math.round(years)}</h1>
                <p>{t('years')}</p>
            </div>
            <Divider  className='divider-vertical' orientation="vertical" flexItem sx={{backgroundColor: 'white', width: '2px'}}/>
            <Divider  className='divider-horizontal' orientation="horizontal" flexItem sx={{backgroundColor: 'white', width: 'full', margin: '1rem 0rem 1rem 0rem'}}/>
            <div className="translations-container">
                <p>{t('moreThan')}</p>
                    <h1>{Math.round(translations)}</h1>
                <p>{t('trans')}</p>
            </div>
            <Divider className='divider-vertical' orientation="vertical" flexItem sx={{backgroundColor: 'white', width: '2px'}}/>
            <Divider className='divider-horizontal' orientation="horizontal" flexItem sx={{backgroundColor: 'white', width: 'full', margin: '1rem 0rem 1rem 0rem'}}/>
            <div className="languages-container">
                <p>{t('moreThan')}</p>
                    <h1>{Math.round(languages)}</h1>
                <p>{t('clients')}</p>
            </div>
        </div>

        <Divider orientation="horizontal" flexItem sx={{backgroundColor: 'lightgray', width: '100%', height: '2px', margin: 'auto', marginTop: '4rem', marginBottom: '-2rem'}}/>

        <div className="home-header">
            <div className="home-header-text">
                <h1>{t('weAre')}</h1>
                <h1 className="header-span">{t('reliable')}.</h1>
                <div className="home-header-content">
                    <p className="reliable-item-left"><img src={tick} alt="" style={{width: '35px'}}/>{t('certified')}</p>
                    <p className="reliable-item"><img src={tick} alt="" style={{width: '35px'}}/>{t('swornTranslators')}</p>
                    <p className="reliable-item-left"><img src={tick} alt="" style={{width: '35px'}}/>{t('orderTime')}</p>
                    <p className="reliable-item"><img src={tick} alt="" style={{width: '35px'}}/>{t('fairPrices')}</p>
                </div>
                <button className="home-header-btn hover-btn" onClick={() => navigate('/about-us')}>{t('learnMore')}<FaInfo/></button>
            </div>
            <img src={smartphoneIcon} alt="" />
        </div>

        <Divider orientation="horizontal" flexItem sx={{backgroundColor: 'lightgray', width: '100%', height: '2px', margin: 'auto', marginTop: '3rem', marginBottom: '3rem'}}/>

        <div className="reviews-header" style={{flexDirection: 'row', gap: '0.5rem'}}>
            <h1>{t('our')}</h1>
            <h1 className="header-span">{t('reviews')}</h1>
        </div>

        <div className="slider-container">
            <CustomSlider>
                { translatedReviews.map((review, index) => (
                    <div className="review-container" key={index}>
                        <div className="review-header">
                            <img src={review.profile_photo_url} alt="" />
                            <h3>{review.author_name}</h3>
                            <Rating name="read-only" value={review.rating} readOnly />
                        </div>
                        <div className="review-text">
                            <p style={{fontSize: '14px'}}>{review?.text.length > 400 ? `${review.text.slice(0, 400)}...` : review.text}</p>
                        </div>
                    </div>
                ))}
            </CustomSlider>
        </div>

        <Divider orientation="horizontal" flexItem sx={{backgroundColor: 'lightgray', width: '100%', height: '2px', margin: 'auto', marginTop: '3rem', marginBottom: '3rem'}}/>

        <div className="reviews-header" style={{flexDirection: 'row', gap: '0.5rem'}}>
            <h1>{t('ourr')}</h1>
            <h1 className="header-span">{t('location')}</h1>
        </div>

        <div className="contacts-container">
            <p><IoLocationSharp className="contacts-icon"/> Sutthauser Str. 23, 49080 Osnabrück</p>
            <p><HiPhone className="contacts-icon"/> +49 179 5689980</p>
        </div>

        <div className="map-container">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4883.597447767886!2d8.048247212787198!3d52.26519995494562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b9e5859eaa8cdb%3A0x7060899a7a6ade65!2sOleg%20Rosenblum%20%C3%9Cbersetzungsb%C3%BCro!5e0!3m2!1sen!2sde!4v1710683696231!5m2!1sen!2sde" className="map" width="1200" height="500" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>


    </div>

    <Footer/>
    </>              
    )
}


export default Home