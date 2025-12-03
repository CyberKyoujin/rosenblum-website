import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import AppSkeleton from "./components/AppSkeleton";
import useAuthStore from './zustand/useAuthStore';
import useOrderStore from './zustand/useOrderStore';
import useMessageStore from "./zustand/useMessageStore";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileSkeleton from './components/ProfileSkeleton';
import MessagesSkeleton from './components/MessagesSkeleton';
import OrderDetailsSkeleton from './components/OrderDetailsSkeleton';

const Home = lazy(() => import('./screens/Home'));
const Login = lazy(() => import('./screens/Login'));
const Register = lazy(() => import('./screens/Register'));
const Profile = lazy(() => import('./screens/Profile'));
const Order = lazy(() => import('./screens/Order'));
const OrderDetails = lazy(() => import('./screens/OrderDetails'));
const EditProfile = lazy(() => import('./screens/EditProfile'));
const AboutUs = lazy(() => import('./screens/AboutUs'));
const Messages = lazy(() => import('./screens/Messages'));
const ContactUs = lazy(() => import('./screens/ContactUs'));
const Translations = lazy(() => import("./screens/Translations"));
const VerbalTranslations = lazy(() => import("./screens/VerbalTranslations"));
const Apostille = lazy(() => import("./screens/Apostille"));
const Languages = lazy(() => import("./screens/Languages"));
const Pricing = lazy(() => import("./screens/Pricing"));
const Areas = lazy(() => import("./screens/Areas"));
const Faq = lazy(() => import("./screens/FAQ"));
const EmailVerification = lazy(() => import("./screens/EmailVerification"));
const EmailVerificationSuccess = lazy(() => import("./screens/EmailVerificationSuccess"));
const SendPasswordReset = lazy(() => import("./components/SendPasswordReset"));
const PasswordReset = lazy(() => import("./components/PasswordReset"));

function App() {
  
  const updateToken = useAuthStore(s => s.updateToken);
  const initAuth = useAuthStore(s => s.initAuth);
  const isAuthLoading = useAuthStore(s => s.isAuthLoading);
  const fetchUserMessages = useMessageStore(s => s.fetchUserMessages);
  const fetchOrders = useOrderStore(s => s.fetchOrders);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  // Auth initialization

  useEffect(() => {

  initAuth();

  const refreshTokenInterval = setInterval(async () => {
    try {
      await updateToken();
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }, 240000);

  return () => clearInterval(refreshTokenInterval);

  }, [updateToken, initAuth]);

  // Conditional user data fetch

  useEffect(() => {
    
    if (isAuthenticated) { 
        Promise.all([
            fetchUserMessages(),
            fetchOrders(),
        ]);
    }

  }, [isAuthenticated, fetchUserMessages, fetchOrders]);


   if (isAuthLoading) {
  
    return <AppSkeleton/>; 

  }

  return (
    <main>
      <Navbar/>
      <Routes>

        <Route path='/' element={
          <Suspense fallback={<AppSkeleton />}>
            <Home/>
          </Suspense>
        }/>

        <Route path='/register' element={
          <Suspense fallback={<AppSkeleton />}>
            <Register/>
          </Suspense>
        }/>

        <Route path='/email-verification' element={
          <Suspense fallback={<AppSkeleton />}>
            <EmailVerification/>
          </Suspense>
        }/>

        <Route path='/verification-success' element={
          <Suspense fallback={<AppSkeleton />}>
            <EmailVerificationSuccess/>
          </Suspense>
        }/>

        <Route path='/send-reset-password' element={
          <Suspense fallback={<AppSkeleton />}>
            <SendPasswordReset/>
          </Suspense>
        }/>

        <Route path="/password-reset/confirm/:uid/:token" element={
          <Suspense fallback={<AppSkeleton />}>
            <PasswordReset/>
          </Suspense>
        }/>

        <Route path='/login' element={
          <Suspense fallback={<AppSkeleton />}>
            <Login/>
          </Suspense>
        }/>

        <Route path='/order' element={
          <Suspense fallback={<AppSkeleton />}>
            <Order/>
          </Suspense>
        }/>

        <Route path='/about-us' element={
          <Suspense fallback={<AppSkeleton/>}>
            <AboutUs/>
          </Suspense>
        }/>

        <Route path='/contact-us' element={
          <Suspense fallback={<AppSkeleton/>}>
            <ContactUs/>
          </Suspense>
        }/>

        <Route path='/sworn-translations' element={
          <Suspense fallback={<AppSkeleton/>}>
            <Translations/>
          </Suspense>
        }/>

        <Route path='/verbal-translations' element={
          <Suspense fallback={<AppSkeleton/>}>
            <VerbalTranslations/>
          </Suspense>
        }/>

        <Route path="/apostille" element={
          <Suspense fallback={<AppSkeleton/>}>
            <Apostille/>
          </Suspense>
        }/>

        <Route path="/languages" element={
          <Suspense fallback={<AppSkeleton/>}>
            <Languages/>
          </Suspense>
        }/>

        <Route path="/pricing" element={
          <Suspense fallback={<AppSkeleton/>}>
            <Pricing/>
          </Suspense>
        }/>

        <Route path="/areas" element={
          <Suspense fallback={<AppSkeleton/>}>
            <Areas/>
          </Suspense>
        }/>

        <Route path="/faq" element={
          <Suspense fallback={<AppSkeleton/>}>
            <Faq/>
          </Suspense>
        }/>

        <Route path="/profile" element={
          <ProtectedRoute>
            <Suspense fallback={<ProfileSkeleton />}>
              <Profile/>
            </Suspense>
          </ProtectedRoute>
        }/>

        <Route path="/order/:orderId" element={
          <ProtectedRoute>
            <Suspense fallback={<OrderDetailsSkeleton/>}>
              <OrderDetails/>
            </Suspense>
          </ProtectedRoute>
        }/>

        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <Suspense fallback={<AppSkeleton/>}>
              <EditProfile/>
            </Suspense>
          </ProtectedRoute>
        }/>
  
        <Route path="/messages" element={
          <ProtectedRoute>
            <Suspense fallback={<MessagesSkeleton />}>
              <Messages/>
            </Suspense>
          </ProtectedRoute>
        }/>
      </Routes>
      
    </main>
  );
}

export default App;