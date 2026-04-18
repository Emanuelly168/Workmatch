import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Role } from '../AppContext';
import { registerUser } from '../../services/UserBackend';

const perfis: Exclude<Role, 'PUBLICO' | null>[] = ['LEITOR', 'AUTOR', 'EDITOR', 'SUPERADMIN'];

export default function CadastroScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState<Exclude<Role, 'PUBLICO' | null>>('LEITOR');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim() || !perfil) {
      Alert.alert('Atenção', 'Preencha todos os campos corretamente.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({ nome: nome.trim(), email: email.trim(), senha, perfil });
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
        { text: 'Ir para Login', onPress: () => navigation.replace('Login') },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível realizar o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>
      <Text style={styles.description}>Crie seu acesso e escolha um perfil para seu fluxo.</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite seu nome" />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite sua senha"
        secureTextEntry
      />

      <Text style={styles.label}>Perfil</Text>
      <View style={styles.profileRow}>
        {perfis.map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.profileButton, perfil === p && styles.profileButtonSelected]}
            onPress={() => setPerfil(p)}
          >
            <Text style={[styles.profileText, perfil === p && styles.profileTextSelected]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loginLink}>
        <Text style={styles.loginLinkText}>Já tenho cadastro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111', marginBottom: 8, textAlign: 'center' },
  description: { fontSize: 15, color: '#555', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' },
  input: { backgroundColor: '#F0F0F0', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 16, color: '#111' },
  profileRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  profileButton: { width: '48%', padding: 14, borderRadius: 10, backgroundColor: '#E8E8E8', marginBottom: 12, alignItems: 'center' },
  profileButtonSelected: { backgroundColor: '#000' },
  profileText: { color: '#333', fontWeight: '600' },
  profileTextSelected: { color: '#FFF' },
  submitButton: { backgroundColor: '#000', padding: 16, borderRadius: 12, alignItems: 'center' },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  loginLink: { marginTop: 18, alignItems: 'center' },
  loginLinkText: { color: '#424242', textDecorationLine: 'underline' },
});
