import { StyleSheet, Text, View } from 'react-native';
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
  // ...outros itens
];

function DetalhePonto({ ponto }: { ponto: Ponto }) {
  const dataFormatada = new Date(ponto.dataHora).toLocaleString('pt-BR');

  return (
      <View style={styles.card}>
        <Text style={styles.titulo}>{ponto.nome}</Text>
        <Text style={styles.texto}>📍 {ponto.endereco}</Text>
        <Text style={styles.texto}>📦 Mercadoria: {ponto.mercadoria}</Text>
        <Text style={styles.data}>📅 {dataFormatada}</Text>
      </View>
  );
}

export default function TelaDetalheProduto() {
  return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <DetalhePonto ponto={pontoMock[0]} />
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