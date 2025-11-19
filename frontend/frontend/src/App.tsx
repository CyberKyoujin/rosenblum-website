import React from "react";
import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './screens/Home';
import { Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import Register from './screens/Register';
import useAuthStore from './zustand/useAuthStore';
import useOrderStore from './zustand/useOrderStore'
import Profile from './screens/Profile';
import Order from './screens/Order';
import OrderDetails from './screens/OrderDetails';
import EditProfile from './screens/EditProfile';
import AboutUs from './screens/AboutUs';
import Messages from './screens/Messages';
import ContactUs from './screens/ContactUs';
import Translations from "./screens/Translations";
import VerbalTranslations from "./screens/VerbalTranslations";
import Apostille from "./screens/Apostille";
import Languages from "./screens/Languages";
import Pricing from "./screens/Pricing";
import Areas from "./screens/Areas";
import Faq from "./screens/FAQ";
import ProtectedRoute from "./components/ProtectedRoute";
import EmailVerification from "./screens/EmailVerification";
import EmailVerificationSuccess from "./screens/EmailVerificationSuccess";
import useMessageStore from "./zustand/useMessageStore";
import AppSkeleton from "./components/AppSkeleton";

function App() {
  
  const updateToken = useAuthStore(s => s.updateToken);
  const initAuth = useAuthStore(s => s.initAuth);
  const isAuthLoading = useAuthStore(s => s.isAuthLoading);
  const fetchUserMessages = useMessageStore(s => s.fetchUserMessages);
  const fetchOrders = useOrderStore(s => s.fetchOrders);
  const createOrder =  useOrderStore(s => s.createOrder);

  useEffect(() => {

  const init = async () => {
    await initAuth();   
    await Promise.all([                       
        fetchUserMessages(),
        fetchOrders(),
    ]);
  };

  init();

  const refreshTokenInterval = setInterval(async () => {
    try {
      await updateToken();
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }, 240000);

  return () => clearInterval(refreshTokenInterval);

  }, [updateToken, fetchUserMessages, fetchOrders, initAuth, createOrder]);


   if (isAuthLoading) {
  
    return <AppSkeleton/>; 

  }

  return (
    <main>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/email-verification' element={<EmailVerification/>}/>
        <Route path='/verification-success' element={<EmailVerificationSuccess/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }/>
        <Route path='/order' element={<Order/>}/>
        <Route path="/order/:orderId" element={
          <ProtectedRoute>
            <OrderDetails/>
          </ProtectedRoute>
        }/>
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile/>
          </ProtectedRoute>
        }/>
        <Route path='/about-us' element={<AboutUs/>}/>
        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages/>
          </ProtectedRoute>
        }/>
        <Route path='/contact-us' element={<ContactUs/>}/>
        <Route path='/sworn-translations' element={<Translations/>}/>
        <Route path='/verbal-translations' element={<VerbalTranslations/>}/>
        <Route path="/apostille" element={<Apostille/>}/>
        <Route path="/languages" element={<Languages/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path="/areas" element={<Areas/>}/>
        <Route path="/faq" element={<Faq/>}/>
      </Routes>
    </main>
  );
}

export default App;