import React from "react";
import { FaMoneyBillWave } from "react-icons/fa6";


const Pricing = () => {
    return (
        <div>

            <div className="main-pricing-container">

                <div className="pricing-container">

                    <div className="pricing-title">
                        <FaMoneyBillWave style={{fontSize: '35px', color: "RGB(76 121 212)", marginRight: '0.5rem'}}/>
                        <h1>Unsere</h1>
                        <h1 className="header-span">Preise</h1>
                    </div>

                    <div className="pricing-item">
                        <div className="pricing-card-header">
                            <h1>35,30€</h1>
                            <p>/Dokument</p>
                        </div>
                        <div className="pricing-card-description">
                            <p>Some text.</p>
                        </div>
                        <div className="pricing-card-list">
                            <p>Geburtsurkunden</p>
                            <p>Heiratsurkunden</p>
                            <p>Führungszeugnisse</p>
                        </div>
                    </div>

                    <div className="pricing-item">
                        <div className="pricing-card-header">
                            <h1>1,40€</h1>
                            <p>/Dokument</p>
                        </div>
                        <div className="pricing-card-description">
                            <p>Some text.</p>
                        </div>
                        <div className="pricing-card-list">
                            <p>Geburtsurkunden</p>
                            <p>Heiratsurkunden</p>
                            <p>Führungszeugnisse</p>
                        </div>
                    </div>

                    <div className="pricing-item">
                        <div className="pricing-card-header">
                            <h1>Auf Anfrage</h1>
                        </div>
                        <div className="pricing-card-description">
                            <p>Some text.</p>
                        </div>
                        <div className="pricing-card-list">
                            <p>Geburtsurkunden</p>
                            <p>Heiratsurkunden</p>
                            <p>Führungszeugnisse</p>
                        </div>
                    </div>

                </div>


            </div>
            
        </div>
    )
}


export default Pricing;


