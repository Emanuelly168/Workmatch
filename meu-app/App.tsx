import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import Login from './src/screens/Login';
import { HomeScreen } from './src/screens/homeScreen';
import { JobListingsScreen } from './src/screens/JobListingsScreen';
import { HiringStepsScreen } from './src/screens/HiringStepsScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8F9FA' },
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="JobListings" component={JobListingsScreen} />
      <Stack.Screen name="HiringSteps" component={HiringStepsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
};

const JobsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
          contentStyle: { backgroundColor: '#F8F9FA' },
      }}
    >
      <Stack.Screen name="JobsMain" component={JobListingsScreen} />
      <Stack.Screen name="HiringSteps" component={HiringStepsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }: { route: { name: string } }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            paddingBottom: 8,
            paddingTop: 8,
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
          tabBarIcon: ({ color, size }: { color: string; size: number }) => {
            let icon = '';
            if (route.name === 'Home') {
              icon = '🏠';
            } else if (route.name === 'Jobs') {
              icon = '💼';
            } else if (route.name === 'Messages') {
              icon = '💬';
            } else if (route.name === 'Profile') {
              icon = '👤';
            }
            return <Text style={{ fontSize: size, color }}>{icon}</Text>;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            title: 'Home',
          }}
        />
        <Tab.Screen
          name="Jobs"
          component={JobsStack}
          options={{
            title: 'Vagas',
          }}
        />
        <Tab.Screen
          name="Messages"
          component={HomeScreen}
          options={{
            title: 'Mensagens',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={HomeScreen}
          options={{
            title: 'Perfil',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
