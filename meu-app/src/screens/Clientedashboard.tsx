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
  usuario_id: number;
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
}

interface Contrato {
  servico: Servico;
  proposta?: Proposta;
}

const CATEGORIAS = ['all', 'desenvolvimento', 'design', 'marketing', 'escrita', 'outros'];

const AnimatedCard = ({ children, delay = 0, style }: any) => {
  const anim = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(18)).current;
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

export const ClienteDashboard: React.FC = () => {
  const { usuario } = useAuth();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [filtrados, setFiltrados] = useState<Servico[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('all');
  const [abaAtiva, setAbaAtiva] = useState<'explorar' | 'meus'>('explorar');

  // Modal contra-proposta
  const [modalProposta, setModalProposta] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [valorProposta, setValorProposta] = useState('');
  const [descProposta, setDescProposta] = useState('');
  const [enviandoProposta, setEnviandoProposta] = useState(false);
  const slideModal = useRef(new Animated.Value(400)).current;

  // Modal pagamento
  const [modalPagamento, setModalPagamento] = useState(false);
  const [contratoPagamento, setContratoPagamento] = useState<Contrato | null>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<'cartao' | 'pix' | 'boleto'>('pix');
  const [processandoPagamento, setProcessandoPagamento] = useState(false);
  const slidePagamento = useRef(new Animated.Value(400)).current;

  const abrirModalProposta = (servico: Servico) => {
    setServicoSelecionado(servico);
    setModalProposta(true);
    Animated.spring(slideModal, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }).start();
  };
  const fecharModalProposta = () => {
    Animated.timing(slideModal, { toValue: 400, duration: 200, useNativeDriver: true }).start(() => {
      setModalProposta(false); setValorProposta(''); setDescProposta('');
    });
  };

  const abrirModalPagamento = (contrato: Contrato) => {
    setContratoPagamento(contrato);
    setModalPagamento(true);
    Animated.spring(slidePagamento, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }).start();
  };
  const fecharModalPagamento = () => {
    Animated.timing(slidePagamento, { toValue: 400, duration: 200, useNativeDriver: true }).start(() => {
      setModalPagamento(false);
    });
  };

  const carregarDados = async () => {
    if (!usuario) return;
    try {
      setLoading(true);
      const todos = await api.listarVagas();

      // Serviços abertos publicados por freelancers (não pelo próprio cliente)
      const disponiveis = todos.filter((s: Servico) => s.status === 'aberta' && s.usuario_id !== usuario.id);
      setServicos(disponiveis);

      // Contratos: serviços em_progresso onde o cliente enviou proposta aceita
      // Buscamos propostas enviadas pelo cliente (usando usuario.id como freelancer_id no contexto de proposta de cliente)
      const minhasPropostas = await api.listarPropostasFreelancer(usuario.id);
      const propostasAceitas = minhasPropostas.filter((p: Proposta) => p.status === 'aceita');

      // Também pegar serviços em_progresso do sistema
      const emProgresso = todos.filter((s: Servico) => s.status === 'em_progresso');

      // Montar contratos combinando
      const contratosMap: Record<number, Contrato> = {};
      for (const s of emProgresso) {
        const propostaRelacionada = propostasAceitas.find((p: Proposta) => p.vaga_id === s.id);
        contratosMap[s.id] = { servico: s, proposta: propostaRelacionada };
      }
      // Também incluir serviços onde o cliente tem proposta aceita mesmo não em_progresso
      for (const p of propostasAceitas) {
        if (!contratosMap[p.vaga_id]) {
          const s = todos.find((sv: Servico) => sv.id === p.vaga_id);
          if (s) contratosMap[p.vaga_id] = { servico: s, proposta: p };
        }
      }
      setContratos(Object.values(contratosMap));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { carregarDados(); }, [usuario]);

  useEffect(() => {
    let result = servicos;
    if (busca) result = result.filter(s => s.titulo.toLowerCase().includes(busca.toLowerCase()) || s.descricao.toLowerCase().includes(busca.toLowerCase()));
    if (categoria !== 'all') result = result.filter(s => s.categoria === categoria);
    setFiltrados(result);
  }, [servicos, busca, categoria]);

  const contratar = async (servico: Servico) => {
    if (!usuario) return;
    Alert.alert(
      'Contratar serviço',
      `Contratar "${servico.titulo}" por R$ ${servico.orcamento.toLocaleString('pt-BR')}?\n\nIsso marcará o serviço como em andamento.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Contratar', onPress: async () => {
            try {
              await api.atualizarVaga(servico.id, { status: 'em_progresso' });
              // Criar proposta aceita automaticamente para rastrear o contrato
              await api.enviarProposta(servico.id, usuario.id, servico.orcamento, 'Contratação direta');
              const novasProp = await api.listarPropostasVaga(servico.id);
              if (novasProp.length > 0) {
                await api.atualizarStatusProposta(novasProp[novasProp.length - 1].id, 'aceita');
              }
              Alert.alert('✅ Contratado!', 'O serviço agora aparece em seus contratos.');
              carregarDados();
              setAbaAtiva('meus');
            } catch (e: any) {
              Alert.alert('Erro', e.response?.data?.error || 'Erro ao contratar');
            }
          }
        }
      ]
    );
  };

  const enviarContraproposta = async () => {
    if (!servicoSelecionado || !valorProposta || !descProposta) {
      Alert.alert('Atenção', 'Preencha valor e descrição'); return;
    }
    if (!usuario) return;
    try {
      setEnviandoProposta(true);
      await api.enviarProposta(servicoSelecionado.id, usuario.id, parseFloat(valorProposta), descProposta);
      Alert.alert('📨 Enviada!', 'Sua proposta foi enviada ao freelancer.');
      fecharModalProposta();
      carregarDados();
    } catch (e: any) {
      Alert.alert('Erro', e.response?.data?.error || 'Erro ao enviar');
    } finally { setEnviandoProposta(false); }
  };

  const realizarPagamento = async () => {
    if (!contratoPagamento || !usuario) return;
    try {
      setProcessandoPagamento(true);
      const valor = contratoPagamento.proposta?.valor || contratoPagamento.servico.orcamento;
      await api.criarPagamento(
        contratoPagamento.servico.id,
        usuario.id,
        contratoPagamento.servico.usuario_id,
        valor,
        metodoPagamento
      );
      await api.atualizarVaga(contratoPagamento.servico.id, { status: 'finalizada' });
      Alert.alert('💳 Pagamento realizado!', `R$ ${valor.toLocaleString('pt-BR')} enviado com sucesso via ${metodoPagamento.toUpperCase()}.`);
      fecharModalPagamento();
      carregarDados();
    } catch (e: any) {
      Alert.alert('Erro', e.response?.data?.error || 'Erro ao processar pagamento');
    } finally { setProcessandoPagamento(false); }
  };

  const metodoIcons: Record<string, string> = { pix: '⚡', cartao: '💳', boleto: '🏦' };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AnimatedCard delay={0}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Olá, {usuario?.nome?.split(' ')[0]} 👋</Text>
              <Text style={styles.sub}>Encontre o profissional ideal</Text>
            </View>
          </View>
        </AnimatedCard>

        <AnimatedCard delay={80}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{servicos.length}</Text>
              <Text style={styles.statLabel}>Serviços{'\n'}disponíveis</Text>
            </View>
            <View style={[styles.statCard, contratos.length > 0 && styles.statCardGreen]}>
              <Text style={[styles.statNum, contratos.length > 0 && styles.statNumGreen]}>{contratos.length}</Text>
              <Text style={styles.statLabel}>Contratos{'\n'}ativos</Text>
            </View>
          </View>
        </AnimatedCard>

        <AnimatedCard delay={130}>
          <View style={styles.abaContainer}>
            <TouchableOpacity style={[styles.aba, abaAtiva === 'explorar' && styles.abaActive]} onPress={() => setAbaAtiva('explorar')}>
              <Text style={[styles.abaText, abaAtiva === 'explorar' && styles.abaTextActive]}>Explorar Serviços</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.aba, abaAtiva === 'meus' && styles.abaActive]} onPress={() => setAbaAtiva('meus')}>
              <Text style={[styles.abaText, abaAtiva === 'meus' && styles.abaTextActive]}>
                Meus Contratos {contratos.length > 0 ? `(${contratos.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        {abaAtiva === 'explorar' ? (
          <>
            <AnimatedCard delay={180}>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput style={styles.searchInput} placeholder="Buscar serviços..." placeholderTextColor="#9CA3AF" value={busca} onChangeText={setBusca} />
              </View>
            </AnimatedCard>

            <AnimatedCard delay={220}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtros}>
                {CATEGORIAS.map(c => (
                  <TouchableOpacity key={c} style={[styles.filtroChip, categoria === c && styles.filtroChipActive]} onPress={() => setCategoria(c)}>
                    <Text style={[styles.filtroChipText, categoria === c && styles.filtroChipTextActive]}>
                      {c === 'all' ? 'Todas' : c.charAt(0).toUpperCase() + c.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </AnimatedCard>

            {loading ? (
              <ActivityIndicator size="large" color="#0A2E73" style={{ marginTop: 40 }} />
            ) : filtrados.length === 0 ? (
              <AnimatedCard delay={260}>
                <View style={styles.empty}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyTitle}>Nenhum serviço encontrado</Text>
                  <Text style={styles.emptySub}>Tente ajustar os filtros</Text>
                </View>
              </AnimatedCard>
            ) : (
              filtrados.map((item, idx) => (
                <AnimatedCard key={item.id} delay={260 + idx * 70}>
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo}</Text>
                      <View style={styles.budgetBadge}>
                        <Text style={styles.budgetText}>R$ {item.orcamento.toLocaleString('pt-BR')}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardDesc} numberOfLines={3}>{item.descricao}</Text>
                    <Text style={styles.cardCategoria}>{item.categoria}</Text>
                    <View style={styles.cardBtns}>
                      <TouchableOpacity style={styles.btnContraproposta} onPress={() => abrirModalProposta(item)}>
                        <Text style={styles.btnContrapropostaText}>💬 Proposta</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnContratar} onPress={() => contratar(item)}>
                        <Text style={styles.btnContratarText}>✅ Contratar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </AnimatedCard>
              ))
            )}
          </>
        ) : (
          contratos.length === 0 ? (
            <AnimatedCard delay={180}>
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>📂</Text>
                <Text style={styles.emptyTitle}>Nenhum contrato ativo</Text>
                <Text style={styles.emptySub}>Explore e contrate serviços para vê-los aqui</Text>
                <TouchableOpacity style={styles.emptyBtn} onPress={() => setAbaAtiva('explorar')}>
                  <Text style={styles.emptyBtnText}>Explorar serviços</Text>
                </TouchableOpacity>
              </View>
            </AnimatedCard>
          ) : (
            contratos.map((contrato, idx) => (
              <AnimatedCard key={contrato.servico.id} delay={180 + idx * 70}>
                <View style={[styles.card, styles.cardContratado]}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{contrato.servico.titulo}</Text>
                    <View style={styles.contratadoBadge}>
                      <Text style={styles.contratadoBadgeText}>🔄 Em andamento</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDesc}>{contrato.servico.descricao}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardCategoria}>{contrato.servico.categoria}</Text>
                    <Text style={styles.budgetText}>
                      R$ {(contrato.proposta?.valor || contrato.servico.orcamento).toLocaleString('pt-BR')}
                    </Text>
                  </View>
                  {contrato.proposta && (
                    <View style={styles.propostaInfo}>
                      <Text style={styles.propostaInfoText}>📝 {contrato.proposta.descricao}</Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.btnPagar} onPress={() => abrirModalPagamento(contrato)}>
                    <Text style={styles.btnPagarText}>💳 Realizar Pagamento</Text>
                  </TouchableOpacity>
                </View>
              </AnimatedCard>
            ))
          )
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Modal contra-proposta */}
      <Modal visible={modalProposta} transparent animationType="fade" onRequestClose={fecharModalProposta}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <TouchableWithoutFeedback>
                <Animated.View style={[styles.modal, { transform: [{ translateY: slideModal }] }]}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Enviar Proposta</Text>
                    <TouchableOpacity onPress={fecharModalProposta}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
                  </View>
                  <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    {servicoSelecionado && (
                      <View style={styles.servicoInfo}>
                        <Text style={styles.servicoInfoTitulo}>{servicoSelecionado.titulo}</Text>
                        <Text style={styles.servicoInfoPreco}>Valor anunciado: R$ {servicoSelecionado.orcamento.toLocaleString('pt-BR')}</Text>
                      </View>
                    )}
                    <Text style={styles.fieldLabel}>Seu valor proposto (R$)</Text>
                    <View style={styles.inputComBotao}>
                      <TextInput
                        style={[styles.fieldInput, { flex: 1 }]}
                        placeholder="Ex: 1500"
                        placeholderTextColor="#9CA3AF"
                        value={valorProposta}
                        onChangeText={setValorProposta}
                        keyboardType="numeric"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                      <TouchableOpacity style={styles.btnConcluido} onPress={Keyboard.dismiss}>
                        <Text style={styles.btnConcluidoText}>OK</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.fieldLabel}>Mensagem para o freelancer</Text>
                    <TextInput
                      style={[styles.fieldInput, styles.textarea]}
                      placeholder="Explique sua proposta..."
                      placeholderTextColor="#9CA3AF"
                      value={descProposta}
                      onChangeText={setDescProposta}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      returnKeyType="done"
                      blurOnSubmit={true}
                    />
                    <TouchableOpacity style={styles.publishBtn} onPress={enviarContraproposta} disabled={enviandoProposta}>
                      {enviandoProposta ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishBtnText}>Enviar Proposta</Text>}
                    </TouchableOpacity>
                  </ScrollView>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal pagamento */}
      <Modal visible={modalPagamento} transparent animationType="fade" onRequestClose={fecharModalPagamento}>
        <View style={styles.overlay}>
          <Animated.View style={[styles.modal, { transform: [{ translateY: slidePagamento }] }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Realizar Pagamento</Text>
              <TouchableOpacity onPress={fecharModalPagamento}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
            </View>
            {contratoPagamento && (
              <>
                <View style={styles.servicoInfo}>
                  <Text style={styles.servicoInfoTitulo}>{contratoPagamento.servico.titulo}</Text>
                  <Text style={styles.valorTotal}>
                    R$ {(contratoPagamento.proposta?.valor || contratoPagamento.servico.orcamento).toLocaleString('pt-BR')}
                  </Text>
                </View>
                <Text style={styles.fieldLabel}>Método de pagamento</Text>
                <View style={styles.metodosRow}>
                  {(['pix', 'cartao', 'boleto'] as const).map(m => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.metodoBtn, metodoPagamento === m && styles.metodoBtnActive]}
                      onPress={() => setMetodoPagamento(m)}
                    >
                      <Text style={styles.metodoIcon}>{metodoIcons[m]}</Text>
                      <Text style={[styles.metodoText, metodoPagamento === m && styles.metodoTextActive]}>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {metodoPagamento === 'pix' && (
                  <View style={styles.pixInfo}>
                    <Text style={styles.pixInfoText}>⚡ Pagamento instantâneo via Pix. Confirmação em segundos.</Text>
                  </View>
                )}
                {metodoPagamento === 'cartao' && (
                  <View style={styles.pixInfo}>
                    <Text style={styles.pixInfoText}>💳 Pagamento seguro via cartão de crédito/débito.</Text>
                  </View>
                )}
                {metodoPagamento === 'boleto' && (
                  <View style={styles.pixInfo}>
                    <Text style={styles.pixInfoText}>🏦 Boleto bancário. Prazo de 1-3 dias úteis.</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.pagarBtn} onPress={realizarPagamento} disabled={processandoPagamento}>
                  {processandoPagamento
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.pagarBtnText}>Confirmar Pagamento</Text>
                  }
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: { padding: 20, paddingTop: 28, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  greeting: { fontSize: 22, fontWeight: '700', color: '#0A2E73' },
  sub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  statsRow: { flexDirection: 'row', margin: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  statCardGreen: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  statNum: { fontSize: 22, fontWeight: '800', color: '#0A2E73' },
  statNumGreen: { color: '#10B981' },
  statLabel: { fontSize: 11, color: '#6B7280', marginTop: 2, textAlign: 'center' },
  abaContainer: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, backgroundColor: '#E2E8F0', borderRadius: 10, padding: 4 },
  aba: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  abaActive: { backgroundColor: '#FFFFFF', elevation: 2 },
  abaText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  abaTextActive: { color: '#0A2E73' },
  searchBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 4, backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#1F2937' },
  filtros: { paddingHorizontal: 16, paddingVertical: 10 },
  filtroChip: { marginRight: 8, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' },
  filtroChipActive: { backgroundColor: '#059669', borderColor: '#059669' },
  filtroChipText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  filtroChipTextActive: { color: '#FFFFFF' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, marginHorizontal: 16, marginBottom: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  cardContratado: { borderColor: '#10B981', borderWidth: 1.5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', flex: 1, marginRight: 8 },
  budgetBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  budgetText: { fontSize: 13, fontWeight: '700', color: '#1E40AF' },
  cardDesc: { fontSize: 13, color: '#6B7280', lineHeight: 18, marginBottom: 8 },
  cardCategoria: { fontSize: 12, color: '#6B21FF', fontWeight: '600', textTransform: 'capitalize', marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardBtns: { flexDirection: 'row', gap: 10 },
  btnContraproposta: { flex: 1, borderWidth: 1.5, borderColor: '#0A2E73', borderRadius: 8, paddingVertical: 9, alignItems: 'center' },
  btnContrapropostaText: { color: '#0A2E73', fontWeight: '600', fontSize: 13 },
  btnContratar: { flex: 1, backgroundColor: '#059669', borderRadius: 8, paddingVertical: 9, alignItems: 'center' },
  btnContratarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  contratadoBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  contratadoBadgeText: { fontSize: 12, fontWeight: '700', color: '#065F46' },
  propostaInfo: { backgroundColor: '#F0F4FF', borderRadius: 8, padding: 10, marginTop: 8, marginBottom: 12 },
  propostaInfoText: { fontSize: 13, color: '#374151' },
  btnPagar: { backgroundColor: '#0A2E73', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  btnPagarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  emptySub: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emptyBtn: { backgroundColor: '#059669', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  emptyBtnText: { color: '#fff', fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  closeBtn: { fontSize: 18, color: '#9CA3AF', padding: 4 },
  servicoInfo: { backgroundColor: '#F0F4FF', borderRadius: 10, padding: 14, marginBottom: 8 },
  servicoInfoTitulo: { fontSize: 15, fontWeight: '700', color: '#0A2E73', marginBottom: 4 },
  servicoInfoPreco: { fontSize: 13, color: '#6B7280' },
  valorTotal: { fontSize: 22, fontWeight: '800', color: '#059669', marginTop: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  inputComBotao: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnConcluido: { backgroundColor: '#0A2E73', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12 },
  btnConcluidoText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  fieldInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1F2937' },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  metodosRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  metodoBtn: { flex: 1, backgroundColor: '#F9FAFB', borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  metodoBtnActive: { borderColor: '#0A2E73', backgroundColor: '#EEF2FF' },
  metodoIcon: { fontSize: 24, marginBottom: 4 },
  metodoText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  metodoTextActive: { color: '#0A2E73' },
  pixInfo: { backgroundColor: '#F0FDF4', borderRadius: 8, padding: 12, marginTop: 12 },
  pixInfoText: { fontSize: 13, color: '#065F46' },
  pagarBtn: { backgroundColor: '#059669', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20, marginBottom: 8 },
  pagarBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  publishBtn: { backgroundColor: '#059669', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20, marginBottom: 8 },
  publishBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});