import { useEffect, lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Navbar from './screens/Navbar'
import Home from './screens/Home'
import Dashboard from './screens/Dashboard'
import useAuthStore from './zustand/useAuthStore'
import AppLoader from './components/AppLoader'

const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const OrderDetails = lazy(() => import('./screens/OrderDetails'));
const Messages = lazy(() => import('./screens/Messages'));
const Customers = lazy(() => import('./screens/Customers'));
const GlobalMessages = lazy(() => import('./screens/GlobalMessages'));
const Translator = lazy(() => import('./screens/Translator'));
const CustomerProfile = lazy(() => import('./screens/CustomerProfile'));
const RequestDetails = lazy(() => import('./screens/RequestDetails'));
const TranslationDetails = lazy(() => import('./components/TranslationDetails'));
const Statistics = lazy(() => import('./screens/Statistics'));


function App() {
  
  const authStore = useAuthStore();

  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      try {
        await authStore.refreshToken();
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }, 240000); 


    return () => clearInterval(refreshTokenInterval);
  }, [authStore]);


  return (
    <>
      <Navbar />
      
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path='/' element={<Home />} />
          
          <Route path='/dashboard' element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          
          <Route path='/order/:orderId' element={
            <ProtectedRoute><OrderDetails /></ProtectedRoute>
          } />
          
          <Route path='/request/:requestId' element={
            <ProtectedRoute><RequestDetails /></ProtectedRoute>
          } />
          
          <Route path='/translation/:translationId' element={
            <ProtectedRoute><TranslationDetails /></ProtectedRoute>
          } />
          
          <Route path='/user/:userId' element={
            <ProtectedRoute><CustomerProfile /></ProtectedRoute>
          } />
          
          <Route path='/messages' element={
            <ProtectedRoute><GlobalMessages /></ProtectedRoute>
          } />
          
          <Route path='/user/:userId/messages' element={
            <ProtectedRoute><Messages /></ProtectedRoute>
          } />
          
          <Route path='/customers' element={
            <ProtectedRoute><Customers /></ProtectedRoute>
          } />
          
          <Route path='/translator' element={
            <ProtectedRoute><Translator /></ProtectedRoute>
          } />
          
          <Route path='/statistics' element={
            <ProtectedRoute><Statistics /></ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
