import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './screens/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Dashboard from './screens/Dashboard'
import useAuthStore from './zustand/useAuthStore'
function App() {
  const [count, setCount] = useState(0)

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

  console.log(authStore.isAuthenticated, authStore.user);

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </>
  )
}

export default App
