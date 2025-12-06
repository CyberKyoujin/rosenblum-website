
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { FaRegUser } from "react-icons/fa";
import { FiUserX } from "react-icons/fi";
import useCustomersStore from "../zustand/useCustomers";
import Customer from "../components/Customer";
import { useIsAtTop } from "../hooks/useIsAtTop";
import CustomerFilter from "../components/CustomerFilter";
import DashboardSection from "../components/DashboardSection";

const Customers = () => {

    const customers = useCustomersStore(s => s.customers);
    const customersLoading = useCustomersStore(s => s.loading);
    const customersError = useCustomersStore(s => s.error);
    const fetchCustomers = useCustomersStore(s => s.fetchCustomers);
    const setCustomersFilters = useCustomersStore(s => s.setFilters);

    const isAtTop = useIsAtTop(5);

    return (

        <div className="main-container">

            <div className="dashboard-container">

                <DashboardSection data={customers} title="Kunden" Icon={FaRegUser} fetchData={fetchCustomers} ItemComponent={Customer} loading={customersLoading} error={customersError} setFilters={setCustomersFilters} Filter={CustomerFilter}/>

            </div>

        </div>
    );
};

export default Customers;