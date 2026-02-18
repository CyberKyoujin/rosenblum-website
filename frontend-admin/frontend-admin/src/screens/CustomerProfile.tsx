import CustomerProfileSection from "../components/CustomerProfileSection";
import ApiErrorAlert from '../components/ApiErrorAlert';
import ErrorView from "../components/ErrorView";
import { useIsAtTop } from '../hooks/useIsAtTop';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import CustomerProfileSkeleton from "../components/CustomerProfileSkeleton";
import useCustomersStore from "../zustand/useCustomers";
import CustomerOrdersSection from "../components/CustomerOrdersSection";
import { IoChevronBack } from "react-icons/io5";

const CustomerProfile = () => {

    const { userId } = useParams();
    const navigate = useNavigate();

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
                <div className="od">

                    <button className="od__back-btn" type="button" onClick={() => navigate('/customers')}>
                        <IoChevronBack />
                        Zurück zu Kunden
                    </button>

                    {error ? (
                        <ErrorView/>
                    ) : (
                        <div className="od__body">
                            <CustomerProfileSection/>

                            <div className="od__card od__card--full">
                                <h3 className="od__card-title">Aufträge</h3>
                                <CustomerOrdersSection/>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </>
    );
};

export default CustomerProfile;
