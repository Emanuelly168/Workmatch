import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function DashboardAdminScreen({ navigation }: any) {
  const cruds = [
    'CRUD Cidades', 'CRUD Tags', 'CRUD Perfis', 'CRUD UF',
    'CRUD Noticias', 'CRUD Usuarios', 'Gerenciar Comentarios'
  ]; 
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard SuperAdmin</Text>
      <Text style={styles.subtitle}>Gestão do Sistema</Text>

      <View style={styles.grid}>
        {cruds.map((crud, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => alert(`Acessando ${crud}`)}>
            <Text style={styles.cardText}>{crud}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>Voltar para Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#D32F2F', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#FFF', width: '48%', padding: 20, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center' },
  cardText: { fontWeight: 'bold', textAlign: 'center', color: '#000' },
  backBtn: { marginTop: 20, padding: 16, backgroundColor: '#000', borderRadius: 8, alignItems: 'center' },
  backBtnText: { color: '#FFF', fontWeight: 'bold' }
});