import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../services/api';
import { useAuth } from '../contexts/Authcontext';

export default function Login({ navigation }: any) {
  const { setUsuario } = useAuth();
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState<'cliente' | 'freelancer'>('freelancer');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Animação de fade para transição login/cadastro
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const trocarModo = (novoModo: 'login' | 'cadastro') => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setModo(novoModo);
      setErro('');
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const handleLogin = async () => {
    if (!email || !senha) { setErro('Preencha email e senha'); return; }
    try {
      setLoading(true); setErro('');
      const usuario = await api.login(email, senha);
      setUsuario(usuario);
      navigation.replace('Main');
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || 'Erro ao fazer login';
      setErro(msg);
    } finally { setLoading(false); }
  };

  const handleCadastro = async () => {
    if (!nome || !email || !senha) { setErro('Preencha nome, email e senha'); return; }
    if (senha.length < 6) { setErro('Senha deve ter pelo menos 6 caracteres'); return; }
    try {
      setLoading(true); setErro('');
      await api.registrar(email, senha, nome, tipo, telefone || undefined);
      Alert.alert('Conta criada!', 'Agora faça login com suas credenciais.', [
        { text: 'OK', onPress: () => trocarModo('login') },
      ]);
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || 'Erro ao criar conta';
      setErro(msg);
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoArea}>
          <Text style={styles.logo}>WorkMatch</Text>
          <Text style={styles.tagline}>Conectando talentos a oportunidades</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, modo === 'login' && styles.tabActive]}
            onPress={() => trocarModo('login')}
          >
            <Text style={[styles.tabText, modo === 'login' && styles.tabTextActive]}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, modo === 'cadastro' && styles.tabActive]}
            onPress={() => trocarModo('cadastro')}
          >
            <Text style={[styles.tabText, modo === 'cadastro' && styles.tabTextActive]}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
          {/* Campos de cadastro extras */}
          {modo === 'cadastro' && (
            <>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                placeholderTextColor="#9CA3AF"
                value={nome}
                onChangeText={setNome}
                editable={!loading}
              />

              <Text style={styles.label}>Telefone (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="(11) 99999-9999"
                placeholderTextColor="#9CA3AF"
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
                editable={!loading}
              />

              <Text style={styles.label}>Você é...</Text>
              <View style={styles.tipoContainer}>
                <TouchableOpacity
                  style={[styles.tipoBtn, tipo === 'freelancer' && styles.tipoBtnActive]}
                  onPress={() => setTipo('freelancer')}
                >
                  <Text style={styles.tipoIcon}>💼</Text>
                  <Text style={[styles.tipoText, tipo === 'freelancer' && styles.tipoTextActive]}>
                    Freelancer
                  </Text>
                  <Text style={[styles.tipoDesc, tipo === 'freelancer' && styles.tipoDescActive]}>
                    Ofereço serviços
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tipoBtn, tipo === 'cliente' && styles.tipoBtnActive]}
                  onPress={() => setTipo('cliente')}
                >
                  <Text style={styles.tipoIcon}>🏢</Text>
                  <Text style={[styles.tipoText, tipo === 'cliente' && styles.tipoTextActive]}>
                    Cliente
                  </Text>
                  <Text style={[styles.tipoDesc, tipo === 'cliente' && styles.tipoDescActive]}>
                    Contrato serviços
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder={modo === 'cadastro' ? 'Mínimo 6 caracteres' : '••••••'}
            placeholderTextColor="#9CA3AF"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={!loading}
          />

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          {loading ? (
            <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 20 }} />
          ) : (
            <TouchableOpacity
              style={styles.botaoPrimario}
              onPress={modo === 'login' ? handleLogin : handleCadastro}
            >
              <Text style={styles.botaoPrimarioText}>
                {modo === 'login' ? 'Entrar' : 'Criar conta'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => trocarModo(modo === 'login' ? 'cadastro' : 'login')}>
            <Text style={styles.linkText}>
              {modo === 'login'
                ? 'Não tem conta? Cadastre-se'
                : 'Já tem conta? Faça login'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  logoArea: { alignItems: 'center', marginBottom: 36 },
  logo: { fontSize: 36, fontWeight: '800', color: '#1E40AF', letterSpacing: -1 },
  tagline: { fontSize: 14, color: '#6B7280', marginTop: 6 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#9CA3AF' },
  tabTextActive: { color: '#1F2937' },
  form: { gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  tipoContainer: { flexDirection: 'row', gap: 12, marginTop: 4 },
  tipoBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  tipoBtnActive: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  tipoIcon: { fontSize: 28, marginBottom: 6 },
  tipoText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tipoTextActive: { color: '#1E40AF' },
  tipoDesc: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  tipoDescActive: { color: '#3B82F6' },
  erro: { color: '#DC2626', fontSize: 13, fontWeight: '500', marginTop: 8, textAlign: 'center' },
  botaoPrimario: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  botaoPrimarioText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  linkText: { color: '#3B82F6', textAlign: 'center', marginTop: 16, fontSize: 14, fontWeight: '500' },
});
