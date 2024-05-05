import React from "react";
import { Divider } from "@mui/material";
import { IoGlobeSharp } from "react-icons/io5";
import connect from '../assets/connect.jpg'
import team from "../assets/team.png"
import mission from "../assets/mission.png"
import Footer from "../components/Footer";
import quality from "../assets/quality.png"
import { GrContactInfo } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';


const AboutUs = () => {


    const navigate = useNavigate();

    return(
        <>
        <div style={{padding: '1rem 2rem'}}>

            <div role="presentation" className="profile-navigation">
                <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">Home</Link>
                <Typography color="text.primary">Über uns</Typography>
                </Breadcrumbs>
            </div>

            <div className="about-main-container">
                

                <div className="about-container">
                    <img src={connect} alt="" />
                    <div className="about-text">
                        <div className="about-header">
                            <h1>Über</h1>
                            <h1 className="header-span">uns</h1>
                        </div>
                        <p>Willkommen bei Rosenblum Übersetzungsbüro, Ihrem vertrauenswürdigen Partner für professionelle Sprachdienstleistungen. Seit unserer Gründung im Jahr 2016 haben wir es uns zur Aufgabe gemacht, die Kommunikationsbarrieren zwischen unterschiedlichen Kulturen und Sprachen zu überwinden.</p>
                    </div>
                </div>

                <Divider style={{marginTop: '3rem', marginBottom: '2rem'}}/>

                <div className="about-container about-container-gap">
                    <div className="about-text">
                        <div className="about-header">
                            <h1>Unser</h1>
                            <h1 className="header-span">Team</h1>
                        </div>
                        <p>Unser Team besteht aus erfahrenen und qualifizierten Übersetzern und Dolmetschern, die sich durch ihre Leidenschaft für Sprachen und interkulturelle Kommunikation auszeichnen. Alle unsere Fachkräfte sind muttersprachlich und verfügen über branchenspezifische Kenntnisse, um die Genauigkeit und Relevanz jeder Übersetzung zu gewährleisten.</p>
                    </div>
                    <img src={team} alt=""/>
                </div>

                <Divider style={{marginTop: '3rem', marginBottom: '2rem'}}/>

                <div className="about-container about-container-gap">
                    <img src={mission} alt=""/>
                    <div className="about-text">
                        <div className="about-header">
                            <h1>Unsere</h1>
                            <h1 className="header-span">Mission</h1>
                        </div>
                        <p>Unsere Mission ist es, Ihnen präzise und kulturell angepasste Übersetzungen zu bieten, die Ihre Botschaft weltweit verständlich und wirkungsvoll übermitteln. Wir verstehen, dass jede Übersetzung einzigartig ist, und setzen unser Fachwissen ein, um Lösungen zu bieten, die genau auf Ihre Bedürfnisse zugeschnitten sind.</p>
                    </div>
                </div>

                <Divider style={{marginTop: '3rem', marginBottom: '3rem'}}/>

                <div className="about-container about-container-gap">
                    <div className="about-text">
                        <div className="about-header">
                            <h1>Warum</h1>
                            <h1 className="header-span">Rosenblum?</h1>
                        </div>
                        <p>Bei Rosenblum Übersetzungsbüro stehen Qualität und Kundenzufriedenheit an erster Stelle. Wir nutzen modernste Technologien und Arbeitsmethoden, um die Effizienz unserer Prozesse zu steigern und Ihnen schnelle Turnaround-Zeiten zu bieten. Unsere strengen Qualitätskontrollverfahren stellen sicher, dass jedes Projekt unseren hohen Standards entspricht.</p>
                    </div>
                    <img src={quality} alt=""/>
                </div>

                <button className="contact-us-btn hover-btn" onClick={() => navigate('/contact-us')}><GrContactInfo style={{fontSize: '35px'}}/>KONTAKTIEREN SIE UNS</button>

       
            </div>
        </div>
        <Footer/>
        </>
    )
}


export default AboutUs