import Footer from "../components/Footer";
import CustomerProfileSection from "../components/CustomerProfileSection";
import ApiErrorAlert from '../components/ApiErrorAlert';
import ErrorView from "../components/ErrorView";
import { useIsAtTop } from '../hooks/useIsAtTop';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CustomerProfileSkeleton from "../components/CustomerProfileSkeleton";
import useCustomersStore from "../zustand/useCustomers";
import CustomerOrdersSection from "../components/CustomerOrdersSection";

const CustomerProfile = () => {

    const { userId } = useParams();


    const loading = useCustomersStore(s => s.loading);
    const error = useCustomersStore(s => s.error);

    const fetchCustomerData = useCustomersStore(s => s.fetchCustomerData);
    const fetchCustomerOrders = useCustomersStore(s => s.fetchCustomerOrders);

    const isAtTop = useIsAtTop(10);
    
    useEffect(() => {
        if (userId) {
            fetchCustomerData(Number(userId));
            fetchCustomerOrders(Number(userId)); 
        }
    }, [userId, fetchCustomerData, fetchCustomerOrders]);
   

    if (loading) {
        return <CustomerProfileSkeleton/>
    }
    

    return (
        <>
        {error && <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed={true}/>}

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