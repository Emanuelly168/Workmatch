import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

interface HiringStepsScreenProps {
  route?: any;
}

type StepType = 'proposal' | 'negotiation' | 'contract' | 'payment' | 'completed';

interface ContractData {
  jobId: string;
  proposedBudget: string;
  timeline: string;
  description: string;
  acceptedByClient: boolean;
}

export const HiringStepsScreen: React.FC<HiringStepsScreenProps> = ({ route }) => {
  const navigation = useNavigation<any>();
  const jobId = route?.params?.jobId || 'unknown';

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [contractData, setContractData] = useState<ContractData>({
    jobId,
    proposedBudget: '',
    timeline: '',
    description: '',
    acceptedByClient: false,
  });

  const steps: Array<{
    id: StepType;
    title: string;
    description: string;
    icon: string;
  }> = [
    {
      id: 'proposal',
      title: 'Enviar Proposta',
      description: 'Envie uma proposta com seus detalhes e valor',
      icon: '📝',
    },
    {
      id: 'negotiation',
      title: 'Negociação',
      description: 'Negocie os termos com o cliente',
      icon: '🤝',
    },
    {
      id: 'contract',
      title: 'Contrato',
      description: 'Revise e assine o contrato',
      icon: '📋',
    },
    {
      id: 'payment',
      title: 'Pagamento',
      description: 'Configure o método de pagamento',
      icon: '💳',
    },
    {
      id: 'completed',
      title: 'Concluído',
      description: 'Projeto aceito e iniciado',
      icon: '✅',
    },
  ];

  const handleNextStep = async () => {
    if (currentStep === 0) {
      // Validate proposal step
      if (!contractData.proposedBudget || !contractData.timeline) {
        alert('Por favor, preencha todos os campos da proposta');
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete hiring process
      completeHiringProcess();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeHiringProcess = async () => {
    try {
      setLoading(true);
      // Here you would typically send the contract data to your API
      console.log('Completing hiring process with data:', contractData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert('Contratação concluída com sucesso!');
      navigation.replace('Home');
    } catch (error) {
      console.error('Error completing hiring process:', error);
      alert('Erro ao concluir a contratação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepIndicatorItem}>
          <TouchableOpacity
            style={[
              styles.stepCircle,
              index <= currentStep && styles.stepCircleActive,
              index < currentStep && styles.stepCircleCompleted,
            ]}
            onPress={() => index <= currentStep && setCurrentStep(index)}
            disabled={index > currentStep}
          >
            {index < currentStep ? (
              <Text style={styles.stepCircleText}>✓</Text>
            ) : (
              <Text style={styles.stepCircleText}>{index + 1}</Text>
            )}
          </TouchableOpacity>

          {index < steps.length - 1 && (
            <View
              style={[
                styles.stepLine,
                index < currentStep && styles.stepLineCompleted,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStepLabels = () => (
    <View style={styles.stepLabelsContainer}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepLabelItem}>
          <Text
            style={[
              styles.stepLabelText,
              index <= currentStep && styles.stepLabelTextActive,
            ]}
            numberOfLines={1}
          >
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderProposalStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepIcon}>📝</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.stepTitle}>Enviar Proposta</Text>
          <Text style={styles.stepDescription}>
            Detalhe sua proposta e valor para o cliente
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Valor Proposto (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2500"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={contractData.proposedBudget}
            onChangeText={budget =>
              setContractData({ ...contractData, proposedBudget: budget })
            }
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Prazo (em dias)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 15"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={contractData.timeline}
            onChangeText={timeline =>
              setContractData({ ...contractData, timeline })
            }
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrição da Proposta</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva como você abordará o projeto..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={contractData.description}
            onChangeText={description =>
              setContractData({ ...contractData, description })
            }
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Sua proposta será enviada diretamente para o cliente. Seja claro e
            objetivo sobre suas habilidades e experiências.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderNegotiationStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepIcon}>🤝</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.stepTitle}>Negociação</Text>
          <Text style={styles.stepDescription}>
            Aguardando resposta do cliente
          </Text>
        </View>
      </View>

      <View style={styles.negotiationContainer}>
        <View style={styles.messageBox}>
          <Text style={styles.messageLabel}>Sua Proposta:</Text>
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>
              Valor: <Text style={styles.messageBold}>R$ {contractData.proposedBudget}</Text>
            </Text>
            <Text style={styles.messageText}>
              Prazo: <Text style={styles.messageBold}>{contractData.timeline} dias</Text>
            </Text>
            <Text style={styles.messageText}>
              Descrição: <Text style={styles.messageBold}>{contractData.description}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.statusIcon}>⏳</Text>
          <View>
            <Text style={styles.statusTitle}>Em Negociação</Text>
            <Text style={styles.statusDescription}>
              O cliente está revisando sua proposta. Você pode receber uma
              mensagem com contra-ofertas em breve.
            </Text>
          </View>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 Dica:</Text>
          <Text style={styles.tipsText}>
            • Responda rapidamente às mensagens do cliente{'\n'}• Seja flexível
            nas negociações{'\n'}• Detalhe bem seu escopo de trabalho
          </Text>
        </View>
      </View>
    </View>
  );

  const renderContractStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepIcon}>📋</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.stepTitle}>Contrato</Text>
          <Text style={styles.stepDescription}>
            Revise e aceite os termos do contrato
          </Text>
        </View>
      </View>

      <View style={styles.contractContainer}>
        <View style={styles.contractSection}>
          <Text style={styles.contractSectionTitle}>Termos do Projeto</Text>
          <View style={styles.contractTerms}>
            <View style={styles.termItem}>
              <Text style={styles.termLabel}>Valor Total:</Text>
              <Text style={styles.termValue}>R$ {contractData.proposedBudget}</Text>
            </View>
            <View style={styles.termItem}>
              <Text style={styles.termLabel}>Prazo:</Text>
              <Text style={styles.termValue}>{contractData.timeline} dias</Text>
            </View>
            <View style={styles.termItem}>
              <Text style={styles.termLabel}>Data de Início:</Text>
              <Text style={styles.termValue}>
                {new Date().toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <View style={styles.termItem}>
              <Text style={styles.termLabel}>Status:</Text>
              <Text style={styles.termValue}>Pendente de Assinatura</Text>
            </View>
          </View>
        </View>

        <View style={styles.contractTermsText}>
          <Text style={styles.contractTermsTitle}>Termos e Condições</Text>
          <Text style={styles.contractTermsContent}>
            1. O freelancer se compromete a entregar o trabalho conforme especificado.
            {'\n\n'}
            2. O pagamento será realizado após a conclusão e aprovação do trabalho.
            {'\n\n'}
            3. Ambas as partes concordam em manter a confidencialidade.
            {'\n\n'}
            4. O contrato pode ser encerrado com 7 dias de aviso prévio.
          </Text>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Ao prosseguir, você concorda com os termos do contrato.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderPaymentStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepIcon}>💳</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.stepTitle}>Configurar Pagamento</Text>
          <Text style={styles.stepDescription}>
            Configure seu método de recebimento
          </Text>
        </View>
      </View>

      <View style={styles.paymentContainer}>
        <View style={styles.paymentMethod}>
          <Text style={styles.paymentIcon}>🏦</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.paymentMethodTitle}>Transferência Bancária</Text>
            <Text style={styles.paymentMethodDescription}>
              Dados bancários: ••••••••8901
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.paymentTerms}>
          <Text style={styles.paymentTermsTitle}>Termos de Pagamento</Text>
          <View style={styles.paymentTermItem}>
            <Text style={styles.paymentTermItemText}>
              • 30% de depósito ao aceitar o contrato
            </Text>
          </View>
          <View style={styles.paymentTermItem}>
            <Text style={styles.paymentTermItemText}>
              • 70% após aprovação final
            </Text>
          </View>
          <View style={styles.paymentTermItem}>
            <Text style={styles.paymentTermItemText}>
              • Taxa WorkMatch: 10% do valor total
            </Text>
          </View>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Resumo do Pagamento</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Valor do Projeto:</Text>
            <Text style={styles.summaryValue}>R$ {contractData.proposedBudget}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Taxa WorkMatch (10%):</Text>
            <Text style={styles.summaryValue}>
              R$ {(parseInt(contractData.proposedBudget || '0') * 0.1).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryItem, styles.summaryItemTotal]}>
            <Text style={styles.summaryLabelTotal}>Valor Líquido:</Text>
            <Text style={styles.summaryValueTotal}>
              R$ {(parseInt(contractData.proposedBudget || '0') * 0.9).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCompletedStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.completedContainer}>
        <Text style={styles.completedIcon}>🎉</Text>
        <Text style={styles.completedTitle}>Parabéns!</Text>
        <Text style={styles.completedDescription}>
          Você foi contratado com sucesso! O projeto começará em breve.
        </Text>

        <View style={styles.completedDetails}>
          <Text style={styles.completedDetailsTitle}>Detalhes do Contrato:</Text>
          <View style={styles.completedDetail}>
            <Text style={styles.completedDetailLabel}>Valor:</Text>
            <Text style={styles.completedDetailValue}>
              R$ {contractData.proposedBudget}
            </Text>
          </View>
          <View style={styles.completedDetail}>
            <Text style={styles.completedDetailLabel}>Prazo:</Text>
            <Text style={styles.completedDetailValue}>
              {contractData.timeline} dias
            </Text>
          </View>
          <View style={styles.completedDetail}>
            <Text style={styles.completedDetailLabel}>Status:</Text>
            <Text style={styles.completedDetailValue}>Ativo</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackButtonText}>Voltar para Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderProposalStep();
      case 1:
        return renderNegotiationStep();
      case 2:
        return renderContractStep();
      case 3:
        return renderPaymentStep();
      case 4:
        return renderCompletedStep();
      default:
        return renderProposalStep();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderStepIndicator()}
        {renderStepLabels()}
        {renderCurrentStep()}
      </ScrollView>

      {/* Navigation Buttons */}
      {currentStep < steps.length - 1 && (
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
            onPress={handlePreviousStep}
            disabled={currentStep === 0}
          >
            <Text style={styles.navButtonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.navButtonPrimary]}
            onPress={handleNextStep}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.navButtonTextPrimary}>
                {currentStep === steps.length - 2 ? 'Concluir' : 'Próximo'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  stepIndicatorItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#3B82F6',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
  },
  stepCircleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepLine: {
    height: 2,
    backgroundColor: '#E5E7EB',
    flex: 1,
    marginHorizontal: 4,
  },
  stepLineCompleted: {
    backgroundColor: '#10B981',
  },
  stepLabelsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  stepLabelItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepLabelText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  stepLabelTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  stepContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  stepIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoBox: {
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
  },
  negotiationContainer: {
    gap: 16,
  },
  messageBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  messageLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  messageContent: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  messageText: {
    fontSize: 13,
    color: '#1F2937',
    marginBottom: 4,
  },
  messageBold: {
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statusBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  tips: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 20,
  },
  contractContainer: {
    gap: 16,
  },
  contractSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  contractSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  contractTerms: {
    gap: 12,
  },
  termItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  termLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  termValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  contractTermsText: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  contractTermsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  contractTermsContent: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
  },
  paymentContainer: {
    gap: 16,
  },
  paymentMethod: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#DBEAFE',
  },
  editButtonText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  paymentTerms: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  paymentTermsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  paymentTermItem: {
    marginBottom: 8,
  },
  paymentTermItemText: {
    fontSize: 12,
    color: '#6B7280',
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryItemTotal: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#3B82F6',
    paddingTop: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  summaryLabelTotal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryValueTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  completedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  completedIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  completedDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  completedDetails: {
    width: '100%',
    marginBottom: 24,
  },
  completedDetailsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  completedDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  completedDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  completedDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  goBackButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  goBackButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 14,
  },
  navButtonPrimary: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  navButtonTextPrimary: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
