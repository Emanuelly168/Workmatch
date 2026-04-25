import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function Freelancer({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.center}>
      <Text style={styles.titulo}>Área Freelancer</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Meu Perfil</Text>
        <Text>Nome: João Silva</Text>
        <Text>Serviço: Designer</Text>
        <Text>Nota: 4.9</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Meus Trabalhos</Text>
        <Text>• Logo para empresa</Text>
        <Text>• Criação de site</Text>
      </View>

      <TouchableOpacity style={styles.botao}>
        <Text style={styles.textoBotao}>Novo Serviço</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoSec} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotaoEscuro}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0A2E73',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitulo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  botao: {
    backgroundColor: '#0A2E73',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
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
  textoBotaoEscuro: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});