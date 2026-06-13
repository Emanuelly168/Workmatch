import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Animated,
} from 'react-native';
import { useAuth } from '../contexts/Authcontext';
import api from '../services/api';

export const ProfileScreen: React.FC = () => {
  const { usuario, setUsuario, logout } = useAuth();
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(usuario?.nome || '');
  const [telefone, setTelefone] = useState(usuario?.telefone || '');
  const [descricao, setDescricao] = useState(usuario?.descricao || '');
  const [salvando, setSalvando] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animarBotao = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const salvarPerfil = async () => {
    if (!usuario) return;
    animarBotao();
    try {
      setSalvando(true);
      await api.atualizarPerfil(usuario.id, { nome, telefone, descricao });
      setUsuario({ ...usuario, nome, telefone, descricao });
      setEditando(false);
      Alert.alert('Salvo!', 'Perfil atualizado com sucesso.');
    } catch (e: any) {
      Alert.alert('Erro', e.response?.data?.error || 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  };

  const confirmarLogout = () => {
    Alert.alert('Sair', 'Deseja fazer logout?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  if (!usuario) return null;

  const iniciais = usuario.nome
    .split(' ')
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase();

  const tipoLabel = usuario.tipo === 'freelancer' ? 'Freelancer' : 'Cliente';
  const tipoColor = usuario.tipo === 'freelancer' ? '#7C3AED' : '#059669';
  const tipoBg = usuario.tipo === 'freelancer' ? '#EDE9FE' : '#D1FAE5';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Avatar e nome */}
      <View style={styles.hero}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{iniciais}</Text>
        </View>
        <View style={[styles.tipoBadge, { backgroundColor: tipoBg }]}>
          <Text style={[styles.tipoBadgeText, { color: tipoColor }]}>{tipoLabel}</Text>
        </View>
        {!editando ? (
          <>
            <Text style={styles.heroNome}>{usuario.nome}</Text>
            <Text style={styles.heroEmail}>{usuario.email}</Text>
          </>
        ) : (
          <Text style={styles.heroEmail}>{usuario.email}</Text>
        )}
      </View>

      {/* Card de informações */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Informações</Text>
          {!editando && (
            <TouchableOpacity onPress={() => setEditando(true)} style={styles.editarBtn}>
              <Text style={styles.editarBtnText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        {editando ? (
          <>
            <Text style={styles.fieldLabel}>Nome</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholderTextColor="#9CA3AF" />

            <Text style={styles.fieldLabel}>Telefone</Text>
            <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(11) 99999-9999" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" />

            <Text style={styles.fieldLabel}>Sobre mim</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Fale um pouco sobre você..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.editBtns}>
              <TouchableOpacity style={styles.cancelarBtn} onPress={() => { setEditando(false); setNome(usuario.nome); setTelefone(usuario.telefone || ''); setDescricao(usuario.descricao || ''); }}>
                <Text style={styles.cancelarBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <Animated.View style={[{ flex: 1 }, { transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity style={styles.salvarBtn} onPress={salvarPerfil} disabled={salvando}>
                  {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.salvarBtnText}>Salvar</Text>}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </>
        ) : (
          <>
            <InfoRow label="Email" value={usuario.email} />
            <InfoRow label="Telefone" value={usuario.telefone || 'Não informado'} />
            <InfoRow label="Sobre" value={usuario.descricao || 'Nenhuma descrição ainda'} />
            <InfoRow label="Tipo de conta" value={tipoLabel} />
            <InfoRow label="ID" value={`#${usuario.id}`} />
          </>
        )}
      </View>

      {/* Botão de logout */}
      {!editando && (
        <TouchableOpacity style={styles.logoutBtn} onPress={confirmarLogout}>
          <Text style={styles.logoutBtnText}>Sair da conta</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  hero: { alignItems: 'center', paddingVertical: 36, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  tipoBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 10 },
  tipoBadgeText: { fontSize: 12, fontWeight: '700' },
  heroNome: { fontSize: 22, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  heroEmail: { fontSize: 14, color: '#6B7280' },
  card: { margin: 16, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  editarBtn: { backgroundColor: '#EFF6FF', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  editarBtnText: { color: '#3B82F6', fontWeight: '600', fontSize: 13 },
  infoRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  infoLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 14, color: '#1F2937', fontWeight: '500' },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1F2937' },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  editBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelarBtn: { flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  cancelarBtnText: { color: '#6B7280', fontWeight: '600' },
  salvarBtn: { backgroundColor: '#3B82F6', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  salvarBtnText: { color: '#FFFFFF', fontWeight: '700' },
  logoutBtn: { marginHorizontal: 16, marginTop: 8, borderWidth: 1, borderColor: '#FCA5A5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', backgroundColor: '#FFF5F5' },
  logoutBtnText: { color: '#DC2626', fontWeight: '600', fontSize: 15 },
});
