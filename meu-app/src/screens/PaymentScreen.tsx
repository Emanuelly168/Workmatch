import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  last4?: string;
  icon: string;
}

interface PaymentScreenProps {
  route?: any;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ route }) => {
  const navigation = useNavigation<any>();
  const { usuario } = useAuth();
  const amount = route?.params?.amount || 2500;
  const vagaId = route?.params?.vagaId || 1;
  const clienteId = route?.params?.clienteId || usuario?.id || 1;
  const freelancerId = route?.params?.freelancerId || usuario?.id || 2;
  const projectTitle = route?.params?.projectTitle || 'Projeto WorkMatch';

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [bankData, setBankData] = useState({
    bankName: '',
    accountNumber: '',
    accountType: 'checking',
    cpf: '',
  });
  const [successAnimation] = useState(new Animated.Value(0));

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      name: 'Cartão de Crédito',
      last4: '4242',
      icon: '💳',
    },
    {
      id: 'bank',
      type: 'bank',
      name: 'Transferência Bancária',
      icon: '🏦',
    },
    {
      id: 'wallet',
      type: 'wallet',
      name: 'Carteira Digital',
      icon: '📱',
    },
  ];

  const calculateFees = () => {
    const platformFee = amount * 0.1;
    const paymentFee =
      selectedPaymentMethod === 'card' ? amount * 0.029 : amount * 0.01;
    const total = amount + platformFee + paymentFee;

    return {
      subtotal: amount,
      platformFee: platformFee.toFixed(2),
      paymentFee: paymentFee.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleProcessPayment = async () => {
    // Validation
    if (selectedPaymentMethod === 'card') {
      if (
        !cardData.cardNumber ||
        !cardData.cardName ||
        !cardData.expiryDate ||
        !cardData.cvv
      ) {
        Alert.alert('Erro', 'Por favor, preencha todos os dados do cartão');
        return;
      }
    } else if (selectedPaymentMethod === 'bank') {
      if (!bankData.bankName || !bankData.accountNumber || !bankData.cpf) {
        Alert.alert('Erro', 'Por favor, preencha todos os dados bancários');
        return;
      }
    }

    try {
      setLoading(true);

      // Criar pagamento via API
      const pagamento = await api.criarPagamento(
        vagaId,
        clienteId,
        freelancerId,
        parseFloat(amount),
        selectedPaymentMethod
      );

      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Atualizar status para processando
      await api.atualizarStatusPagamento(pagamento.id, 'processando');

      // Success animation
      Animated.timing(successAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setShowPaymentModal(false);

      // Show success screen
      setTimeout(() => {
        Alert.alert('Sucesso', 'Pagamento processado com sucesso!');
        navigation.replace('Home');
      }, 1500);
    } catch (error: any) {
      const mensagem = error.response?.data?.error || 'Erro ao processar pagamento';
      Alert.alert('Erro', mensagem);
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fees = calculateFees();

  const renderCardPayment = () => (
    <View style={styles.paymentForm}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Número do Cartão</Text>
        <TextInput
          style={styles.input}
          placeholder="0000 0000 0000 0000"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={19}
          value={formatCardNumber(cardData.cardNumber)}
          onChangeText={value =>
            setCardData({ ...cardData, cardNumber: value })
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome do Titular</Text>
        <TextInput
          style={styles.input}
          placeholder="NOME COMPLETO"
          placeholderTextColor="#9CA3AF"
          value={cardData.cardName}
          onChangeText={value => setCardData({ ...cardData, cardName: value })}
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
          <Text style={styles.label}>Data de Validade</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/AA"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={5}
            value={formatExpiryDate(cardData.expiryDate)}
            onChangeText={value =>
              setCardData({ ...cardData, expiryDate: value })
            }
          />
        </View>

        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="***"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            value={cardData.cvv}
            onChangeText={value => setCardData({ ...cardData, cvv: value })}
          />
        </View>
      </View>

      <View style={styles.securityNote}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          Seus dados de cartão são criptografados e processados com segurança.
        </Text>
      </View>
    </View>
  );

  const renderBankPayment = () => (
    <View style={styles.paymentForm}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Banco</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Banco do Brasil, Itaú, Bradesco..."
          placeholderTextColor="#9CA3AF"
          value={bankData.bankName}
          onChangeText={value =>
            setBankData({ ...bankData, bankName: value })
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tipo de Conta</Text>
        <View style={styles.accountTypeContainer}>
          {['checking', 'savings'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.accountTypeButton,
                bankData.accountType === type &&
                  styles.accountTypeButtonActive,
              ]}
              onPress={() =>
                setBankData({ ...bankData, accountType: type })
              }
            >
              <Text
                style={[
                  styles.accountTypeText,
                  bankData.accountType === type &&
                    styles.accountTypeTextActive,
                ]}
              >
                {type === 'checking' ? 'Corrente' : 'Poupança'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Número da Conta</Text>
        <TextInput
          style={styles.input}
          placeholder="0000000-0"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={bankData.accountNumber}
          onChangeText={value =>
            setBankData({ ...bankData, accountNumber: value })
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          placeholder="000.000.000-00"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={bankData.cpf}
          onChangeText={value => setBankData({ ...bankData, cpf: value })}
        />
      </View>

      <View style={styles.bankNote}>
        <Text style={styles.bankNoteIcon}>ℹ️</Text>
        <Text style={styles.bankNoteText}>
          Você receberá o dinheiro em 1-2 dias úteis após a aprovação do
          pagamento.
        </Text>
      </View>
    </View>
  );

  const renderWalletPayment = () => (
    <View style={styles.paymentForm}>
      <View style={styles.walletContainer}>
        <Text style={styles.walletIcon}>📱</Text>
        <Text style={styles.walletTitle}>WorkMatch Wallet</Text>
        <Text style={styles.walletDescription}>
          Use seu saldo disponível na carteira WorkMatch
        </Text>

        <View style={styles.walletBalance}>
          <Text style={styles.walletBalanceLabel}>Saldo Disponível:</Text>
          <Text style={styles.walletBalanceAmount}>R$ 1.250,00</Text>
        </View>

        <View style={styles.walletInfo}>
          <Text style={styles.walletInfoText}>
            Você tem saldo suficiente para esta transação.
          </Text>
        </View>

        <TouchableOpacity style={styles.addFundsButton}>
          <Text style={styles.addFundsButtonText}>+ Adicionar Fundos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pagamento</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Project Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{projectTitle}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Valor do Projeto:</Text>
              <Text style={styles.summaryValue}>
                R$ {amount.toFixed(2).replace('.', ',')}
              </Text>
            </View>
          </View>
        </View>

        {/* metodo de pagamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>

          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === method.id &&
                  styles.paymentMethodCardActive,
              ]}
              onPress={() => handlePaymentMethodSelect(method.id)}
            >
              <View style={styles.methodIconContainer}>
                <Text style={styles.methodIcon}>{method.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodName}>{method.name}</Text>
                {method.last4 && (
                  <Text style={styles.methodDetails}>
                    Terminado em {method.last4}
                  </Text>
                )}
              </View>
              {selectedPaymentMethod === method.id && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* form pagamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes do Pagamento</Text>

          {selectedPaymentMethod === 'card' && renderCardPayment()}
          {selectedPaymentMethod === 'bank' && renderBankPayment()}
          {selectedPaymentMethod === 'wallet' && renderWalletPayment()}
        </View>

        {/* Fee Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo de Valores</Text>

          <View style={styles.feeBreakdown}>
            <View style={styles.feeItem}>
              <Text style={styles.feeLabel}>Valor do Projeto:</Text>
              <Text style={styles.feeValue}>
                R$ {fees.subtotal.toFixed(2).replace('.', ',')}
              </Text>
            </View>

            <View style={styles.feeItem}>
              <Text style={styles.feeLabel}>Taxa WorkMatch (10%):</Text>
              <Text style={styles.feeValue}>
                R$ {parseFloat(fees.platformFee).toFixed(2).replace('.', ',')}
              </Text>
            </View>

            {selectedPaymentMethod === 'card' && (
              <View style={styles.feeItem}>
                <Text style={styles.feeLabel}>Taxa de Processamento (2,9%):</Text>
                <Text style={styles.feeValue}>
                  R$ {parseFloat(fees.paymentFee).toFixed(2).replace('.', ',')}
                </Text>
              </View>
            )}

            <View style={[styles.feeItem, styles.feeItemTotal]}>
              <Text style={styles.feeLabelTotal}>Total:</Text>
              <Text style={styles.feeValueTotal}>
                R$ {parseFloat(fees.total).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          </View>
        </View>

        {/* termos */}
        <View style={styles.termsSection}>
          <View style={styles.termsCheckbox}>
            <TouchableOpacity style={styles.checkbox}>
              <Text style={styles.checkboxCheck}>✓</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>
              Li e concordo com os{' '}
              <Text style={styles.termsLink}>Termos de Serviço</Text> e{' '}
              <Text style={styles.termsLink}>Política de Privacidade</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* botao de pagamento */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => setShowPaymentModal(true)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.payButtonText}>
              Confirmar Pagamento - R${' '}
              {parseFloat(fees.total).toFixed(2).replace('.', ',')}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* confirmacao */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Pagamento</Text>

            <View style={styles.confirmationDetails}>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Valor:</Text>
                <Text style={styles.confirmationValue}>
                  R$ {parseFloat(fees.total).toFixed(2).replace('.', ',')}
                </Text>
              </View>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Projeto:</Text>
                <Text style={styles.confirmationValue}>{projectTitle}</Text>
              </View>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Forma de Pagamento:</Text>
                <Text style={styles.confirmationValue}>
                  {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                </Text>
              </View>
            </View>

            <Text style={styles.confirmationWarning}>
              ⚠️ Você não poderá cancelar esta transação após confirmá-la.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleProcessPayment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Pagar Agora</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summarySection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  paymentMethodCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#DBEAFE',
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodIcon: {
    fontSize: 24,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  methodDetails: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  checkmark: {
    fontSize: 18,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  paymentForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
  },
  accountTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  accountTypeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  accountTypeButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#DBEAFE',
  },
  accountTypeText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  accountTypeTextActive: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  bankNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  bankNoteIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  bankNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
  },
  walletContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  walletIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  walletDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  walletBalance: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  walletBalanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  walletBalanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  walletInfo: {
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  walletInfoText: {
    fontSize: 12,
    color: '#1E40AF',
    textAlign: 'center',
  },
  addFundsButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  addFundsButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  feeBreakdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  feeItemTotal: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#3B82F6',
    paddingTop: 12,
    marginTop: 4,
  },
  feeLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  feeLabelTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  feeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  feeValueTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  termsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  termsLink: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  payButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmationDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  confirmationLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  confirmationValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  confirmationWarning: {
    fontSize: 12,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
