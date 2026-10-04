import React, { useCallback, useMemo, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Doacao, RootStackParamList } from '../types/types';
import { theme } from '../theme/theme';
import { carregarHistorico, getTotalHistorico } from '../services/doacoesService';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaDoacoes'>;

function TelaDoacoes({ navigation }: Props) {
    const [historico, setHistorico] = useState<Doacao[]>([]);
    const [busca, setBusca] = useState('');
    const [totalGeral, setTotalGeral] = useState({ totalRegistros: 0, totalItens: 0 });

    const buscarDados = async () => {
        const dados = await carregarHistorico();
        setHistorico(dados);
        const totais = await getTotalHistorico(dados);
        setTotalGeral(totais);
    };

    useFocusEffect(
        useCallback(() => {
            buscarDados();
        }, [])
    );

    const historicoFiltrado = useMemo(() => {
        if (!busca.trim()) return historico;
        const termo = busca.trim().toLowerCase();
        return historico.filter((doacao) =>
            doacao.tipoItem?.toLowerCase().includes(termo)
        );
    }, [historico, busca]);

    const renderItem = ({ item }: { item: Doacao }) => {
        const destinoNome =
            typeof item.pontoSelecionado === 'object' && item.pontoSelecionado !== null
                ? item.pontoSelecionado.nome
                : typeof item.pontoSelecionado === 'string'
                ? item.pontoSelecionado
                : 'Não informado';

        const dataFormatada = item.criadoEm
            ? `${new Date(item.criadoEm).toLocaleDateString('pt-BR')} às ${new Date(
                  item.criadoEm
              ).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
              })}`
            : null;

        return (
            <TouchableOpacity
                style={styles.historicoCard}
                onPress={() => navigation.navigate('TelaDetalheDoacao', { doacaoId: item.id })}
                activeOpacity={0.7}
            >
                <View style={styles.historicoHeaderRow}>
                    <Text style={styles.historicoItemNome}>{item.tipoItem}</Text>
                    <View style={styles.qtdBadge}>
                        <Text style={styles.historicoItemQtd}>
                            Qtd: {item.qtdItem}
                        </Text>
                    </View>
                </View>
                <Text style={styles.historicoDestino}>
                    📍 Destino: {destinoNome}
                </Text>
                {dataFormatada && (
                    <Text style={styles.historicoData}>
                        🕒 {dataFormatada}
                    </Text>
                )}
            </TouchableOpacity>
        );
    };

    const renderEmpty = () => {
        if (busca.trim()) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>🔍</Text>
                    <Text style={styles.emptyTitle}>Nenhuma doação encontrada</Text>
                    <Text style={styles.emptyText}>
                        Nenhum item corresponde ao termo "{busca}".
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyTitle}>Nenhuma doação cadastrada</Text>
                <Text style={styles.emptyText}>
                    Registre suas doações pelo formulário para visualizá-las aqui.
                </Text>
                <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={() => navigation.navigate('TelaFormularioDoacao')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.emptyButtonText}>Cadastrar Doação</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Histórico de Doações</Text>
                    {historico.length > 0 && (
                        <Text style={styles.subtitleText}>
                            Total: {totalGeral.totalRegistros} doações ({totalGeral.totalItens} itens)
                        </Text>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.btnNovaDoacao}
                    onPress={() => navigation.navigate('TelaFormularioDoacao')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.btnNovaDoacaoText}>+ Nova Doação</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.inputBusca}
                placeholder="Buscar por tipo de item..."
                placeholderTextColor={theme.colors.placeholder}
                value={busca}
                onChangeText={setBusca}
                autoCorrect={false}
                clearButtonMode="while-editing"
            />

            <FlatList
                data={historicoFiltrado}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={renderEmpty}
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

export default TelaDoacoes;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing['2xl'],
        paddingTop: theme.spacing['2xl'],
        paddingBottom: theme.spacing.md,
    },
    titleContainer: {
        flex: 1,
    },
    titleText: {
        color: theme.colors.text,
        fontSize: theme.fontSize['3xl'],
        fontWeight: 'bold',
    },
    subtitleText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.sm,
        marginTop: 2,
    },
    btnNovaDoacao: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
    btnNovaDoacaoText: {
        color: theme.colors.textWhite,
        fontWeight: 'bold',
        fontSize: theme.fontSize.sm,
    },
    inputBusca: {
        backgroundColor: theme.colors.cardBackground,
        color: theme.colors.text,
        height: 50,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing['2xl'],
        fontSize: theme.fontSize.xl,
        marginHorizontal: theme.spacing['2xl'],
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        padding: theme.spacing['2xl'],
        paddingBottom: theme.spacing['3xl'],
    },
    historicoCard: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        marginBottom: theme.spacing.lg,
    },
    historicoHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    historicoItemNome: {
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
        color: theme.colors.text,
        flex: 1,
    },
    qtdBadge: {
        backgroundColor: theme.colors.iconSurface,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    historicoItemQtd: {
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    historicoDestino: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    historicoData: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textMuted,
        marginTop: theme.spacing.xs,
    },
    emptyContainer: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing['3xl'],
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        marginTop: theme.spacing.xl,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: theme.spacing.md,
    },
    emptyTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    emptyText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    emptyButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
    },
    emptyButtonText: {
        color: theme.colors.textWhite,
        fontWeight: 'bold',
        fontSize: theme.fontSize.sm,
    },
});

