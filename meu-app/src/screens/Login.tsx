import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Animated, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import api from '../services/api';
import { useAuth } from '../contexts/Authcontext';

// Logo SVG fiel à identidade visual do WorkMatch
const WorkMatchLogo = ({ size = 90 }: { size?: number }) => (
  <Svg width={size} height={size * 1.1} viewBox="0 0 200 220">
    {/* Pino de localização azul escuro */}
    <Path d="M100 8 C54 8 18 44 18 90 C18 142 100 212 100 212 C100 212 182 142 182 90 C182 44 146 8 100 8 Z" fill="#0A2E73" />
    {/* Anel roxo tracejado */}
    <Circle cx="100" cy="88" r="50" fill="none" stroke="#6B21FF" strokeWidth="3.5" strokeDasharray="9 5" />
    {/* Fundo escuro interno */}
    <Circle cx="100" cy="88" r="40" fill="#071A4A" />
    {/* Laptop tela */}
    <Path d="M72 72 L128 72 L128 100 L72 100 Z" fill="#1D4ED8" rx="4" />
    {/* Laptop base */}
    <Path d="M65 103 L135 103 L130 110 L70 110 Z" fill="#1D4ED8" />
    {/* Tela branca azulada */}
    <Path d="M75 74 L125 74 L125 98 L75 98 Z" fill="#93C5FD" />
  </Svg>
);

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

  // Animações de entrada
  const logoY = useRef(new Animated.Value(-60)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formY = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrada: logo desce e aparece, depois form sobe e aparece
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoY, { toValue: 0, tension: 55, friction: 9, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, tension: 55, friction: 9, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(formOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(formY, { toValue: 0, duration: 450, useNativeDriver: true }),
      ]),
    ]).start();

    // Pulso contínuo suave
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.07, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const trocarModo = (novoModo: 'login' | 'cadastro') => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setModo(novoModo); setErro('');
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
      setErro(e.response?.data?.error || e.message || 'Erro ao fazer login');
    } finally { setLoading(false); }
  };

  const handleCadastro = async () => {
    if (!nome || !email || !senha) { setErro('Preencha nome, email e senha'); return; }
    if (senha.length < 6) { setErro('Senha deve ter pelo menos 6 caracteres'); return; }
    try {
      setLoading(true); setErro('');
      await api.registrar(email, senha, nome, tipo, telefone || undefined);
      Alert.alert('Conta criada!', 'Agora faça login.', [{ text: 'OK', onPress: () => trocarModo('login') }]);
    } catch (e: any) {
      setErro(e.response?.data?.error || e.message || 'Erro ao criar conta');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Logo animada */}
        <Animated.View style={[styles.logoArea, {
          opacity: logoOpacity,
          transform: [{ translateY: logoY }, { scale: Animated.multiply(logoScale, pulseAnim) }],
        }]}>
          <WorkMatchLogo size={88} />
          <Text style={styles.logoNome}><Text style={styles.logoWork}>WORK</Text><Text style={styles.logoMatch}>MATCH</Text></Text>
          <Text style={styles.tagline}>Conectando talentos a oportunidades</Text>
        </Animated.View>

        {/* Form animado */}
        <Animated.View style={{ opacity: formOpacity, transform: [{ translateY: formY }] }}>
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, modo === 'login' && styles.tabActive]} onPress={() => trocarModo('login')}>
              <Text style={[styles.tabText, modo === 'login' && styles.tabTextActive]}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, modo === 'cadastro' && styles.tabActive]} onPress={() => trocarModo('cadastro')}>
              <Text style={[styles.tabText, modo === 'cadastro' && styles.tabTextActive]}>Cadastrar</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={{ opacity: fadeAnim }}>
            {modo === 'cadastro' && (
              <>
                <Text style={styles.label}>Nome completo</Text>
                <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor="#9CA3AF" value={nome} onChangeText={setNome} editable={!loading} />
                <Text style={styles.label}>Telefone (opcional)</Text>
                <TextInput style={styles.input} placeholder="(11) 99999-9999" placeholderTextColor="#9CA3AF" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" editable={!loading} />
                <Text style={styles.label}>Você é...</Text>
                <View style={styles.tipoContainer}>
                  <TouchableOpacity style={[styles.tipoBtn, tipo === 'freelancer' && styles.tipoBtnActive]} onPress={() => setTipo('freelancer')}>
                    <Text style={styles.tipoIcon}>💼</Text>
                    <Text style={[styles.tipoText, tipo === 'freelancer' && styles.tipoTextActive]}>Freelancer</Text>
                    <Text style={[styles.tipoDesc, tipo === 'freelancer' && styles.tipoDescActive]}>Ofereço serviços</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tipoBtn, tipo === 'cliente' && styles.tipoBtnActive]} onPress={() => setTipo('cliente')}>
                    <Text style={styles.tipoIcon}>🏢</Text>
                    <Text style={[styles.tipoText, tipo === 'cliente' && styles.tipoTextActive]}>Cliente</Text>
                    <Text style={[styles.tipoDesc, tipo === 'cliente' && styles.tipoDescActive]}>Contrato serviços</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
            <Text style={styles.label}>Senha</Text>
            <TextInput style={styles.input} placeholder={modo === 'cadastro' ? 'Mínimo 6 caracteres' : '••••••'} placeholderTextColor="#9CA3AF" value={senha} onChangeText={setSenha} secureTextEntry editable={!loading} />

            {erro ? <Text style={styles.erro}>{erro}</Text> : null}

            {loading ? (
              <ActivityIndicator size="large" color="#0A2E73" style={{ marginVertical: 20 }} />
            ) : (
              <TouchableOpacity style={styles.botaoPrimario} onPress={modo === 'login' ? handleLogin : handleCadastro}>
                <Text style={styles.botaoPrimarioText}>{modo === 'login' ? 'Entrar' : 'Criar conta'}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => trocarModo(modo === 'login' ? 'cadastro' : 'login')}>
              <Text style={styles.linkText}>{modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F0F4FF' },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  logoArea: { alignItems: 'center', marginBottom: 24 },
  logoNome: { fontSize: 26, letterSpacing: 3, marginTop: 8 },
  logoWork: { color: '#0A2E73', fontWeight: '900' },
  logoMatch: { color: '#6B21FF', fontWeight: '900' },
  tagline: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  tabs: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#FFFFFF', elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#9CA3AF' },
  tabTextActive: { color: '#0A2E73' },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1F2937' },
  tipoContainer: { flexDirection: 'row', gap: 12, marginTop: 4 },
  tipoBtn: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, alignItems: 'center' },
  tipoBtnActive: { borderColor: '#0A2E73', backgroundColor: '#EEF2FF' },
  tipoIcon: { fontSize: 28, marginBottom: 6 },
  tipoText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tipoTextActive: { color: '#0A2E73' },
  tipoDesc: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  tipoDescActive: { color: '#6B21FF' },
  erro: { color: '#DC2626', fontSize: 13, fontWeight: '500', marginTop: 8, textAlign: 'center' },
  botaoPrimario: { backgroundColor: '#0A2E73', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  botaoPrimarioText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  linkText: { color: '#0A2E73', textAlign: 'center', marginTop: 16, fontSize: 14, fontWeight: '500' },
});
