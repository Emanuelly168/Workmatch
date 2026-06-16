import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Modal, Animated,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,
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

interface Proposta {
  id: number;
  vaga_id: number;
  freelancer_id: number;
  valor: number;
  descricao: string;
  status: string;
  criado_em: number;
  // nome do cliente virá de uma busca separada
  nomeCliente?: string;
}

const CATEGORIAS = ['desenvolvimento', 'design', 'marketing', 'escrita', 'outros'];

const AnimatedCard = ({ children, delay = 0, style }: any) => {
  const anim = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[{ opacity: anim, transform: [{ translateY: slideY }] }, style]}>
      {children}
    </Animated.View>
  );
};

export const FreelancerDashboard: React.FC = () => {
  const { usuario } = useAuth();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [propostas, setPropostas] = useState<Record<number, Proposta[]>>({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'servicos' | 'propostas'>('servicos');
  const [respondendo, setRespondendo] = useState<number | null>(null);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('desenvolvimento');
  const [orcamento, setOrcamento] = useState('');

  const slideAnim = useRef(new Animated.Value(400)).current;

  const abrirModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }).start();
  };
  const fecharModal = () => {
    Animated.timing(slideAnim, { toValue: 400, duration: 200, useNativeDriver: true }).start(() => {
      setModalVisible(false);
      setTitulo(''); setDescricao(''); setOrcamento(''); setCategoria('desenvolvimento');
    });
  };

  const carregarDados = async () => {
    if (!usuario) return;
    try {
      setLoading(true);
      const data = await api.listarVagasDoUsuario(usuario.id);
      setServicos(data);

      // Carregar propostas recebidas para cada serviço e buscar nome do cliente
      const propostasMap: Record<number, Proposta[]> = {};
      await Promise.all(data.map(async (s: Servico) => {
        try {
          const props: Proposta[] = await api.listarPropostasVaga(s.id);
          // Para cada proposta, buscar nome do usuário que enviou
          const propostasComNome = await Promise.all(props.map(async (p) => {
            try {
              const cliente = await api.obterUsuario(p.freelancer_id); // freelancer_id aqui é o cliente que enviou
              return { ...p, nomeCliente: cliente.nome };
            } catch {
              return { ...p, nomeCliente: 'Cliente' };
            }
          }));
          propostasMap[s.id] = propostasComNome;
        } catch { propostasMap[s.id] = []; }
      }));
      setPropostas(propostasMap);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { carregarDados(); }, [usuario]);

  const publicarServico = async () => {
    if (!titulo || !descricao || !orcamento) { Alert.alert('Atenção', 'Preencha todos os campos'); return; }
    if (!usuario) return;
    try {
      setSalvando(true);
      await api.criarVaga(titulo, descricao, categoria, parseFloat(orcamento), usuario.id);
      Alert.alert('✅ Publicado!', 'Seu serviço já está visível para clientes.');
      fecharModal(); carregarDados();
    } catch (e: any) {
      Alert.alert('Erro', e.response?.data?.error || 'Erro ao publicar');
    } finally { setSalvando(false); }
  };

  const excluirServico = (id: number) => {
    Alert.alert('Excluir serviço', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await api.deletarVaga(id); carregarDados(); } },
    ]);
  };

  const responderProposta = async (propostaId: number, status: 'aceita' | 'recusada', vagaId: number) => {
    try {
      setRespondendo(propostaId);
      await api.atualizarStatusProposta(propostaId, status);
      if (status === 'aceita') {
        await api.atualizarVaga(vagaId, { status: 'em_progresso' });
        Alert.alert('✅ Proposta aceita!', 'O serviço foi marcado como em andamento.');
      } else {
        Alert.alert('Proposta recusada.', 'O cliente foi notificado.');
      }
      carregarDados();
    } catch (e: any) {
      Alert.alert('Erro', e.response?.data?.error || 'Erro ao responder');
    } finally { setRespondendo(null); }
  };

  const statusColor: Record<string, string> = {
    aberta: '#10B981', em_progresso: '#F59E0B', finalizada: '#6B7280',
  };
  const propostaStatusColor: Record<string, string> = {
    pendente: '#F59E0B', aceita: '#10B981', recusada: '#EF4444',
  };

  const todasPropostas = Object.entries(propostas).flatMap(([vagaId, props]) =>
    props.map(p => ({ ...p, vagaId: Number(vagaId) }))
  );
  const totalPropostas = todasPropostas.length;
  const pendentes = todasPropostas.filter(p => p.status === 'pendente').length;
  const propostasAceitas = todasPropostas.filter(p => p.status === 'aceita').length;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AnimatedCard delay={0}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Olá, {usuario?.nome?.split(' ')[0]} 👋</Text>
              <Text style={styles.sub}>Gerencie seus serviços e propostas</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={abrirModal}>
              <Text style={styles.addBtnText}>+ Publicar</Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        <AnimatedCard delay={100}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{servicos.length}</Text>
              <Text style={styles.statLabel}>Serviços{'\n'}publicados</Text>
            </View>
            <View style={[styles.statCard, pendentes > 0 && styles.statCardYellow]}>
              <Text style={[styles.statNum, pendentes > 0 && styles.statNumYellow]}>{pendentes}</Text>
              <Text style={styles.statLabel}>Aguardando{'\n'}resposta</Text>
            </View>
            <View style={[styles.statCard, propostasAceitas > 0 && styles.statCardGreen]}>
              <Text style={[styles.statNum, propostasAceitas > 0 && styles.statNumGreen]}>{propostasAceitas}</Text>
              <Text style={styles.statLabel}>Contratos{'\n'}fechados</Text>
            </View>
          </View>
        </AnimatedCard>

        <AnimatedCard delay={150}>
          <View style={styles.abaContainer}>
            <TouchableOpacity style={[styles.aba, abaAtiva === 'servicos' && styles.abaActive]} onPress={() => setAbaAtiva('servicos')}>
              <Text style={[styles.abaText, abaAtiva === 'servicos' && styles.abaTextActive]}>Meus Serviços</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.aba, abaAtiva === 'propostas' && styles.abaActive]} onPress={() => setAbaAtiva('propostas')}>
              <Text style={[styles.abaText, abaAtiva === 'propostas' && styles.abaTextActive]}>
                Propostas {pendentes > 0 ? `(${pendentes} 🔴)` : totalPropostas > 0 ? `(${totalPropostas})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        {loading ? (
          <ActivityIndicator size="large" color="#0A2E73" style={{ marginTop: 40 }} />
        ) : abaAtiva === 'servicos' ? (
          servicos.length === 0 ? (
            <AnimatedCard delay={200}>
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyTitle}>Nenhum serviço ainda</Text>
                <Text style={styles.emptySub}>Publique seu primeiro serviço para aparecer para clientes</Text>
                <TouchableOpacity style={styles.emptyBtn} onPress={abrirModal}>
                  <Text style={styles.emptyBtnText}>Publicar serviço</Text>
                </TouchableOpacity>
              </View>
            </AnimatedCard>
          ) : (
            servicos.map((item, idx) => {
              const propostasDoServico = propostas[item.id] || [];
              const pendentesServico = propostasDoServico.filter(p => p.status === 'pendente').length;
              return (
                <AnimatedCard key={item.id} delay={200 + idx * 80}>
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo}</Text>
                      <View style={[styles.badge, { backgroundColor: statusColor[item.status] + '22' }]}>
                        <Text style={[styles.badgeText, { color: statusColor[item.status] }]}>{item.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardDesc} numberOfLines={2}>{item.descricao}</Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardCategoria}>{item.categoria}</Text>
                      <Text style={styles.cardOrcamento}>R$ {item.orcamento.toLocaleString('pt-BR')}</Text>
                    </View>
                    {propostasDoServico.length > 0 && (
                      <View style={[styles.propostaResumo, pendentesServico > 0 && styles.propostaResumoYellow]}>
                        <Text style={[styles.propostaResumoText, pendentesServico > 0 && styles.propostaResumoTextYellow]}>
                          {pendentesServico > 0
                            ? `🔴 ${pendentesServico} proposta${pendentesServico > 1 ? 's' : ''} aguardando resposta`
                            : `📨 ${propostasDoServico.length} proposta${propostasDoServico.length > 1 ? 's' : ''} recebida${propostasDoServico.length > 1 ? 's' : ''}`
                          }
                          {propostasDoServico.some(p => p.status === 'aceita') ? ' · ✅ Aceita!' : ''}
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => excluirServico(item.id)}>
                      <Text style={styles.deleteBtnText}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                </AnimatedCard>
              );
            })
          )
        ) : (
          // Aba propostas - mostra detalhes com cliente, valor e botões aceitar/recusar
          todasPropostas.length === 0 ? (
            <AnimatedCard delay={200}>
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>📬</Text>
                <Text style={styles.emptyTitle}>Nenhuma proposta ainda</Text>
                <Text style={styles.emptySub}>Quando clientes enviarem propostas para seus serviços, elas aparecerão aqui</Text>
              </View>
            </AnimatedCard>
          ) : (
            todasPropostas.map((p, idx) => {
              const servico = servicos.find(s => s.id === p.vagaId);
              const isRespondendo = respondendo === p.id;
              return (
                <AnimatedCard key={p.id} delay={200 + idx * 80}>
                  <View style={[styles.card, p.status === 'pendente' && styles.cardPendente]}>
                    {/* Serviço relacionado */}
                    <Text style={styles.propostaPara}>Para: <Text style={styles.propostaParaServico}>{servico?.titulo || `Serviço #${p.vagaId}`}</Text></Text>

                    {/* Dados do cliente */}
                    <View style={styles.clienteRow}>
                      <View style={styles.clienteAvatar}>
                        <Text style={styles.clienteAvatarText}>{(p.nomeCliente || 'C')[0].toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.clienteNome}>{p.nomeCliente || 'Cliente'}</Text>
                        <Text style={styles.clienteData}>{new Date(p.criado_em).toLocaleDateString('pt-BR')}</Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: propostaStatusColor[p.status] + '22' }]}>
                        <Text style={[styles.badgeText, { color: propostaStatusColor[p.status] }]}>{p.status}</Text>
                      </View>
                    </View>

                    {/* Mensagem */}
                    <View style={styles.mensagemBox}>
                      <Text style={styles.mensagemText}>"{p.descricao}"</Text>
                    </View>

                    {/* Valor proposto */}
                    <View style={styles.valorRow}>
                      <Text style={styles.valorLabel}>Valor proposto</Text>
                      <Text style={styles.valorText}>R$ {p.valor.toLocaleString('pt-BR')}</Text>
                    </View>

                    {/* Botões aceitar/recusar (só se pendente) */}
                    {p.status === 'pendente' && (
                      <View style={styles.respostaRow}>
                        {isRespondendo ? (
                          <ActivityIndicator color="#0A2E73" style={{ marginVertical: 8 }} />
                        ) : (
                          <>
                            <TouchableOpacity
                              style={styles.btnRecusar}
                              onPress={() => responderProposta(p.id, 'recusada', p.vagaId)}
                            >
                              <Text style={styles.btnRecusarText}>✕ Recusar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.btnAceitar}
                              onPress={() => responderProposta(p.id, 'aceita', p.vagaId)}
                            >
                              <Text style={styles.btnAceitarText}>✓ Aceitar</Text>
                            </TouchableOpacity>
                          </>
                        )}
                      </View>
                    )}
                  </View>
                </AnimatedCard>
              );
            })
          )
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Modal publicar */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={fecharModal}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <TouchableWithoutFeedback>
                <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Publicar Serviço</Text>
                    <TouchableOpacity onPress={fecharModal}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <Text style={styles.fieldLabel}>Título do serviço</Text>
                    <TextInput style={styles.fieldInput} placeholder="Ex: Desenvolvimento de app mobile" placeholderTextColor="#9CA3AF" value={titulo} onChangeText={setTitulo} returnKeyType="done" />
                    <Text style={styles.fieldLabel}>Descrição</Text>
                    <TextInput style={[styles.fieldInput, styles.textarea]} placeholder="Descreva o que você oferece..." placeholderTextColor="#9CA3AF" value={descricao} onChangeText={setDescricao} multiline numberOfLines={4} textAlignVertical="top" returnKeyType="done" blurOnSubmit={true} />
                    <Text style={styles.fieldLabel}>Categoria</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                      {CATEGORIAS.map(c => (
                        <TouchableOpacity key={c} style={[styles.catChip, categoria === c && styles.catChipActive]} onPress={() => setCategoria(c)}>
                          <Text style={[styles.catChipText, categoria === c && styles.catChipTextActive]}>{c.charAt(0).toUpperCase() + c.slice(1)}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <Text style={styles.fieldLabel}>Valor (R$)</Text>
                    <View style={styles.inputComBotao}>
                      <TextInput
                        style={[styles.fieldInput, { flex: 1 }]}
                        placeholder="0,00"
                        placeholderTextColor="#9CA3AF"
                        value={orcamento}
                        onChangeText={setOrcamento}
                        keyboardType="numeric"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                      <TouchableOpacity style={styles.btnConcluido} onPress={Keyboard.dismiss}>
                        <Text style={styles.btnConcluidoText}>OK</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.publishBtn} onPress={publicarServico} disabled={salvando}>
                      {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishBtnText}>Publicar Serviço</Text>}
                    </TouchableOpacity>
                  </ScrollView>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 28, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  greeting: { fontSize: 22, fontWeight: '700', color: '#0A2E73' },
  sub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  addBtn: { backgroundColor: '#0A2E73', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  statsRow: { flexDirection: 'row', margin: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  statCardGreen: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  statCardYellow: { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' },
  statNum: { fontSize: 22, fontWeight: '800', color: '#0A2E73' },
  statNumGreen: { color: '#10B981' },
  statNumYellow: { color: '#D97706' },
  statLabel: { fontSize: 11, color: '#6B7280', marginTop: 2, textAlign: 'center' },
  abaContainer: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, backgroundColor: '#E2E8F0', borderRadius: 10, padding: 4 },
  aba: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  abaActive: { backgroundColor: '#FFFFFF', elevation: 2 },
  abaText: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  abaTextActive: { color: '#0A2E73' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, marginHorizontal: 16, marginBottom: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  cardPendente: { borderColor: '#F59E0B', borderWidth: 1.5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  cardDesc: { fontSize: 13, color: '#6B7280', lineHeight: 18, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardCategoria: { fontSize: 12, color: '#6B21FF', fontWeight: '600', textTransform: 'capitalize' },
  cardOrcamento: { fontSize: 14, fontWeight: '700', color: '#0A2E73' },
  propostaResumo: { marginTop: 10, backgroundColor: '#EEF2FF', borderRadius: 8, padding: 8 },
  propostaResumoYellow: { backgroundColor: '#FFFBEB' },
  propostaResumoText: { fontSize: 12, color: '#4338CA', fontWeight: '600' },
  propostaResumoTextYellow: { color: '#D97706' },
  deleteBtn: { marginTop: 12, alignSelf: 'flex-start' },
  deleteBtnText: { fontSize: 13, color: '#EF4444', fontWeight: '600' },
  // Proposta card
  propostaPara: { fontSize: 12, color: '#9CA3AF', marginBottom: 10 },
  propostaParaServico: { color: '#0A2E73', fontWeight: '700' },
  clienteRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  clienteAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#0A2E73', justifyContent: 'center', alignItems: 'center' },
  clienteAvatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  clienteNome: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  clienteData: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },
  mensagemBox: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#6B21FF' },
  mensagemText: { fontSize: 13, color: '#374151', fontStyle: 'italic', lineHeight: 18 },
  valorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  valorLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  valorText: { fontSize: 18, fontWeight: '800', color: '#059669' },
  respostaRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btnRecusar: { flex: 1, borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  btnRecusarText: { color: '#EF4444', fontWeight: '700', fontSize: 13 },
  btnAceitar: { flex: 1, backgroundColor: '#059669', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  btnAceitarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  // Empty
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  emptySub: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emptyBtn: { backgroundColor: '#0A2E73', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  emptyBtnText: { color: '#fff', fontWeight: '700' },
  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  closeBtn: { fontSize: 18, color: '#9CA3AF', padding: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  inputComBotao: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnConcluido: { backgroundColor: '#0A2E73', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12 },
  btnConcluidoText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  fieldInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1F2937' },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  catChip: { marginRight: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' },
  catChipActive: { backgroundColor: '#0A2E73', borderColor: '#0A2E73' },
  catChipText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  catChipTextActive: { color: '#FFFFFF' },
  publishBtn: { backgroundColor: '#0A2E73', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 24, marginBottom: 8 },
  publishBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});