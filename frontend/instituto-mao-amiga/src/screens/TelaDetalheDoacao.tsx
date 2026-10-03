import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { Doacao, RootStackParamList } from '../types/types';
import { carregarHistorico, getTotalHistorico, excluirDoacao } from '../services/doacoesService';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaDetalheDoacao'>;

function DoacaoDetalhe({
    doacao,
    totalGeral,
    onEditar,
    onExcluir,
}: {
    doacao: Doacao;
    totalGeral?: { totalRegistros: number; totalItens: number };
    onEditar: () => void;
    onExcluir: () => void;
}) {
    const destinoNome =
        typeof doacao.pontoSelecionado === 'object' && doacao.pontoSelecionado !== null
            ? doacao.pontoSelecionado.nome
            : typeof doacao.pontoSelecionado === 'string'
            ? doacao.pontoSelecionado
            : 'Não informado';

    const dataFormatada = doacao.criadoEm
        ? `${new Date(doacao.criadoEm).toLocaleDateString('pt-BR')} às ${new Date(
              doacao.criadoEm
          ).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
          })}`
        : doacao.criadoEm || 'Não informada';

    return (
        <View style={styles.cardDetalhe}>
            <Text style={styles.nome}>{doacao.tipoItem}</Text>

            <View style={styles.divisor} />

            <Text style={styles.label}>Quantidade:</Text>
            <Text style={styles.endereco}>{doacao.qtdItem}</Text>

            <Text style={styles.label}>Ponto Selecionado:</Text>
            <Text style={styles.diasHorarios}>{destinoNome}</Text>

            <Text style={styles.label}>Data e Hora:</Text>
            <Text style={styles.funcionamento}>{dataFormatada}</Text>

            {totalGeral !== undefined && (
                <>
                    <View style={styles.divisor} />
                    <Text style={styles.label}>Total no Histórico:</Text>
                    <Text style={styles.resumoHistorico}>
                        {totalGeral.totalRegistros} doação(ões) registradas ({totalGeral.totalItens} itens no total)
                    </Text>
                </>
            )}

            <TouchableOpacity
                style={styles.btnEditar}
                onPress={onEditar}
                activeOpacity={0.8}
            >
                <Text style={styles.btnEditarText}>Editar Doação</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.btnExcluir}
                onPress={onExcluir}
                activeOpacity={0.8}
            >
                <Text style={styles.btnExcluirText}>Excluir Doação</Text>
            </TouchableOpacity>
        </View>
    );
}

function TelaDetalheDoacao({ route, navigation }: Props) {
    const { doacaoId } = route.params;
    const [doacao, setDoacao] = useState<Doacao | null>(null);
    const [totalGeral, setTotalGeral] = useState<{ totalRegistros: number; totalItens: number } | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    const carregarDados = async () => {
        setLoading(true);
        const historico = await carregarHistorico();
        const itemEncontrado = historico.find((item) => item.id === doacaoId);
        const totais = await getTotalHistorico(historico);

        setDoacao(itemEncontrado || null);
        setTotalGeral(totais);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [doacaoId])
    );

    const handleExcluirDoacao = (item: Doacao) => {
        const pontoNome =
            typeof item.pontoSelecionado === 'object' && item.pontoSelecionado !== null
                ? item.pontoSelecionado.nome
                : typeof item.pontoSelecionado === 'string'
                ? item.pontoSelecionado
                : 'Não informado';

        Alert.alert(
            'Excluir Doação',
            `Deseja realmente excluir esta doação?\n\n• Item: ${item.tipoItem}\n• Quantidade: ${item.qtdItem}\n• Ponto: ${pontoNome}`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await excluirDoacao(item.id);
                            Alert.alert('Sucesso', 'Doação excluída com sucesso!', [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        if (navigation.canGoBack()) {
                                            navigation.goBack();
                                        } else {
                                            navigation.navigate('TelaDoacoes');
                                        }
                                    },
                                },
                            ]);
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir a doação.');
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!doacao) {
        return (
            <View style={styles.container}>
                <Text style={styles.erroText}>Doação não encontrada.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.detalheScroll}>
            <DoacaoDetalhe
                doacao={doacao}
                totalGeral={totalGeral}
                onEditar={() => navigation.navigate('TelaFormularioDoacao', { doacaoId: doacao.id })}
                onExcluir={() => handleExcluirDoacao(doacao)}
            />
        </ScrollView>
    );
}

export default TelaDetalheDoacao;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centerContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detalheScroll: {
        padding: theme.spacing['2xl'],
        paddingBottom: theme.spacing['3xl'],
    },
    cardDetalhe: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing['2xl'],
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        width: '100%',
    },
    nome: {
        fontSize: theme.fontSize['3xl'],
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    divisor: {
        height: 1,
        backgroundColor: theme.colors.cardBorder,
        marginVertical: theme.spacing.md,
    },
    label: {
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs,
    },
    endereco: {
        fontSize: theme.fontSize.lg,
        color: theme.colors.textSecondary,
        lineHeight: 22,
    },
    diasHorarios: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textMuted,
        lineHeight: 20,
    },
    funcionamento: {
        fontSize: theme.fontSize.sm,
        fontWeight: '600',
        color: theme.colors.primary,
        lineHeight: 18,
    },
    resumoHistorico: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    btnExcluir: {
        backgroundColor: theme.colors.danger,
        borderRadius: 7,
        paddingVertical: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing['2xl'],
    },
    btnExcluirText: {
        color: theme.colors.textWhite,
        fontWeight: 'bold',
        fontSize: theme.fontSize.md,
    },
    btnEditar: {
        backgroundColor: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: theme.fontSize.md,
        borderRadius: 7,
        paddingVertical: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing['2xl'],
    },
    btnEditarText: {
        color: theme.colors.textWhite,
        fontWeight: 'bold',
        fontSize: theme.fontSize.md,
    },
    erroText: {
        color: theme.colors.danger,
        fontSize: theme.fontSize.xl,
        textAlign: 'center',
        marginTop: theme.spacing['4xl'],
    },
});