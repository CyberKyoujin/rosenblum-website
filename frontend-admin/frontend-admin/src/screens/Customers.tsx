
import { FaRegUser } from "react-icons/fa";
import useCustomersStore from "../zustand/useCustomers";
import Customer from "../components/Customer";
import { useIsAtTop } from "../hooks/useIsAtTop";
import CustomerFilter from "../components/CustomerFilter";
import DashboardSection from "../components/DashboardSection";
import ApiErrorAlert from "../components/ApiErrorAlert";

const Customers = () => {

    const customers = useCustomersStore(s => s.customers);
    const customersLoading = useCustomersStore(s => s.loading);
    const customersError = useCustomersStore(s => s.error);
    const fetchCustomers = useCustomersStore(s => s.fetchCustomers);
    const setCustomersFilters = useCustomersStore(s => s.setFilters);

    const isAtTop = useIsAtTop(5);

    return (

        <div className="main-container">

            <ApiErrorAlert error={customersError} belowNavbar={isAtTop} fixed/>

            <div className="dashboard-container">

                <DashboardSection data={customers} title="Kunden" Icon={FaRegUser} fetchData={fetchCustomers} ItemComponent={Customer} loading={customersLoading} error={customersError} setFilters={setCustomersFilters} Filter={CustomerFilter}/>

            </div>

        </div>
    );
};

export default Customers;