
import Divider from '@mui/material/Divider';
import { FaRegUser } from "react-icons/fa";
import axiosInstance from "../zustand/axiosInstance";
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import { FiUserX } from "react-icons/fi";
import Customer from "../components/Customer";
import default_avatar from "../assets/default_avatar.png"

interface Customer{
    email: string;
    id: string;
    first_name: string;
    last_name: string;
    profile_img_url: string;
    profile_img: string;
    orders: string;
}

const Customers = () => {
    const [customerList, setCustomerList] = useState<Customer[]>([]);  
    const [filteredCustomerList, setFilteredCustomerList] = useState<Customer[]>([]);  
    const [searchQuery, setSearchQuery] = useState<string>('');  

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axiosInstance.get('/admin-user/customers');
                setCustomerList(response.data);
                setFilteredCustomerList(response.data);  
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
        console.log(customerList);
        fetchCustomers();
    }, []);

    const filterCustomers = (query: string) => {
        setSearchQuery(query);  
        if (query === '') {
            setFilteredCustomerList(customerList);  
        } else {
            const filtered = customerList.filter((customer) =>
                `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredCustomerList(filtered);
        }
    };

    return (
        <div className="main-container">
            <div className="customers-dashboard-title">
                <div className="dashboard-title-top">
                    <FaRegUser style={{ fontSize: '40px', color: 'RGB(76 121 212)' }} />
                    <h1 style={{ marginTop: '0.1rem' }}>Kunden</h1>
                </div>
                <TextField 
                    label="Suche..." 
                    value={searchQuery} 
                    onChange={(e) => filterCustomers(e.target.value)}  
                />
            </div>

            <Divider style={{ marginTop: '1.5rem' }} />

            <div className="customers-container">

                {filteredCustomerList.length > 0 ? (

                    filteredCustomerList.map((customer) => (
                        <Customer 
                        id={customer.id} 
                        first_name={customer.first_name} 
                        last_name={customer.last_name} 
                        email={customer.email} 
                        profile_img={customer.profile_img} 
                        profile_img_url={customer.profile_img_url} 
                        orders={customer.orders}/>
                    ))

                ) : (

                    <div className="no-customers">
                        <FiUserX style={{fontSize: '70px', color: "rgb(76,121,212)"}}/>
                        <p>Keine Kunden gefunden.</p> 
                    </div> 

                )}
            </div>
        </div>
    );
};

export default Customers;