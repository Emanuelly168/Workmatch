import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Login({ navigation }: any) {
  return (
    <View style={styles.center}>
      <Text style={styles.logo}>WORKMATCH</Text>
      <Text style={styles.subtitulo}>Conectando talentos</Text>

      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Senha" style={styles.input} secureTextEntry />

      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Freelancer')}>
        <Text style={styles.textoBotao}>Entrar como Freelancer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Cliente')}>
        <Text style={styles.textoBotao}>Entrar como Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Admin')}>
        <Text style={styles.textoBotao}>Entrar como Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.textoBotao}>Home</Text>
      </TouchableOpacity>
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
});