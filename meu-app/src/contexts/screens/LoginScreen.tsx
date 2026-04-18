import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp, Role } from '../AppContext';

export default function LoginScreen({ navigation }: any) {
  const { login } = useApp();

  const handleLogin = (perfil: Role) => {
    login(perfil);
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acesso ao Sistema</Text>
      
      <TouchableOpacity style={[styles.button, {backgroundColor: '#757575'}]} onPress={() => handleLogin('LEITOR')}>
        <Text style={styles.buttonText}>Entrar como LEITOR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {backgroundColor: '#424242'}]} onPress={() => handleLogin('AUTOR')}>
        <Text style={styles.buttonText}>Entrar como AUTOR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {backgroundColor: '#1E1E1E'}]} onPress={() => handleLogin('EDITOR')}>
        <Text style={styles.buttonText}>Entrar como EDITOR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {backgroundColor: '#D32F2F'}]} onPress={() => handleLogin('SUPERADMIN')}>
        <Text style={styles.buttonText}>Entrar como SUPER ADMIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.secondaryButtonText}>Cadastrar novo usuário</Text>
      </TouchableOpacity>

      {}
      <TouchableOpacity style={{marginTop: 20}} onPress={() => alert('Fluxo de Lembrar Senha')}>
        <Text style={{color: '#424242', textAlign: 'center'}}>Esqueceu a senha? Lembrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#FFFFFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  button: { padding: 16, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
  secondaryButton: { padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#424242', marginBottom: 20, alignItems: 'center' },
  secondaryButtonText: { color: '#424242', fontWeight: 'bold' }
});