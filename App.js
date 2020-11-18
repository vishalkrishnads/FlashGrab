import 'react-native-gesture-handler';
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {Icon} from 'react-native-elements';
import { useDarkMode } from 'react-native-dark-mode';
import Home from './src/screens/HomeScreen';
import Settings from './src/screens/Settings';
import Splash from './src/screens/locker';

const Tab = createBottomTabNavigator();
const Root = () => {
  const isDarkmode = useDarkMode();
  return (
    <Tab.Navigator        
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused
            ? 'home'
            : 'home';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings';
        }
        return <Icon name={iconName} type='material' size={25} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: global.accent,
      showLabel: false,
      tabStyle:{
        backgroundColor: isDarkmode?'black':'white'
      },
      keyboardHidesTabBar: true,
    }}
    >
      <Tab.Screen name="Home" component={Home}/>
      <Tab.Screen name="Settings" component={Settings}/>
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator()
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Fingerprint"
          component={Splash}
          options={{
             headerShown: false, 
          }}
        />
        <Stack.Screen name="FlashGrab" component={Root} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;
