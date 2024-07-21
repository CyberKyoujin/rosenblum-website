import React from "react";
import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './screens/Home';
import { Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import Register from './screens/Register';
import useAuthStore from './zustand/useAuthStore';
import Profile from './screens/Profile';
import Order from './screens/Order';
import OrderDetails from './screens/OrderDetails';
import OrderWait from './screens/OrderWait';
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

function App() {
  const authStore = useAuthStore();

  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      try {
        await authStore.updateToken();
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }, 240000); 

    return () => clearInterval(refreshTokenInterval);
  }, [authStore]);

  console.log(authStore.user?.profile_img_url);

  return (
    <main>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
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
        <Route path='/send-order' element={<OrderWait/>}/>
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