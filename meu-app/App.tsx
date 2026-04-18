import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/contexts/AppContext';

import HomeScreen from './src/contexts/screens/HomeScreen';
import LoginScreen from './src/contexts/screens/LoginScreen';
import CadastroScreen from './src/contexts/screens/CadastroScreen';
import DashboardAdminScreen from './src/contexts/screens/admin';

const MockScreen = ({ route }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tela: {route.name}</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        {}
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#000' }, headerTintColor: '#FFF' }}>
          
          {}
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Cadastro de Usuário' }} />
          <Stack.Screen name="BuscaUF" component={MockScreen} options={{ title: 'Busca por Estado' }} />
          <Stack.Screen name="BuscaTag" component={MockScreen} options={{ title: 'Busca por Tag' }} />
          <Stack.Screen name="DetalheNoticia" component={MockScreen} options={{ title: 'Notícia Completa' }} />

          {}
          <Stack.Screen name="MeuPerfil" component={MockScreen} />
          <Stack.Screen name="MinhasNoticias" component={MockScreen} options={{ title: 'Minhas Publicações' }} />
          <Stack.Screen name="PainelEditor" component={MockScreen} options={{ title: 'Painel do Editor' }} />
          
          {}
          <Stack.Screen name="DashboardAdmin" component={DashboardAdminScreen} options={{ headerShown: false }} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}