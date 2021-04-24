import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DarkModeProvider, useDarkMode } from 'react-native-dark-mode'
import { changeBarColors } from 'react-native-immersive-bars';
import Splash from './src/screens/Splash'
import Home from './src/screens/Home'
import AddSale from './src/screens/AddSale'
import Settings from './src/screens/Settings'

const Stack = createStackNavigator();

const App = () => {
  const isDarkMode = useDarkMode()
  React.useEffect(() => {
    changeBarColors(isDarkMode);
  }, [isDarkMode]);
  return (
    <DarkModeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="AddSale" component={AddSale} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </DarkModeProvider>
  );
}

export default App;