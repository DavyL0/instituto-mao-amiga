import { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StatusBar as StatusBarRN,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

type TipoPonto = 'coleta' | 'distribuicao';

type Endereco = {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
};

type Atendimento = {
  dias: string;
  horario: string;
};

type Ponto = {
  id: string;
  nome: string;
  tipo: TipoPonto;
  endereco: Endereco;
  atendimento: Atendimento[];
  itens: string[];
  responsavel: string;
  telefone: string;
};

const pontoMock: Ponto[] = [
  {
    id: '01',
    nome: 'Ponto de Coleta 01 - CD Barueri',
    tipo: 'coleta',
    endereco: {
      logradouro: 'Alameda Rio Negro',
      numero: '500',
      complemento: 'Galpão 3',
      bairro: 'Alphaville',
      cidade: 'Barueri',
      uf: 'SP',
      cep: '06454-000',
    },
    atendimento: [
      { dias: 'Segunda a sexta', horario: '08:00 às 17:00' },
      { dias: 'Sábado', horario: '08:00 às 12:00' },
    ],
    itens: [
      'Caixas de papelão',
      'Suprimentos de higiene',
      'Material de limpeza',
      'Papel e plástico para reciclagem',
    ],
    responsavel: 'Marina Duarte',
    telefone: '(11) 4193-2200',
  },
  {
    id: '02',
    nome: 'Centro de Distribuição - Penha',
    tipo: 'distribuicao',
    endereco: {
      logradouro: 'Av. Brasil',
      numero: '12000',
      bairro: 'Penha',
      cidade: 'Rio de Janeiro',
      uf: 'RJ',
      cep: '21010-001',
    },
    atendimento: [
      { dias: 'Terça a sábado', horario: '09:00 às 18:00' },
      { dias: 'Domingo', horario: '10:00 às 14:00' },
    ],
    itens: [
      'Cestas básicas',
      'Eletrodomésticos revisados',
      'Colchões e cobertores',
      'Kits de material escolar',
    ],
    responsavel: 'Jorge Bastos',
    telefone: '(21) 2280-4410',
  },
  {
    id: '03',
    nome: 'Filial Sul - Curitiba',
    tipo: 'coleta',
    endereco: {
      logradouro: 'Rua das Flores',
      numero: '250',
      complemento: 'Loja 12',
      bairro: 'Centro',
      cidade: 'Curitiba',
      uf: 'PR',
      cep: '80020-100',
    },
    atendimento: [{ dias: 'Segunda a sexta', horario: '10:00 às 19:00' }],
    itens: [
      'Roupas de inverno',
      'Calçados em bom estado',
      'Enxoval de cama e banho',
      'Brinquedos',
    ],
    responsavel: 'Cláudia Ferrari',
    telefone: '(41) 3322-8090',
  },
  {
    id: '04',
    nome: 'Terminal de Carga - Belo Horizonte',
    tipo: 'coleta',
    endereco: {
      logradouro: 'Av. do Contorno',
      numero: '4321',
      bairro: 'Funcionários',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      cep: '30110-090',
    },
    atendimento: [
      { dias: 'Segunda, quarta e sexta', horario: '07:30 às 16:30' },
      { dias: 'Terça e quinta', horario: '07:30 às 12:00' },
    ],
    itens: [
      'Alimentos não perecíveis',
      'Água mineral',
      'Leite em pó',
      'Fórmula infantil',
    ],
    responsavel: 'Rafael Andrade',
    telefone: '(31) 3271-5566',
  },
  {
    id: '05',
    nome: 'Ponto de Coleta - Recife Antigo',
    tipo: 'coleta',
    endereco: {
      logradouro: 'Rua do Bom Jesus',
      numero: '183',
      bairro: 'Recife Antigo',
      cidade: 'Recife',
      uf: 'PE',
      cep: '50030-170',
    },
    atendimento: [{ dias: 'Quarta a domingo', horario: '13:00 às 20:00' }],
    itens: [
      'Livros didáticos',
      'Notebooks e tablets usados',
      'Material de papelaria',
      'Mochilas',
    ],
    responsavel: 'Antônia Vasconcelos',
    telefone: '(81) 3424-7712',
  },
  {
    id: '06',
    nome: 'Centro de Distribuição - Ceilândia',
    tipo: 'distribuicao',
    endereco: {
      logradouro: 'QNM 17, Conjunto A',
      numero: '08',
      complemento: 'Anexo do centro comunitário',
      bairro: 'Ceilândia Sul',
      cidade: 'Brasília',
      uf: 'DF',
      cep: '72215-170',
    },
    atendimento: [
      { dias: 'Segunda a quinta', horario: '08:00 às 15:00' },
      { dias: 'Sexta', horario: '08:00 às 12:00' },
    ],
    itens: [
      'Cestas básicas',
      'Kits de higiene pessoal',
      'Fraldas geriátricas e infantis',
      'Uniformes escolares',
    ],
    responsavel: 'Débora Nogueira',
    telefone: '(61) 3372-1180',
  },
  {
    id: '07',
    nome: 'Ponto de Coleta - Porto Alegre',
    tipo: 'coleta',
    endereco: {
      logradouro: 'Av. Independência',
      numero: '755',
      complemento: 'Sala 4',
      bairro: 'Independência',
      cidade: 'Porto Alegre',
      uf: 'RS',
      cep: '90035-072',
    },
    atendimento: [
      { dias: 'Segunda a sexta', horario: '09:00 às 18:00' },
      { dias: 'Sábado', horario: '09:00 às 13:00' },
    ],
    itens: [
      'Móveis desmontáveis',
      'Utensílios de cozinha',
      'Eletrodomésticos para reparo',
      'Ferramentas',
    ],
    responsavel: 'Henrique Salles',
    telefone: '(51) 3226-4477',
  },
  {
    id: '08',
    nome: 'Centro de Distribuição - Belém',
    tipo: 'distribuicao',
    endereco: {
      logradouro: 'Travessa Padre Eutíquio',
      numero: '1620',
      bairro: 'Batista Campos',
      cidade: 'Belém',
      uf: 'PA',
      cep: '66033-000',
    },
    atendimento: [
      { dias: 'Terça a sexta', horario: '08:30 às 16:00' },
      { dias: 'Sábado', horario: '08:30 às 11:30' },
    ],
    itens: [
      'Alimentos não perecíveis',
      'Roupas para o clima quente',
      'Medicamentos de uso comum',
      'Redes e mosquiteiros',
    ],
    responsavel: 'Sandra Melo',
    telefone: '(91) 3242-9034',
  },
];

const paddingTopSeguro =
  Platform.OS === 'android' ? StatusBarRN.currentHeight ?? 24 : 48;

function rotuloTipo(tipo: TipoPonto) {
  return tipo === 'coleta' ? 'Coleta' : 'Distribuição';
}

function rotuloItens(tipo: TipoPonto) {
  return tipo === 'coleta' ? 'Recebe' : 'Distribui';
}

function enderecoResumido({ bairro, cidade, uf }: Endereco) {
  return `${bairro}, ${cidade} - ${uf}`;
}

function enderecoCompleto(endereco: Endereco) {
  const { logradouro, numero, complemento, bairro, cidade, uf, cep } = endereco;
  const linhaUm = complemento
    ? `${logradouro}, ${numero} - ${complemento}`
    : `${logradouro}, ${numero}`;

  return `${linhaUm}\n${bairro}, ${cidade} - ${uf}\nCEP ${cep}`;
}

function atendimentoResumido(atendimento: Atendimento[]) {
  const [primeiro, ...outros] = atendimento;
  const base = `${primeiro.dias}, ${primeiro.horario}`;

  return outros.length > 0
    ? `${base} (+${outros.length} horário${outros.length > 1 ? 's' : ''})`
    : base;
}

function Etiqueta({ tipo }: { tipo: TipoPonto }) {
  const estiloEtiqueta =
    tipo === 'coleta' ? styles.etiquetaColeta : styles.etiquetaDistribuicao;
  const estiloTexto =
    tipo === 'coleta'
      ? styles.etiquetaTextoColeta
      : styles.etiquetaTextoDistribuicao;

  return (
      <View style={[styles.etiqueta, estiloEtiqueta]}>
        <Text style={[styles.etiquetaTexto, estiloTexto]}>{rotuloTipo(tipo)}</Text>
      </View>
  );
}

function ItemPonto({ ponto, onPress }: { ponto: Ponto; onPress: () => void }) {
  return (
      <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalhes de ${ponto.nome}`}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressionado]}
      >
        <View style={styles.cardCabecalho}>
          <Text style={styles.titulo}>{ponto.nome}</Text>
          <Etiqueta tipo={ponto.tipo} />
        </View>
        <Text style={styles.texto}>{enderecoResumido(ponto.endereco)}</Text>
        <Text style={styles.texto}>
          {rotuloItens(ponto.tipo)}: {ponto.itens.slice(0, 2).join(', ')}
          {ponto.itens.length > 2 ? ` e mais ${ponto.itens.length - 2}` : ''}
        </Text>
        <Text style={styles.data}>{atendimentoResumido(ponto.atendimento)}</Text>
      </Pressable>
  );
}

function TelaListaPontos({
                           onSelecionar,
                         }: {
  onSelecionar: (ponto: Ponto) => void;
}) {
  return (
      <FlatList
          data={pontoMock}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
              <ItemPonto ponto={item} onPress={() => onSelecionar(item)} />
          )}
          ListHeaderComponent={
            <View style={styles.cabecalhoLista}>
              <Text style={styles.tituloTela}>Pontos de coleta e distribuição</Text>
              <Text style={styles.subtitulo}>
                {pontoMock.length} pontos ativos. Toque em um ponto para ver os
                detalhes.
              </Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={styles.separador} />}
          contentContainerStyle={styles.conteudoLista}
      />
  );
}

function TelaDetalhePonto({
                            ponto,
                            onVoltar,
                          }: {
  ponto: Ponto;
  onVoltar: () => void;
}) {
  return (
      <ScrollView contentContainerStyle={styles.conteudoDetalhe}>
        <Pressable
            onPress={onVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a lista de pontos"
            style={({ pressed }) => [styles.voltar, pressed && styles.voltarPressionado]}
        >
          <Text style={styles.voltarTexto}>‹ Voltar para a lista</Text>
        </Pressable>

        <View style={styles.card}>
          <View style={styles.cardCabecalho}>
            <Text style={styles.titulo}>{ponto.nome}</Text>
            <Etiqueta tipo={ponto.tipo} />
          </View>

          <Text style={styles.rotuloSecao}>Endereço</Text>
          <Text style={styles.texto}>{enderecoCompleto(ponto.endereco)}</Text>

          <Text style={styles.rotuloSecao}>Dias e horários</Text>
          {ponto.atendimento.map((item) => (
              <Text key={item.dias} style={styles.texto}>
                {item.dias}: {item.horario}
              </Text>
          ))}

          <Text style={styles.rotuloSecao}>{rotuloItens(ponto.tipo)}</Text>
          {ponto.itens.map((item) => (
              <Text key={item} style={styles.texto}>
                • {item}
              </Text>
          ))}

          <Text style={styles.rotuloSecao}>Contato</Text>
          <Text style={styles.texto}>{ponto.responsavel}</Text>
          <Text style={styles.texto}>{ponto.telefone}</Text>

          <Text style={styles.data}>Ponto nº {ponto.id}</Text>
        </View>
      </ScrollView>
  );
}

export default function App() {
  const [pontoSelecionado, setPontoSelecionado] = useState<Ponto | null>(null);

  return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        {pontoSelecionado ? (
            <TelaDetalhePonto
                ponto={pontoSelecionado}
                onVoltar={() => setPontoSelecionado(null)}
            />
        ) : (
            <TelaListaPontos onSelecionar={setPontoSelecionado} />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: paddingTopSeguro,
  },
  conteudoLista: {
    padding: 16,
    paddingBottom: 32,
  },
  conteudoDetalhe: {
    padding: 16,
    paddingBottom: 32,
  },
  cabecalhoLista: {
    marginBottom: 16,
  },
  tituloTela: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitulo: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  separador: {
    height: 12,
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
  cardPressionado: {
    opacity: 0.7,
  },
  cardCabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  titulo: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  rotuloSecao: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 6,
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
  etiqueta: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  etiquetaColeta: {
    backgroundColor: '#e8f5e9',
  },
  etiquetaDistribuicao: {
    backgroundColor: '#e3f2fd',
  },
  etiquetaTexto: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  etiquetaTextoColeta: {
    color: '#2e7d32',
  },
  etiquetaTextoDistribuicao: {
    color: '#1565c0',
  },
  voltar: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 8,
    marginBottom: 8,
  },
  voltarPressionado: {
    opacity: 0.6,
  },
  voltarTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1565c0',
  },
});
