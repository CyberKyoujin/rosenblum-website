import React from "react";
import planetIcon from '../assets/planet_icon.webp'
import { useTranslation } from "react-i18next";
import Divider from '@mui/material/Divider';
import { useState, useEffect } from "react";
import { CustomSlider } from "../components/Slider";
import Rating from '@mui/material/Rating';
import Footer from "../components/Footer";
import { MdLocalOffer, MdVerified, MdLocalShipping } from "react-icons/md";
import { IoLocationSharp, IoDocuments } from "react-icons/io5";
import { HiPhone, HiEye } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useReviews } from "../hooks/useReviews";
import ReviewsSliderSkeleton from "../components/ReviewsSliderSkeleton";
import defaultAvatar from "../assets/default_avatar.webp"
import ApiErrorAlert from "../components/ApiErrorAlert";
import ApiErrorView from "../components/ApiErrorView";
import { useIsAtTop } from "../hooks/useIsAtTop";
import deFlag from "../assets/de.svg"
import stepArrow from "../assets/stepArrow1.png"
import { FaCcVisa } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { FaCcApplePay } from "react-icons/fa";
import { FaGooglePay } from "react-icons/fa";
import endArrow from "../assets/endArrow.webp"


const Home = () => {

  const { t } = useTranslation();

  const [years, setYears] = useState<number>(0);
  const [translations, setTranslations] = useState<number>(0);
  const [languages, setLanguages] = useState<number>(0);

  const isAtTop = useIsAtTop(10);

  const { reviews, reviewsLoading, reviewsError } = useReviews();

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

  const handleImageError = (e: any) => {
      e.target.src = defaultAvatar; 
      console.error("Failed to load user image from URL:", e.target.src);
  }; 

  useEffect(() => {

    animateCounter(0, 8, 3000, setYears); 
    animateCounter(0, 10000, 3000, setTranslations); 
    animateCounter(0, 5000, 3000, setLanguages);

  }, []);

  return(
    <>

    <div className="main-app-container">

    <ApiErrorAlert error={reviewsError} belowNavbar={isAtTop} fixed={true} />

    <div className="home-container">

        <div className="home-header">
        <img src={planetIcon} alt="" fetchPriority="high"/>
            <div className="home-header-text">
                
                <h1 data-testid="we-translate">{t('weTranslate')}</h1>
                <h1 className="header-span">{t('professional')}.</h1>

                <div className="home-badge">
                    <span className="home-badge-flag"><img src={deFlag} alt="" className="badge-icon"/></span>
                    <span>{t('germanyWideBadge')}</span>
                </div>
                
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

        <Divider orientation="horizontal" flexItem sx={{backgroundColor: 'lightgray', width: '100%', height: '2px', margin: 'auto', marginTop: '4rem', marginBottom: '3rem'}}/>

        <div className="reviews-header">
            <h1>{t('weAre')}</h1>
            <h1 className="header-span">{t('reliable')}.</h1>
        </div>

        <div className="home-features-grid">
            <div className="home-feature-card">
                <MdVerified className="feature-card-icon" />
                <h3 className="feature-card-title">{t('featureCard1Title')}</h3>
                <p className="feature-card-text">{t('featureCard1Text')}</p>
                <p className="feature-card-details">{t('featureCard1Details')}</p>
            </div>
            <div className="home-feature-card">
                <IoDocuments className="feature-card-icon" />
                <h3 className="feature-card-title">{t('featureCard2Title')}</h3>
                <p className="feature-card-text">{t('featureCard2Text')}</p>
                <p className="feature-card-details">{t('featureCard2Details')}</p>
            </div>
            <div className="home-feature-card">
                <MdLocalShipping className="feature-card-icon" />
                <h3 className="feature-card-title">{t('featureCard3Title')}</h3>
                <p className="feature-card-text">{t('featureCard3Text')}</p>
                <p className="feature-card-details">{t('featureCard3Details')}</p>
            </div>
            <div className="home-feature-card">
                <HiEye className="feature-card-icon" />
                <h3 className="feature-card-title">{t('featureCard4Title')}</h3>
                <p className="feature-card-text">{t('featureCard4Text')}</p>
                <p className="feature-card-details">{t('featureCard4Details')}</p>
            </div>
        </div>

        <div className="trust-badges-section">
            <p className="trust-badges-title">{t('trustBadgesTitle')}</p>
            <div className="trust-badges-container">
                <div className="trust-badge">
                    <span className="trust-badge-text">Jobcenter</span>
                </div>
                <div className="trust-badge">
                    <span className="trust-badge-text">Agentur für Arbeit</span>
                </div>
                <div className="trust-badge">
                    <span className="trust-badge-text">BAMF</span>
                </div>
                <div className="trust-badge">
                    <span className="trust-badge-text">Standesamt</span>
                </div>
                <div className="trust-badge">
                    <span className="trust-badge-text">Uni-Assist</span>
                </div>
                <div className="trust-badge">
                    <span className="trust-badge-text">Ausländerbehörde</span>
                </div>
            </div>
        </div>

        <Divider orientation="horizontal" flexItem sx={{backgroundColor: 'lightgray', width: '100%', height: '2px', margin: 'auto', marginTop: '3rem', marginBottom: '3rem'}}/>


        <div className="action-steps-container">

            <div className="action-steps-content">

                <div className="action-steps-title">
                    <h1>{t('thisWay')}</h1>
                    <h1 className="header-span">{t('itWorks')}</h1>
                </div>

                <div className="action-steps-items">
                    
                    {/* ШАГ 1 */}
                    <div className="action-steps-item">
                        <h4>{t('how_it_works.step1.title')}</h4>
                        <p>{t('how_it_works.step1.text')}</p>
                        <Link className="action-link-btn" to="/pricing">
                            {t('how_it_works.step1.btn')}
                        </Link>
                    </div>

                    <img src={stepArrow} alt="" className="step-arrow"/>

                    {/* ШАГ 2 */}
                    <div className="action-steps-item">
                        <h4>{t('how_it_works.step2.title')}</h4>
                        <p>
                            {t('how_it_works.step2.text_part1')}
                            <span className="action-span">{t('how_it_works.step2.span_pay_now')}</span>
                            {t('how_it_works.step2.text_part2')}
                            <span className="action-span">{t('how_it_works.step2.span_quote')}</span>
                            {t('how_it_works.step2.text_part3')}
                        </p>
                        <Link className="action-link-btn" to="/order">
                            {t('how_it_works.step2.btn')}
                        </Link>
                    </div>

                    <img src={stepArrow} alt="" className="step-arrow"/>

                    {/* ШАГ 3 */}
                    <div className="action-steps-item">
                        <h4>{t('how_it_works.step3.title')}</h4>
                        <ul className="action-steps-list">
                            <li>
                                {t('how_it_works.step3.std_part1')}
                                <span className="action-span">{t('how_it_works.step3.span_stripe')}</span>
                                {t('how_it_works.step3.std_part2')}
                                <span className="action-span">{t('how_it_works.step3.span_rechnung')}</span>
                                {t('how_it_works.step3.std_part3')}
                            </li>
                            <li>{t('how_it_works.step3.individual')}</li>
                        </ul>

                        <div className="action-pay-badge">
                            <FaCcVisa size={40} className="app-icon" />
                            <FaCcMastercard size={40} className="app-icon" />
                            <FaGooglePay size={40} className="app-icon" />
                            <FaCcApplePay size={40} className="app-icon" />
                        </div>
                    </div>

                    <img src={endArrow} alt="" className="end-arrow"/>

                    {/* ШАГ 4 */}
                    <div className="action-steps-item">
                        <h4>{t('how_it_works.step4.title')}</h4>
                        <p>{t('how_it_works.step4.text')}</p>
                    </div>

                </div>

            </div>
            



        </div>

        <Divider orientation="horizontal" flexItem sx={{backgroundColor: 'lightgray', width: '100%', height: '2px', margin: 'auto', marginTop: '3rem', marginBottom: '3rem'}}/>

        <div className="reviews-header" style={{flexDirection: 'row', gap: '0.5rem'}}>
            <h1>{t('our')}</h1>
            <h1 className="header-span">{t('reviews')}</h1>
        </div>

        <div className="slider-container">
            {reviewsLoading ?
            (
                <ReviewsSliderSkeleton/>

            ) : reviewsError ? (
                <>
                    <ApiErrorView message={"Es ist ein technisches Fehler aufgetreten. Versuchen Sie es bitte später."}/>
                </>

            ):
            
            (
            
            <CustomSlider>
                { reviews.map((review, index) => (
                    <div className="review-container" key={index}>
                        <div className="review-header">
                            <img src={review.profile_photo_url} alt="" loading="lazy" onError={handleImageError}/>
                            <h3>{review.author_name}</h3>
                            <Rating name="read-only" value={review.rating} readOnly />
                        </div>
                        <div className="review-text">
                            <p style={{fontSize: '14px'}}>{review?.text.length > 400 ? `${review.text.slice(0, 400)}...` : review.text}</p>
                        </div>
                    </div>
                ))}
            </CustomSlider>
            ) 
            }   
            
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
           
    </div>
<Footer/> 
    
    </>              
    )
}


export default Home