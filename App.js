import React, { useEffect, useState } from 'react';
import { initLocalDatabase } from './src/db';
import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import BuyerScreen from './src/screens/BuyerScreen';
import AdminScreen from './src/screens/AdminScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [screen, setScreen] = useState('SPLASH'); // SPLASH | AUTH | BUYER | ADMIN | VOLUNTEER | PARTNER
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    initLocalDatabase();
    const timer = setTimeout(() => {
      setScreen('AUTH');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    const role = user.role ? user.role.toUpperCase() : 'BUYER';

    switch (role) {
      case 'ADMIN':
        setScreen('ADMIN');
        break;
      case 'VOLUNTEER':
        setScreen('VOLUNTEER');
        break;
      case 'PARTNER':
        setScreen('PARTNER');
        break;
      default:
        setScreen('BUYER');
        break;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('AUTH');
  };

  return (
    <SafeAreaProvider>
      {screen === 'SPLASH' && <SplashScreen />}
      {screen === 'AUTH' && <AuthScreen onLoginSuccess={handleLoginSuccess} />}
      {screen === 'ADMIN' && <AdminScreen user={currentUser} onLogout={handleLogout} />}
      {screen === 'VOLUNTEER' && <AdminScreen user={currentUser} onLogout={handleLogout} />}
      {screen === 'PARTNER' && <AdminScreen user={currentUser} onLogout={handleLogout} />}
      {screen !== 'SPLASH' &&
        screen !== 'AUTH' &&
        screen !== 'ADMIN' &&
        screen !== 'VOLUNTEER' &&
        screen !== 'PARTNER' && <BuyerScreen user={currentUser} onLogout={handleLogout} />}
    </SafeAreaProvider>
  );
}