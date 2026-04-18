import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useApp } from '../AppContext';

export default function HomeScreen({ navigation }: any) {
  const { role, logout } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Portal de Notícias</Text>
        {role === 'PUBLICO' ? (
          <View style={styles.row}>
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}><Text style={styles.linkText}>Cadastro</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{marginLeft: 15}}><Text style={styles.loginText}>Login</Text></TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={logout}><Text style={styles.logoutText}>Sair ({role})</Text></TouchableOpacity>
        )}
      </View>

      { }
      <View style={styles.searchRow}>
        <TouchableOpacity style={styles.searchBtn} onPress={() => navigation.navigate('BuscaUF')}>
          <Text style={styles.searchBtnText}>Busca por UF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchBtn} onPress={() => navigation.navigate('BuscaTag')}>
          <Text style={styles.searchBtnText}>Busca por Tag</Text>
        </TouchableOpacity>
      </View>

      {}
      {role === 'SUPERADMIN' && (
        <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('DashboardAdmin')}>
          <Text style={styles.adminBtnText}>Acessar Dashboard Admin</Text>
        </TouchableOpacity>
      )}
      {role === 'EDITOR' && (
        <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('PainelEditor')}>
          <Text style={styles.adminBtnText}>Acessar Painel do Editor</Text>
        </TouchableOpacity>
      )}
      {role === 'AUTOR' && (
        <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('MinhasNoticias')}>
          <Text style={styles.adminBtnText}>Gerenciar Minhas Notícias</Text>
        </TouchableOpacity>
      )}
      {(role === 'LEITOR' || role === 'AUTOR' || role === 'EDITOR') && (
        <TouchableOpacity style={styles.perfilBtn} onPress={() => navigation.navigate('MeuPerfil')}>
          <Text style={styles.perfilBtnText}>Meu Perfil</Text>
        </TouchableOpacity>
      )}

      {}
      <Text style={styles.sectionTitle}>Últimas Notícias</Text>
      <FlatList
        data={[{id: '1', titulo: 'Expo 54 Lançado'}, {id: '2', titulo: 'React Native Atualiza Arquitetura'}]}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.newsCard} onPress={() => navigation.navigate('DetalheNoticia', { id: item.id })}>
            <Text style={styles.newsTitle}>{item.titulo}</Text>
            <Text style={styles.newsLink}>Ler mais...</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingTop: 40 },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000000' },
  row: { flexDirection: 'row' },
  linkText: { color: '#424242', fontWeight: 'bold' },
  loginText: { color: '#D32F2F', fontWeight: 'bold' },
  logoutText: { color: '#D32F2F', fontWeight: 'bold' },
  searchRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  searchBtn: { backgroundColor: '#E0E0E0', padding: 10, borderRadius: 6, flex: 0.48, alignItems: 'center' },
  searchBtnText: { color: '#000', fontWeight: '500' },
  adminBtn: { backgroundColor: '#000000', padding: 14, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  adminBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
  perfilBtn: { backgroundColor: '#424242', padding: 14, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  perfilBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#000000' },
  newsCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#D32F2F' },
  newsTitle: { fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 8 },
  newsLink: { color: '#D32F2F', fontSize: 14, fontWeight: '500' }
});