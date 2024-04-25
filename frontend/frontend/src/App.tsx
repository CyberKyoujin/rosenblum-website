import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './screens/Home'
import { Routes, Route } from 'react-router-dom'
import Login from './screens/Login'
import Register from './screens/Register'
import useAuthStore from './zustand/useAuthStore'
import Profile from './screens/Profile'
import Order from './screens/Order'
import OrderDetails from './screens/OrderDetails'
import OrderWait from './screens/OrderWait'
import EditProfile from './screens/EditProfile'
import AboutUs from './screens/AboutUs'
import Messages from './screens/Messages'
import ContactUs from './screens/ContactUs'

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


  return (
    <main>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/order' element={<Order/>}/>
        <Route path='/order/:orderId' element={<OrderDetails/>}/>
        <Route path='/send-order' element={<OrderWait/>}/>
        <Route path='/edit-profile' element={<EditProfile/>}/>
        <Route path='/about-us' element={<AboutUs/>}/>
        <Route path='/messages' element={<Messages/>}/>
        <Route path='/contact-us' element={<ContactUs/>}/>
      </Routes>
    </main>
  )
}

export default App
