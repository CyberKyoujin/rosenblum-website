import Footer from "../components/Footer";
import CustomerProfileSection from "../components/CustomerProfileSection";
import ApiErrorAlert from '../components/ApiErrorAlert';
import ErrorView from "../components/ErrorView";
import { useIsAtTop } from '../hooks/useIsAtTop';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CustomerProfileSkeleton from "../components/CustomerProfileSkeleton";
import useCustomersStore from "../zustand/useCustomers";
import CustomerOrdersSection from "../components/CustomerOrdersSection";

const CustomerProfile = () => {


    const loading = useCustomersStore(s => s.loading);
    const error = useCustomersStore(s => s.error);

    const [showOrderSuccessAlert, setShowOrderSuccessAlert] = useState(false);
    const [showUpdateSuccessAlert, setShowUpdateSuccessAlert] = useState(false);

    const isAtTop = useIsAtTop(10);
    const location = useLocation();
    const navigate = useNavigate();
   

    if (loading) {
        return <CustomerProfileSkeleton/>
    }
    

    return (
        <>
        {error && <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed={true}/>}

        {showOrderSuccessAlert && <ApiErrorAlert successMessage={"Der Auftrag erfolgreich bearbeitet"} belowNavbar={isAtTop} fixed/>}

        {showUpdateSuccessAlert && <ApiErrorAlert successMessage={"Profil erfolgreich bearbeitet"} belowNavbar={isAtTop} fixed/>}


            <main className="main-container">

                <article className="profile__main-section">

                    {error ? (

                        <ErrorView/>

                    ) : (

                        <>
                            <CustomerProfileSection/>

                            <h1 className="profile__orders-title">Aufträge</h1>

                            <CustomerOrdersSection/>  
                        </>

                    )}
                    
                </article>

        
            </main>

        </>
    )
}

export default CustomerProfile;