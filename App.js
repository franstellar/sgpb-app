import React, { useEffect, useState } from 'react';
import { initLocalDatabase } from './src/db';
import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import BuyerScreen from './src/screens/BuyerScreen';
import AdminScreen from './src/screens/AdminScreen';

export default function App() {
  const [screen, setScreen] = useState('SPLASH'); // SPLASH | AUTH | BUYER | ADMIN
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    initLocalDatabase();
    const timer = setTimeout(() => {
      setScreen('AUTH');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setScreen(user.role === 'ADMIN' ? 'ADMIN' : 'BUYER');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('AUTH');
  };

  if (screen === 'SPLASH') return <SplashScreen />;
  if (screen === 'AUTH') return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  if (screen === 'ADMIN') return <AdminScreen user={currentUser} onLogout={handleLogout} />;
  return <BuyerScreen user={currentUser} onLogout={handleLogout} />;
}