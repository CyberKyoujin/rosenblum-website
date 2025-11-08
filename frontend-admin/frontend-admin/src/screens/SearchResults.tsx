import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../zustand/axiosInstance";
import { IoSearch } from "react-icons/io5";
import Divider from '@mui/material/Divider';
import Customer from "../components/Customer";
import { FiUserX } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { CiBoxList } from "react-icons/ci";
import Order from "../components/Order";
import Footer from "../components/Footer";
import { LuListX } from "react-icons/lu";

interface Customer{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_img_url: string;
    profile_img: string;
    orders: string;
}

interface File {
    id: string;
    file: string;
}

interface Order {
    id: number;
    name: string;
    files: File[];
    formatted_timestamp: string;
    email: string;
    status: string;
    new: boolean;
}


const SearchResults = () => {
    const [query, setQuery] = useState<string>("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    const location = useLocation();

    const fetchSearchResults = async (query: string) => {
        if (query.length > 0){
            try{
                const response = await axiosInstance.post("/admin-user/search/", {query: query}); 
                setCustomers(response.data.customers);
                setOrders(response.data.orders);
            } catch (error) {
                console.error(error); 
            }
        }
    }

    useEffect(() => {
        const searchQuery = location.state?.message;
        if (searchQuery) {
            setQuery(searchQuery);  
        }
        fetchSearchResults(query);
    }, [location]);

    return (
        <>
        <div className="main-container">

            <div className="dashboard-title-orders">
                <IoSearch style={{fontSize: '40px', color: 'RGB(76 121 212)'}}/>
                <h1 style={{marginTop: '0.1rem'}}>Suchergebnisse - {query}</h1>
            </div>

            <Divider style={{marginTop: '1.5rem'}}/>

            <div className="customers-container">

                <div className="dashboard-title-orders">
                    <FaRegUser style={{fontSize: '40px', color: 'RGB(76 121 212)'}}/>
                    <h1 style={{marginTop: '0.1rem'}}>Kunden</h1>
                </div>

                {customers.length > 0 ? (

                    customers.map((customer) => (
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

            <Divider style={{marginTop: '2.5rem'}}/>

            <div className="customers-container">

                <div className="dashboard-title-orders">
                    <CiBoxList style={{fontSize: '40px', color: 'RGB(76 121 212)'}}/>
                    <h1 style={{marginTop: '0.1rem'}}>Aufträge</h1>
                </div>

                {orders.length > 0 ? (
                
                orders?.map(order => <Order id={order.id} name={order.name} timestamp={order.formatted_timestamp} status={order.status} is_new={order.new }/>)

                ) : (

                    <div className="no-customers">
                        <LuListX style={{fontSize: '70px', color: "rgb(76,121,212)"}}/>
                        <p>Keine Aufträge gefunden.</p> 
                    </div> 

                )}

                

            </div>

        </div>
        <Footer/>
        </>
    );
};


export default SearchResults