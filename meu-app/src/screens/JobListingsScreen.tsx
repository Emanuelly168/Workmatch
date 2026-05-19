import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  category: string;
  experience_level: string;
  created_at: string;
  deadline?: string;
}

export const JobListingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');

  const categories = ['all', 'desenvolvimento', 'design', 'marketing', 'escrita', 'outros'];
  const experienceLevels = ['all', 'iniciante', 'intermediário', 'avançado'];

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchQuery, selectedCategory, selectedExperience]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/jobs', {
        timeout: 5000,
      });
      setJobs(response.data || mockJobs);
    } catch (error) {
      console.log('Using mock data due to API error');
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = jobs;

    if (searchQuery) {
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    if (selectedExperience !== 'all') {
      filtered = filtered.filter(job => job.experience_level === selectedExperience);
    }

    setFilteredJobs(filtered);
  };

  const handleJobPress = (job: Job) => {
    navigation.navigate('JobDetails', { job });
  };

  const handleApply = (jobId: string) => {
    navigation.navigate('HiringSteps', { jobId });
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => handleJobPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.jobHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.jobCategory}>{item.category}</Text>
        </View>
        <View style={styles.budgetBadge}>
          <Text style={styles.budgetText}>R$ {item.budget}</Text>
        </View>
      </View>

      <Text style={styles.jobDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.jobFooter}>
        <View style={styles.experienceBadge}>
          <Text style={styles.experienceText}>{item.experience_level}</Text>
        </View>
        <Text style={styles.dateText}>
          {new Date(item.created_at).toLocaleDateString('pt-BR')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => handleApply(item.id)}
      >
        <Text style={styles.applyButtonText}>Candidatar-se</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContentContainer}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.filterButton,
            selectedCategory === category && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedCategory === category && styles.filterButtonTextActive,
            ]}
          >
            {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderExperienceFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContentContainer}
    >
      {experienceLevels.map(level => (
        <TouchableOpacity
          key={level}
          style={[
            styles.filterButton,
            selectedExperience === level && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedExperience(level)}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedExperience === level && styles.filterButtonTextActive,
            ]}
          >
            {level === 'all' ? 'Todos' : level.charAt(0).toUpperCase() + level.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Carregando vagas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vagas Disponíveis</Text>
        <Text style={styles.headerSubtitle}>
          {filteredJobs.length} {filteredJobs.length === 1 ? 'vaga' : 'vagas'} encontrada{filteredJobs.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar vagas..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      {/* Filters */}
      <View>
        <Text style={styles.filterLabel}>Categoria</Text>
        {renderCategoryFilter()}
      </View>

      <View>
        <Text style={styles.filterLabel}>Nível de Experiência</Text>
        {renderExperienceFilter()}
      </View>

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateIcon}>😴</Text>
          <Text style={styles.emptyStateTitle}>Nenhuma vaga encontrada</Text>
          <Text style={styles.emptyStateDescription}>
            Tente ajustar seus filtros para encontrar mais oportunidades
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedExperience('all');
            }}
          >
            <Text style={styles.resetButtonText}>Limpar Filtros</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Desenvolver aplicativo mobile em React Native',
    description: 'Precisamos de um desenvolvedor para criar um aplicativo mobile completo com integração de APIs.',
    budget: 3000,
    status: 'open',
    category: 'desenvolvimento',
    experience_level: 'avançado',
    created_at: '2026-05-10',
  },
  {
    id: '2',
    title: 'Design de Logo e Identidade Visual',
    description: 'Criação de logo e guidelines de identidade visual para nova startup tecnológica.',
    budget: 1500,
    status: 'open',
    category: 'design',
    experience_level: 'intermediário',
    created_at: '2026-05-12',
  },
  {
    id: '3',
    title: 'Copywriting para E-commerce',
    description: 'Escrever textos persuasivos para produto de e-commerce de moda feminina.',
    budget: 800,
    status: 'open',
    category: 'escrita',
    experience_level: 'iniciante',
    created_at: '2026-05-13',
  },
  {
    id: '4',
    title: 'Consultoria em Marketing Digital',
    description: 'Analisar estratégia de marketing digital e propor melhorias para aumento de conversão.',
    budget: 2500,
    status: 'open',
    category: 'marketing',
    experience_level: 'avançado',
    created_at: '2026-05-11',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  searchIcon: {
    fontSize: 18,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  filterContainer: {
    paddingVertical: 4,
  },
  filterContentContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  jobCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  budgetBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  budgetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  jobDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  experienceBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  experienceText: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
