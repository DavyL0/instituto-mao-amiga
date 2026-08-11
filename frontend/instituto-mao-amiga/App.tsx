import {FlatList, StyleSheet, Text, View} from 'react-native';
import { StatusBar } from 'expo-status-bar';

type Ponto = {
  nome: string;
  endereco: string;
  dataHora: string;
  mercadoria: string;
};

const pontoMock: Ponto[] = [
  {
    nome: "Ponto de Coleta 01 - CD Barueri",
    endereco: "Alameda Rio Negro, 500 - Alphaville, Barueri - SP",
    dataHora: "2026-08-10T08:00:00Z",
    mercadoria: "Caixas de Papelão e Suprimentos"
  },
  {
    nome: "Centro de Distribuição - Rio",
    endereco: "Av. Brasil, 12000 - Penha, Rio de Janeiro - RJ",
    dataHora: "2026-08-10T11:45:00Z",
    mercadoria: "Eletrodomésticos"
  },
  {
    nome: "Filial Sul - Curitiba",
    endereco: "Rua das Flores, 250 - Centro, Curitiba - PR",
    dataHora: "2026-08-10T16:15:00Z",
    mercadoria: "Vestuário e Calçados"
  },
  {
    nome: "Terminal Carga - BH",
    endereco: "Av. do Contorno, 4321 - Funcionários, Belo Horizonte - MG",
    dataHora: "2026-08-11T09:30:00Z",
    mercadoria: "Alimentos Não Perecíveis"
  }
];

function DetalhePonto({ ponto }: { ponto: Ponto }) {
  const dataFormatada = new Date(ponto.dataHora).toLocaleString('pt-BR');

  return (
      <View style={styles.card}>
        <Text style={styles.titulo}>{ponto.nome}</Text>
        <Text style={styles.texto}> {ponto.endereco}</Text>
        <Text style={styles.texto}> Mercadoria: {ponto.mercadoria}</Text>
        <Text style={styles.data}> {dataFormatada}</Text>
      </View>
  );
}

export default function TelaListaPontos() {
  return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <FlatList
            data={pontoMock}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <DetalhePonto ponto={item} />}
            contentContainerStyle={{ paddingVertical: 16 }}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    elevation: 2, // sombra no Android
    shadowColor: '#000', // sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  texto: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  data: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});