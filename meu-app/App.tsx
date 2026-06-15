import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { AuthProvider, useAuth } from './src/contexts/Authcontext';
import Login from './src/screens/Login';
import { HomeScreen } from './src/screens/homeScreen';
import { HiringStepsScreen } from './src/screens/HiringStepsScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
import { FreelancerDashboard } from './src/screens/Freelancerdashboard';
import { ClienteDashboard } from './src/screens/Clientedashboard';
import { ProfileScreen } from './src/screens/Profilescreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const SO = { headerShown: false, contentStyle: { backgroundColor: '#F0F4FF' } };

// Stack Home (freelancer e cliente compartilham)
const HomeStack = () => (
  <Stack.Navigator screenOptions={SO}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
  </Stack.Navigator>
);

// Stack serviços/vagas do cliente
const ClienteStack = () => (
  <Stack.Navigator screenOptions={SO}>
    <Stack.Screen name="ClienteMain" component={ClienteDashboard} />
    <Stack.Screen name="HiringSteps" component={HiringStepsScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
  </Stack.Navigator>
);

// Tabs do Freelancer
const FreelancerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#0A2E73',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarStyle: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingBottom: 8, paddingTop: 8, height: 64 },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, string> = { Início: '🏠', Meus_Serviços: '💼', Perfil: '👤' };
        return <Text style={{ fontSize: size - 2 }}>{icons[route.name] || '●'}</Text>;
      },
    })}
  >
    <Tab.Screen name="Início" component={HomeStack} options={{ title: 'Início' }} />
    <Tab.Screen name="Meus_Serviços" component={FreelancerDashboard} options={{ title: 'Meus Serviços' }} />
    <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Perfil' }} />
  </Tab.Navigator>
);

// Tabs do Cliente
const ClienteTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#065F46',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarStyle: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingBottom: 8, paddingTop: 8, height: 64 },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, string> = { Início: '🏠', Vagas: '🔍', Perfil: '👤' };
        return <Text style={{ fontSize: size - 2 }}>{icons[route.name] || '●'}</Text>;
      },
    })}
  >
    <Tab.Screen name="Início" component={HomeStack} options={{ title: 'Início' }} />
    <Tab.Screen name="Vagas" component={ClienteStack} options={{ title: 'Contratar' }} />
    <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Perfil' }} />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { usuario } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!usuario ? (
        <Stack.Screen name="Login" component={Login} />
      ) : (
        <Stack.Screen
          name="Main"
          component={usuario.tipo === 'freelancer' ? FreelancerTabs : ClienteTabs}
        />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
