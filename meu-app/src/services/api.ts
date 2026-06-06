import axios, { AxiosInstance } from 'axios';

const API_URL = 'http://localhost:3000';

class WorkmatchAPI {
  private client: AxiosInstance;
  private token: string | null = null;
  private usuarioId: number | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // ========== AUTENTICAÇÃO ==========

  async registrar(email: string, senha: string, nome: string, tipo: 'cliente' | 'freelancer', telefone?: string) {
    const response = await this.client.post('/auth/registro', {
      email,
      senha,
      nome,
      tipo,
      telefone,
    });
    return response.data;
  }

  async login(email: string, senha: string) {
    const response = await this.client.post('/auth/login', {
      email,
      senha,
    });
    this.usuarioId = response.data.id;
    return response.data;
  }

  logout() {
    this.token = null;
    this.usuarioId = null;
  }

  // ========== USUÁRIOS ==========

  async obterUsuario(id: number) {
    const response = await this.client.get(`/usuarios/${id}`);
    return response.data;
  }

  async atualizarPerfil(id: number, dados: {
    nome?: string;
    telefone?: string;
    descricao?: string;
    foto?: string;
  }) {
    const response = await this.client.put(`/usuarios/${id}`, dados);
    return response.data;
  }

  async listarFreelancers() {
    const response = await this.client.get('/usuarios/tipo/freelancer');
    return response.data;
  }

  async listarClientes() {
    const response = await this.client.get('/usuarios/tipo/cliente');
    return response.data;
  }

  // ========== PROFISSIONAIS ==========

  async listarProfissionais() {
    const response = await this.client.get('/profissionais');
    return response.data;
  }

  async criarProfissional(nome: string, servico: string) {
    const response = await this.client.post('/profissionais', { nome, servico });
    return response.data;
  }

  async deletarProfissional(id: number) {
    await this.client.delete(`/profissionais/${id}`);
  }

  // ========== VAGAS ==========

  async criarVaga(
    titulo: string,
    descricao: string,
    categoria: string,
    orcamento: number,
    usuarioId?: number
  ) {
    const response = await this.client.post('/vagas', {
      usuario_id: usuarioId || this.usuarioId,
      titulo,
      descricao,
      categoria,
      orcamento,
    });
    return response.data;
  }

  async listarVagas() {
    const response = await this.client.get('/vagas');
    return response.data;
  }

  async obterVaga(id: number) {
    const response = await this.client.get(`/vagas/${id}`);
    return response.data;
  }

  async listarVagasDoUsuario(usuarioId: number) {
    const response = await this.client.get(`/vagas/usuario/${usuarioId}`);
    return response.data;
  }

  async atualizarVaga(
    id: number,
    dados: {
      titulo?: string;
      descricao?: string;
      categoria?: string;
      orcamento?: number;
      status?: 'aberta' | 'em_progresso' | 'finalizada';
    }
  ) {
    const response = await this.client.put(`/vagas/${id}`, dados);
    return response.data;
  }

  async deletarVaga(id: number) {
    await this.client.delete(`/vagas/${id}`);
  }

  // ========== PROPOSTAS ==========

  async enviarProposta(
    vagaId: number,
    freelancerId: number,
    valor: number,
    descricao: string
  ) {
    const response = await this.client.post('/propostas', {
      vaga_id: vagaId,
      freelancer_id: freelancerId,
      valor,
      descricao,
    });
    return response.data;
  }

  async listarPropostasVaga(vagaId: number) {
    const response = await this.client.get(`/propostas/vaga/${vagaId}`);
    return response.data;
  }

  async listarPropostasFreelancer(freelancerId: number) {
    const response = await this.client.get(`/propostas/freelancer/${freelancerId}`);
    return response.data;
  }

  async atualizarStatusProposta(
    id: number,
    status: 'pendente' | 'aceita' | 'recusada'
  ) {
    const response = await this.client.put(`/propostas/${id}/status`, { status });
    return response.data;
  }

  // ========== PAGAMENTOS ==========

  async criarPagamento(
    vagaId: number,
    clienteId: number,
    freelancerId: number,
    valor: number,
    metodoPagamento?: string
  ) {
    const response = await this.client.post('/pagamentos', {
      vaga_id: vagaId,
      cliente_id: clienteId,
      freelancer_id: freelancerId,
      valor,
      metodo_pagamento: metodoPagamento || 'cartao',
    });
    return response.data;
  }

  async obterPagamento(id: number) {
    const response = await this.client.get(`/pagamentos/${id}`);
    return response.data;
  }

  async listarPagamentosVaga(vagaId: number) {
    const response = await this.client.get(`/pagamentos/vaga/${vagaId}`);
    return response.data;
  }

  async atualizarStatusPagamento(
    id: number,
    status: 'pendente' | 'processando' | 'concluido' | 'cancelado'
  ) {
    const response = await this.client.put(`/pagamentos/${id}/status`, { status });
    return response.data;
  }

  // ========== HEALTH CHECK ==========

  async verificarSaude() {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export default new WorkmatchAPI();

/*
EXEMPLO DE USO:

import api from './src/services/api';

// Login
const usuario = await api.login('user@email.com', 'senha123');

// Criar vaga
const novaVaga = await api.criarVaga(
  'Desenvolvedor React Native',
  'Preciso de um desenvolvedor experiente',
  'desenvolvimento',
  5000
);

// Listar vagas
const vagas = await api.listarVagas();

// Enviar proposta
const proposta = await api.enviarProposta(
  1, // vagaId
  5, // freelancerId
  4500, // valor
  'Posso fazer por esse valor!'
);
*/
