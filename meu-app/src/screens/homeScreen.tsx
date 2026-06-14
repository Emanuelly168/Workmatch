import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useAuth } from '../contexts/Authcontext';

export const HomeScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { usuario } = useAuth();
  const isFreelancer = usuario?.tipo === 'freelancer';

  const headerAnim = useRef(new Animated.Value(0)).current;
  const bannerAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;
  const stepsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(bannerAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(cardsAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(stepsAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const fadeSlide = (anim: Animated.Value, dy = 24) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [dy, 0] }) }],
  });

  const handlePrincipal = () => navigation?.navigate(isFreelancer ? 'Meus_Serviços' : 'Vagas');
  const handlePerfil = () => navigation?.navigate('Perfil');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.header, fadeSlide(headerAnim)]}>
        <Text style={styles.greeting}>Bem-vindo ao WorkMatch! 🤝</Text>
        {usuario && <Text style={styles.nome}>{usuario.nome}</Text>}
        <Text style={styles.sub}>
          {isFreelancer
            ? 'Publique seus serviços e conquiste clientes'
            : 'Encontre o profissional perfeito para seu projeto'}
        </Text>
      </Animated.View>

      <Animated.View style={[styles.bannerWrap, fadeSlide(bannerAnim)]}>
        <View style={[styles.banner, isFreelancer ? styles.bannerFreelancer : styles.bannerCliente]}>
          <Text style={styles.bannerTitle}>{isFreelancer ? '💼 Área do Freelancer' : '🏢 Área do Cliente'}</Text>
          <Text style={styles.bannerSub}>
            {isFreelancer
              ? 'Publique seus serviços e receba propostas de clientes'
              : 'Explore serviços de freelancers qualificados'}
          </Text>
          <TouchableOpacity style={styles.bannerBtn} onPress={handlePrincipal}>
            <Text style={[styles.bannerBtnText, { color: isFreelancer ? '#0A2E73' : '#065F46' }]}>
              {isFreelancer ? 'Gerenciar Serviços' : 'Explorar Serviços'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Apenas 1 ação rápida: Meu Perfil */}
      <Animated.View style={[styles.acoesWrap, fadeSlide(cardsAnim)]}>
        <TouchableOpacity style={styles.acaoBtn} onPress={handlePrincipal}>
          <Text style={styles.acaoIcon}>{isFreelancer ? '📋' : '🔍'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.acaoTitle}>{isFreelancer ? 'Meus Serviços' : 'Buscar Serviços'}</Text>
            <Text style={styles.acaoDesc}>{isFreelancer ? 'Gerencie o que você oferece' : 'Encontre profissionais'}</Text>
          </View>
          <Text style={styles.acaoArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.acaoBtn} onPress={handlePerfil}>
          <Text style={styles.acaoIcon}>👤</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.acaoTitle}>Meu Perfil</Text>
            <Text style={styles.acaoDesc}>Gerencie seus dados pessoais</Text>
          </View>
          <Text style={styles.acaoArrow}>›</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.howWrap, fadeSlide(stepsAnim)]}>
        <Text style={styles.sectionTitle}>Como Funciona?</Text>
        {(isFreelancer ? [
          { n: '1', title: 'Crie seu perfil', desc: 'Adicione suas habilidades' },
          { n: '2', title: 'Publique serviços', desc: 'Mostre o que você sabe fazer' },
          { n: '3', title: 'Receba propostas', desc: 'Clientes entram em contato' },
          { n: '4', title: 'Ganhe dinheiro', desc: 'Conclua e receba com segurança' },
        ] : [
          { n: '1', title: 'Explore serviços', desc: 'Veja freelancers disponíveis' },
          { n: '2', title: 'Faça uma proposta', desc: 'Negocie o valor e prazo' },
          { n: '3', title: 'Contrate', desc: 'Feche o contrato com segurança' },
          { n: '4', title: 'Pague com segurança', desc: 'Pagamento protegido pela plataforma' },
        ]).map((step, i) => (
          <View key={i} style={styles.step}>
            <View style={[styles.stepNum, isFreelancer ? styles.stepNumBlue : styles.stepNumGreen]}>
              <Text style={styles.stepNumText}>{step.n}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </Animated.View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: { padding: 24, paddingTop: 32, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  greeting: { fontSize: 22, fontWeight: '800', color: '#0A2E73', marginBottom: 2 },
  nome: { fontSize: 15, fontWeight: '600', color: '#4F46E5', marginBottom: 4 },
  sub: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  bannerWrap: { padding: 16 },
  banner: { borderRadius: 16, padding: 22 },
  bannerFreelancer: { backgroundColor: '#0A2E73' },
  bannerCliente: { backgroundColor: '#065F46' },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20, marginBottom: 16 },
  bannerBtn: { backgroundColor: '#FFFFFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, alignSelf: 'flex-start' },
  bannerBtnText: { fontWeight: '700', fontSize: 13 },
  acoesWrap: { paddingHorizontal: 16, marginBottom: 8, gap: 10 },
  acaoBtn: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  acaoIcon: { fontSize: 28, marginRight: 14 },
  acaoTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  acaoDesc: { fontSize: 12, color: '#6B7280' },
  acaoArrow: { fontSize: 22, color: '#9CA3AF', marginLeft: 8 },
  howWrap: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0A2E73', marginBottom: 16 },
  step: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start' },
  stepNum: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  stepNumBlue: { backgroundColor: '#0A2E73' },
  stepNumGreen: { backgroundColor: '#065F46' },
  stepNumText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  stepDesc: { fontSize: 13, color: '#6B7280' },
});
