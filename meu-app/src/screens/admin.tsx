import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { db } from '../db';
import { profissionais } from '../db/schema';
import { eq } from 'drizzle-orm';

export default function AdminLocal({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [servico, setServico] = useState('');
  const [lista, setLista] = useState<any[]>([]);

  const carregarProfissionais = async () => {
    const dados = await db.select().from(profissionais);
    setLista(dados);
  };

  useEffect(() => { carregarProfissionais(); }, []);

  const adicionarProfissional = async () => {
    if (!nome || !servico) return Alert.alert('Erro', 'Preencha todos os campos');
    
    await db.insert(profissionais).values({ nome, servico });
    setNome('');
    setServico('');
    carregarProfissionais(); 
  };

  const removerProfissional = async (id: number) => {
    await db.delete(profissionais).where(eq(profissionais.id, id));
    carregarProfissionais();
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f4f4f4' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#0A2E73' }}>
        WorkMatch - Base Local
      </Text>
      
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 8 }} />
      <TextInput placeholder="Serviço" value={servico} onChangeText={setServico} style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 8 }} />
      
      <TouchableOpacity onPress={adicionarProfissional} style={{ backgroundColor: '#0A2E73', padding: 15, borderRadius: 8, marginBottom: 20 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Adicionar Profissional</Text>
      </TouchableOpacity>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, elevation: 2 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.nome}</Text>
            <Text>{item.servico}</Text>
            <TouchableOpacity onPress={() => removerProfissional(item.id)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}