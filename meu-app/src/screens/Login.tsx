import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login({ navigation }: any) {
  const { setUsuario } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async (tipo: 'freelancer' | 'cliente' | 'admin') => {
    if (!email || !senha) {
      setErro('Preencha email e senha');
      return;
    }

    try {
      setLoading(true);
      setErro('');
      const usuario = await api.login(email, senha);
      
      // Salvar usuário no contexto global
      setUsuario(usuario);
      
      // Navegar conforme o tipo de usuário
      if (tipo === 'freelancer' && usuario.tipo === 'freelancer') {
        navigation.navigate('Home');
      } else if (tipo === 'cliente' && usuario.tipo === 'cliente') {
        navigation.navigate('Home');
      } else if (tipo === 'admin') {
        navigation.navigate('Home');
      } else {
        setErro(`Tipo de usuário mismatch. Você é ${usuario.tipo}`);
      }
    } catch (error: any) {
      const mensagem = error.response?.data?.error || error.message || 'Erro ao fazer login';
      setErro(mensagem);
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.center}>
      <Text style={styles.logo}>WORKMATCH</Text>
      <Text style={styles.subtitulo}>Conectando talentos</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!loading}
      />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#0A2E73" style={{ marginVertical: 20 }} />
      ) : (
        <>
          <TouchableOpacity 
            style={styles.botao} 
            onPress={() => handleLogin('freelancer')}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>Entrar como Freelancer</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botao} 
            onPress={() => handleLogin('cliente')}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>Entrar como Cliente</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botao} 
            onPress={() => handleLogin('admin')}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>Entrar como Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botao} 
            onPress={() => navigation.navigate('HomeMain')}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>Home</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },

  center: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  logo: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0A2E73',
  },

  subtitulo: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0A2E73',
  },

  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  botao: {
    backgroundColor: '#0A2E73',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },

  botaoMini: {
    backgroundColor: '#0A2E73',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
  },

  botaoSec: {
    backgroundColor: '#ddd',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },

  textoBotao: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  cardTitulo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },

  erro: {
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
});