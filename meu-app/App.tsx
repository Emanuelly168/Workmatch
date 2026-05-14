import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import Login from './src/screens/Login';
import Freelancer from './src/screens/freelancer';
import Cliente from './src/screens/cliente';
import Admin from './src/screens/admin';
import homeScreen  from './src/screens/homeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Freelancer" component={Freelancer} />
        <Stack.Screen name="Cliente" component={Cliente} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="Home" component={homeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}