import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface HomeScreenProps {
  navigation?: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const screenHeight = Dimensions.get('window').height;

  const handleBrowseJobs = () => {
    navigation?.navigate('JobListings');
  };

  const handleMyProfile = () => {
    navigation?.navigate('Profile');
  };

  const handleMyEarnings = () => {
    navigation?.navigate('Earnings');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bem-vindo ao WorkMatch! 🤝</Text>
        <Text style={styles.subGreeting}>Encontre as melhores oportunidades de trabalho</Text>
      </View>

      <View style={styles.bannerContainer}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Oportunidades em Destaque</Text>
          <Text style={styles.bannerSubtitle}>
            Descubra projetos com alta demanda e boas remunerações
          </Text>
          <TouchableOpacity 
            style={styles.bannerButton}
            onPress={handleBrowseJobs}
          >
            <Text style={styles.bannerButtonText}>Explorar Agora</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1.250+</Text>
          <Text style={styles.statLabel}>Projetos Disponíveis</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.8★</Text>
          <Text style={styles.statLabel}>Avaliação Média</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Freelancers Ativos</Text>
        </View>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleBrowseJobs}
        >
          <Text style={styles.actionButtonIcon}>💼</Text>
          <Text style={styles.actionButtonTitle}>Buscar Vagas</Text>
          <Text style={styles.actionButtonDescription}>
            Encontre projetos que combinam com você
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleMyProfile}
        >
          <Text style={styles.actionButtonIcon}>👤</Text>
          <Text style={styles.actionButtonTitle}>Meu Perfil</Text>
          <Text style={styles.actionButtonDescription}>
            Gerencie seus dados e portfólio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleMyEarnings}
        >
          <Text style={styles.actionButtonIcon}>💰</Text>
          <Text style={styles.actionButtonTitle}>Meus Ganhos</Text>
          <Text style={styles.actionButtonDescription}>
            Acompanhe seus rendimentos
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.howItWorksContainer}>
        <Text style={styles.sectionTitle}>Como Funciona?</Text>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Complete seu Perfil</Text>
            <Text style={styles.stepDescription}>
              Adicione suas habilidades e experiências
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Busque Oportunidades</Text>
            <Text style={styles.stepDescription}>
              Encontre projetos que combinam com você
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Candidate-se</Text>
            <Text style={styles.stepDescription}>
              Envie uma proposta para o cliente
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Receba Pagamento</Text>
            <Text style={styles.stepDescription}>
              Conclua o projeto e receba com segurança
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footerCTA}>
        <Text style={styles.footerCTATitle}>Pronto para começar?</Text>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleBrowseJobs}
        >
          <Text style={styles.primaryButtonText}>Explorar Vagas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 24,
    paddingTop: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  bannerContainer: {
    padding: 16,
  },
  banner: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 24,
    overflow: 'hidden',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
    lineHeight: 20,
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionButtonsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionButtonDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  howItWorksContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  footerCTA: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  footerCTATitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
