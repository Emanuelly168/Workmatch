import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../db';
import { profissionais } from '../db/schema';

export default function Cliente({ navigation }: any) {
  const [listaProfissionais, setListaProfissionais] = useState<any[]>([]);

  useEffect(() => {
    
    const buscarDados = async () => {
      const dados = await db.select().from(profissionais);
      setListaProfissionais(dados);
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
      buscarDados();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#0A2E73' }}>Buscar Profissionais</Text>

      <FlatList
        data={listaProfissionais}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.nome}</Text>
            <Text>{item.servico}</Text>

            <TouchableOpacity style={{ backgroundColor: '#0A2E73', padding: 8, borderRadius: 6, marginTop: 10 }}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>Contratar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum profissional cadastrado ainda.</Text>}
      />

      <TouchableOpacity style={{ padding: 15, backgroundColor: '#ddd', borderRadius: 8, marginTop: 10 }} onPress={() => navigation.goBack()}>
        <Text style={{ textAlign: 'center' }}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}