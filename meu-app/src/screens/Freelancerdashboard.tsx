import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../services/api';
import { useAuth } from '../contexts/Authcontext';

interface Servico {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  orcamento: number;
  status: string;
  criado_em: number;
}

const CATEGORIAS = ['desenvolvimento', 'design', 'marketing', 'escrita', 'outros'];

export const FreelancerDashboard: React.FC = () => {
  const { usuario } = useAuth();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('desenvolvimento');
  const [orcamento, setOrcamento] = useState('');

  const slideAnim = useRef(new Animated.Value(300)).current;

  const abrirModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }).start();
  };

  const fecharModal = () => {
    Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }).start(() => {
      setModalVisible(false);
      setTitulo(''); setDescricao(''); setOrcamento(''); setCategoria('desenvolvimento');
    });
  };

  const carregarServicos = async () => {
    if (!usuario) return;
    try {
      setLoading(true);
      const data = await api.listarVagasDoUsuario(usuario.id);
      setServicos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarServicos(); }, [usuario]);

  const publicarServico = async () => {
    if (!titulo || !descricao || !orcamento) {
      Alert.alert('Atenção', 'Preencha todos os campos'); return;
    }
    if (!usuario) return;
    try {
      setSalvando(true);
      await api.criarVaga(titulo, descricao, categoria, parseFloat(orcamento), usuario.id);
      Alert.alert('✅ Publicado!', 'Seu serviço já está visível para clientes.');
      fecharModal();
      carregarServicos();
    } catch (e: any) {
      Alert.alert('Erro', e.response?.data?.error || 'Erro ao publicar');
    } finally {
      setSalvando(false);
    }
  };

  const excluirServico = (id: number) => {
    Alert.alert('Excluir serviço', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          await api.deletarVaga(id);
          carregarServicos();
        },
      },
    ]);
  };

  const statusColor: Record<string, string> = {
    aberta: '#10B981', em_progresso: '#F59E0B', finalizada: '#6B7280',
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {usuario?.nome?.split(' ')[0]} 👋</Text>
            <Text style={styles.sub}>Gerencie seus serviços publicados</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={abrirModal}>
            <Text style={styles.addBtnText}>+ Publicar</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{servicos.length}</Text>
            <Text style={styles.statLabel}>Publicados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{servicos.filter(s => s.status === 'aberta').length}</Text>
            <Text style={styles.statLabel}>Ativos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{servicos.filter(s => s.status === 'em_progresso').length}</Text>
            <Text style={styles.statLabel}>Em andamento</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Meus Serviços</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
        ) : servicos.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Nenhum serviço ainda</Text>
            <Text style={styles.emptySub}>Publique seu primeiro serviço para aparecer para clientes</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={abrirModal}>
              <Text style={styles.emptyBtnText}>Publicar serviço</Text>
            </TouchableOpacity>
          </View>
        ) : (
          servicos.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo}</Text>
                <View style={[styles.badge, { backgroundColor: statusColor[item.status] + '22' }]}>
                  <Text style={[styles.badgeText, { color: statusColor[item.status] }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardDesc} numberOfLines={2}>{item.descricao}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardCategoria}>{item.categoria}</Text>
                <Text style={styles.cardOrcamento}>R$ {item.orcamento.toLocaleString('pt-BR')}</Text>
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => excluirServico(item.id)}>
                <Text style={styles.deleteBtnText}>Remover</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Modal publicar */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={fecharModal}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Publicar Serviço</Text>
                <TouchableOpacity onPress={fecharModal}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.fieldLabel}>Título do serviço</Text>
                <TextInput style={styles.fieldInput} placeholder="Ex: Desenvolvimento de app mobile" placeholderTextColor="#9CA3AF" value={titulo} onChangeText={setTitulo} />

                <Text style={styles.fieldLabel}>Descrição</Text>
                <TextInput style={[styles.fieldInput, styles.textarea]} placeholder="Descreva o que você oferece..." placeholderTextColor="#9CA3AF" value={descricao} onChangeText={setDescricao} multiline numberOfLines={4} textAlignVertical="top" />

                <Text style={styles.fieldLabel}>Categoria</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  {CATEGORIAS.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.catChip, categoria === c && styles.catChipActive]}
                      onPress={() => setCategoria(c)}
                    >
                      <Text style={[styles.catChipText, categoria === c && styles.catChipTextActive]}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.fieldLabel}>Valor (R$)</Text>
                <TextInput style={styles.fieldInput} placeholder="0,00" placeholderTextColor="#9CA3AF" value={orcamento} onChangeText={setOrcamento} keyboardType="numeric" />

                <TouchableOpacity style={styles.publishBtn} onPress={publicarServico} disabled={salvando}>
                  {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishBtnText}>Publicar Serviço</Text>}
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 28, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  greeting: { fontSize: 22, fontWeight: '700', color: '#1F2937' },
  sub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  addBtn: { backgroundColor: '#3B82F6', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  statsRow: { flexDirection: 'row', margin: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  statNum: { fontSize: 22, fontWeight: '800', color: '#3B82F6' },
  statLabel: { fontSize: 11, color: '#6B7280', marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginHorizontal: 16, marginBottom: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, marginHorizontal: 16, marginBottom: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  cardDesc: { fontSize: 13, color: '#6B7280', lineHeight: 18, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardCategoria: { fontSize: 12, color: '#8B5CF6', fontWeight: '600', textTransform: 'capitalize' },
  cardOrcamento: { fontSize: 14, fontWeight: '700', color: '#1E40AF' },
  deleteBtn: { marginTop: 12, alignSelf: 'flex-start' },
  deleteBtnText: { fontSize: 13, color: '#EF4444', fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  emptySub: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emptyBtn: { backgroundColor: '#3B82F6', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  emptyBtnText: { color: '#fff', fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  closeBtn: { fontSize: 18, color: '#9CA3AF', padding: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  fieldInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1F2937' },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  catChip: { marginRight: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' },
  catChipActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  catChipText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  catChipTextActive: { color: '#FFFFFF' },
  publishBtn: { backgroundColor: '#3B82F6', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 24, marginBottom: 8 },
  publishBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
