import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import { AuthProvider, useAuth } from './src/contexts/Authcontext';
import Login from './src/screens/Login';
import { HomeScreen } from './src/screens/homeScreen';
import { JobListingsScreen } from './src/screens/JobListingsScreen';
import { HiringStepsScreen } from './src/screens/HiringStepsScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
import { FreelancerDashboard } from './src/screens/Freelancerdashboard';
import { ProfileScreen } from './src/screens/Profilescreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack para contratação (cliente)
const JobsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8F9FA' } }}>
    <Stack.Screen name="JobsMain" component={JobListingsScreen} />
    <Stack.Screen name="HiringSteps" component={HiringStepsScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
  </Stack.Navigator>
);

// Stack para home com navegação
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8F9FA' } }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="JobListings" component={JobListingsScreen} />
    <Stack.Screen name="HiringSteps" component={HiringStepsScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
  </Stack.Navigator>
);

// Tabs do Freelancer
const FreelancerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
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
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, string> = {
          Início: '🏠', Meus_Serviços: '💼', Perfil: '👤',
        };
        return <Text style={{ fontSize: size - 2, color }}>{icons[route.name] || '●'}</Text>;
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
      tabBarActiveTintColor: '#059669',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: 8,
        paddingTop: 8,
        height: 64,
      },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, string> = {
          Início: '🏠', Vagas: '🔍', Perfil: '👤',
        };
        return <Text style={{ fontSize: size - 2, color }}>{icons[route.name] || '●'}</Text>;
      },
    })}
  >
    <Tab.Screen name="Início" component={HomeStack} options={{ title: 'Início' }} />
    <Tab.Screen name="Vagas" component={JobsStack} options={{ title: 'Contratar' }} />
    <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Perfil' }} />
  </Tab.Navigator>
);

// Navigator raiz com lógica de auth
const RootNavigator = () => {
  const { usuario, logout } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!usuario ? (
        <Stack.Screen name="Login" component={Login} />
      ) : (
        <Stack.Screen
          name="Main"
          component={usuario.tipo === 'freelancer' ? FreelancerTabs : ClienteTabs}
          listeners={{
            // limpa pilha ao navegar para Main
          }}
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
