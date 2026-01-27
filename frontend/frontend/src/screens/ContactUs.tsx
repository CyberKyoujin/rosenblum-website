import React, { useState } from "react";
import Footer from "../components/Footer";
import { CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import sutthausen1 from "../assets/sutthausen1.webp"
import useMessageStore from "../zustand/useMessageStore";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { ApiErrorResponse } from "../types/error";
import NavigationSection from "../components/NavigationSection";
import {
    IoLocationOutline,
    IoCallOutline,
    IoMailOutline,
    IoTimeOutline,
    IoSendOutline,
    IoPersonOutline,
    IoChatbubbleOutline,
    IoInformationCircleOutline
} from "react-icons/io5";

const ContactUs = () => {
    const { t } = useTranslation();

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [number, setNumber] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const [requestError, setRequestError] = useState<ApiErrorResponse | null>(null);

    const sendRequest = useMessageStore((s) => s.sendRequest);
    const sendRequestSuccess = useMessageStore((s) => s.sendRequestSuccess);
    const requestLoading = useMessageStore((s) => s.requestLoading);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRequestError(null);
        try {
            await sendRequest(name, email, number, message);
            setName('');
            setEmail('');
            setNumber('');
            setMessage('');
        } catch(err: unknown) {
            setRequestError(err as ApiErrorResponse);
        }
    }

    const workingHours = [
        { day: t('contactPage.monday'), hours: '9:00 - 12:00' },
        { day: t('contactPage.tuesday'), hours: '15:00 - 18:00' },
        { day: t('contactPage.wednesday'), hours: '15:00 - 18:00' },
        { day: t('contactPage.thursday'), hours: '9:00 - 12:00' },
        { day: t('contactPage.friday'), hours: '9:00 - 12:00' },
    ];

    return (
        <>
            <div className="main-app-container">
                <NavigationSection first_link="Kontakt"/>

                <div className="cu">
                    {/* Page Header */}
                    <div className="cu__header">
                        <h1 className="cu__title">
                            {t('contactPage.title')} <span className="header-span">{t('contactPage.titleHighlight')}</span>
                        </h1>
                        <p className="cu__subtitle">{t('contactPage.subtitle')}</p>
                    </div>

                    {/* Info Cards Grid */}
                    <div className="cu__cards-grid">
                        {/* Contact Info Card */}
                        <div className="cu__card">
                            <h3 className="cu__card-title">
                                <IoInformationCircleOutline className="cu__title-icon" />
                                {t('contactInformation')}
                            </h3>
                            <div className="cu__info-list">

                                <div className="cu__info-item">
                                    <div className="cu__info-icon">
                                        <IoPersonOutline />
                                    </div>
                                    <div className="cu__info-content">
                                        <span className="cu__info-label">{t('contactPage.responsiblePerson')}</span>
                                        <span className="cu__info-value">Oleg Rosenblum,  beeidigter Dolmetscher und ermächtigter Übersetzer vom Landgericht Hannover</span>
                                    </div>
                                </div>
                                
                                <div className="cu__info-item">
                                    <div className="cu__info-icon">
                                        <IoLocationOutline />
                                    </div>
                                    <div className="cu__info-content">
                                        <span className="cu__info-label">{t('contactPage.address')}</span>
                                        <span className="cu__info-value">Altepoststraße 25, 49074 Osnabrück</span>
                                    </div>
                                </div>
                                <div className="cu__info-item">
                                    <div className="cu__info-icon">
                                        <IoCallOutline />
                                    </div>
                                    <div className="cu__info-content">
                                        <span className="cu__info-label">{t('contactPage.phone')}</span>
                                        <a href="tel:+4917677353978" className="cu__info-value cu__info-value--link">+49 176 77353978</a>
                                    </div>
                                </div>
                                <div className="cu__info-item">
                                    <div className="cu__info-icon">
                                        <IoMailOutline />
                                    </div>
                                    <div className="cu__info-content">
                                        <span className="cu__info-label">{t('contactPage.email')}</span>
                                        <a href="mailto:olegrosenblum@freenet.de" className="cu__info-value cu__info-value--link">olegrosenblum@freenet.de</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Working Hours Card */}
                        <div className="cu__card">
                            <h3 className="cu__card-title">
                                <IoTimeOutline className="cu__title-icon" />
                                {t('contactPage.workingHours')}
                            </h3>
                            <div className="cu__hours-list">
                                {workingHours.map((item, index) => (
                                    <div key={index} className="cu__hours-item">
                                        <span className="cu__hours-day">{item.day}</span>
                                        <span className="cu__hours-time">{item.hours}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="cu__hours-note">{t('contactPage.appointmentNote')}</p>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="cu__map-section">
                        <div className="cu__map-image">
                            <img src={sutthausen1} alt="Office location" loading="lazy"/>
                        </div>
                        <div className="cu__map-embed">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4883.597447767886!2d8.048247212787198!3d52.26519995494562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b9e5859eaa8cdb%3A0x7060899a7a6ade65!2sOleg%20Rosenblum%20%C3%9Cbersetzungsb%C3%BCro!5e0!3m2!1sen!2sde!4v1710683696231!5m2!1sen!2sde"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Office location map"
                            />
                        </div>
                    </div>

                    {/* Contact Form Card */}
                    <div className="cu__card cu__card--form">
                        <h3 className="cu__card-title">
                            <IoChatbubbleOutline className="cu__title-icon" />
                            {t('contactPage.formTitle')}
                        </h3>
                        <p className="cu__form-subtitle">{t('contactPage.formSubtitle')}</p>

                        <ApiErrorAlert
                            error={requestError}
                            successMessage={sendRequestSuccess ? t('contactPage.successMessage') : null}
                            belowNavbar={false}
                        />

                        <form className="cu__form" onSubmit={handleSubmit}>
                            <div className="cu__form-row">
                                <div className="cu__form-group">
                                    <label className="cu__form-label">
                                        <IoPersonOutline />
                                        {t('name')}
                                    </label>
                                    <input
                                        type="text"
                                        className="cu__form-input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t('contactPage.namePlaceholder')}
                                        required
                                    />
                                </div>
                                <div className="cu__form-group">
                                    <label className="cu__form-label">
                                        <IoMailOutline />
                                        {t('email')}
                                    </label>
                                    <input
                                        type="email"
                                        className="cu__form-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t('contactPage.emailPlaceholder')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="cu__form-group">
                                <label className="cu__form-label">
                                    <IoCallOutline />
                                    {t('phoneNumber')}
                                </label>
                                <input
                                    type="tel"
                                    className="cu__form-input"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    placeholder={t('contactPage.phonePlaceholder')}
                                    required
                                />
                                <span className="cu__form-hint">{t('onlyGerman')}</span>
                            </div>

                            <div className="cu__form-group">
                                <label className="cu__form-label">
                                    <IoChatbubbleOutline />
                                    {t('yourMessage')}
                                </label>
                                <textarea
                                    className="cu__form-textarea"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={t('contactPage.messagePlaceholder')}
                                    rows={6}
                                    required
                                />
                            </div>

                            <button className="cu__submit-btn" type="submit" disabled={requestLoading}>
                                {requestLoading ? (
                                    <CircularProgress size={24} style={{color: "white"}}/>
                                ) : (
                                    <>
                                        <IoSendOutline />
                                        {t('send')}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}


export default ContactUs