import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../zustand/axiosInstance";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";
import { Divider } from "@mui/material";
import { SiGooglemessages } from "react-icons/si";
import { TbMessageMinus } from "react-icons/tb";
import Order from "../components/Order";
import { FaInfoCircle } from "react-icons/fa";
import useMainStore from "../zustand/useMainStore";
import CircularProgress from '@mui/material/CircularProgress';


interface Order{
    id: number;
    name: string;
    formatted_timestamp: string;
    status: string;
    new: boolean;
}


const UserDetails = () => {

    const { userId } = useParams();

    const [userOrders, setUserOrders] = useState<Order[] | null>(null);

    const { fetchUserData, userData, isLoading } = useMainStore();

    useEffect(() => {

        const fetchUserOrders = async () => {
            try{
                const response = await axiosInstance.get(`/admin-user/user/${userId}/orders`);
                if (response.status === 200){
                    setUserOrders(response.data);
                }
            } catch (err) {
                console.error("Error fetching user orders: " + err);
            }

        }
        fetchUserOrders();
        fetchUserData(userId);
    }, [])

    const navigate = useNavigate();

    console.log(userData)

    return(
        <div className="main-container">
            {isLoading ? (

                <div className="spinner-container">
                    <CircularProgress style={{width: 50, height: 50, marginTop: "10rem"}}/>
                </div>

            ) : (
                <>
                    <div className="user-data-container">
                    <div className="user-data-header">
                        <img src={userData?.profile_img || userData?.profile_img_url} alt="" className="user-avatar"/>
                        <div className="user-header-text">
                            <h2>{userData?.first_name} {userData?.last_name}</h2>
                            <p>Mitglied seit {userData?.date_joined.slice(0, 10)}</p>
                        </div>
                        <div style={{width: '100%'}}>
                            <button className="user-message-btn" onClick={() => navigate(`/user/${userId}/messages`)}><TbMessageMinus style={{fontSize: '30px'}}/> {userData?.first_name}</button>
                        </div>
                    </div>  
                    <Divider className='divider-vertical' orientation="vertical" sx={{height: '340px', width: '2px', background: 'rgb(76, 121, 212)', margin: 0}}/>
                    <Divider className="divider-horizontal" orientation="horizontal" sx={{background: 'rgb(76, 121, 212)', margin: 0}}/>
                    <div className="user-data-center">
                        <div className="user-data-item">
                            <FaInfoCircle className="user-icon"/>
                            <h3>Kontaktinformationen</h3>
                        </div>
                        <div className="user-data-item">
                            <MdEmail className="user-icon"/>
                            <p>{userData?.email}</p>
                        </div>
                        <div className="user-data-item">
                            <FaPhone className="user-icon"/>
                            <p>{userData?.phone_number || 'nicht angegeben'}</p>
                        </div>
                        <div className="user-data-item">
                            <MdLocationPin className="user-icon"/>
                            <p>{userData?.street ? `${userData?.street}, ${userData?.zip} ${userData?.city}` : 'nicht angegeben'}</p>
                        </div>
                    </div>
                </div>

                <div className="user-orders-title">
                    <h1>Aufträge</h1>
                </div>

                <div className="dashboard-orders-container">
                    {userOrders?.map(order => <Order id={order.id} name={order.name} timestamp={order.formatted_timestamp} status={order.status} is_new={order.new}/>)}
                </div>
            </>
            )}
        </div>
    )
}


export default UserDetails