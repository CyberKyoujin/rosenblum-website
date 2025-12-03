import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './screens/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Dashboard from './screens/Dashboard'
import useAuthStore from './zustand/useAuthStore'
import ProtectedRoute from './components/ProtectedRoute'
import OrderDetails from './screens/OrderDetails'
import UserDetails from './screens/UserDetails'
import LoginProtectedRoute from './components/LoginProtectedRoute'
import Messages from './screens/Messages'
import Customers from './screens/Customers'
import SearchResults from './screens/SearchResults'
import GlobalMessages from './screens/GlobalMessages'
import Translator from './screens/Translator'
import useMainStore from './zustand/useMainStore'


function App() {
  
  const authStore = useAuthStore();

  const fetchOrders = useMainStore(s => s.fetchOrders);
  const fetchRequests = useMainStore(s => s.fetchRequests);

  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      try {
        await authStore.refreshToken();
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }, 240000); 

    fetchOrders(1);
    fetchRequests(1);

    return () => clearInterval(refreshTokenInterval);
  }, [authStore, fetchOrders, fetchRequests]);

  console.log(authStore.isAuthenticated, authStore.user);

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={
          <LoginProtectedRoute>
            <Home/>
          </LoginProtectedRoute>
        }/>
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>
        <Route path='/order/:orderId' element={
          <ProtectedRoute>
            <OrderDetails/>
          </ProtectedRoute>
        }/>
        <Route path='/user/:userId' element={
          <ProtectedRoute>
            <UserDetails/>
          </ProtectedRoute>
        }/>
        <Route path='/messages' element={
          <ProtectedRoute>
            <GlobalMessages/>
          </ProtectedRoute>
        }/>
        <Route path='/user/:userId/messages' element={
          <ProtectedRoute>
            <Messages/>
          </ProtectedRoute>
        }/>
        <Route path='/customers' element={
          <ProtectedRoute>
            <Customers/>
          </ProtectedRoute>
        }/>
        <Route path='/search' element={
          <ProtectedRoute>
            <SearchResults/>
          </ProtectedRoute>
        }/>
        <Route path='/translator' element={
          <ProtectedRoute>
            <Translator/>
          </ProtectedRoute>
        }/>

      </Routes>
    </>
  )
}

export default App
