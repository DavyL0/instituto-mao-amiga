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
import { obterDoacaoPorId, excluirDoacao } from '../services/doacoesService';
import { ApiError } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaDetalheDoacao'>;

function DoacaoDetalhe({
    doacao,
    onEditar,
    onExcluir,
    excluindo,
}: {
    doacao: Doacao;
    onEditar: () => void;
    onExcluir: () => void;
    excluindo: boolean;
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

            <TouchableOpacity
                style={styles.btnEditar}
                onPress={onEditar}
                disabled={excluindo}
                activeOpacity={0.8}
            >
                <Text style={styles.btnEditarText}>Editar Doação</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.btnExcluir}
                onPress={onExcluir}
                disabled={excluindo}
                activeOpacity={0.8}
            >
                <Text style={styles.btnExcluirText}>{excluindo ? 'Excluindo...' : 'Excluir Doação'}</Text>
            </TouchableOpacity>
        </View>
    );
}

function TelaDetalheDoacao({ route, navigation }: Props) {
    const { doacaoId } = route.params;
    const [doacao, setDoacao] = useState<Doacao | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [tentativa, setTentativa] = useState(0);
    const [excluindo, setExcluindo] = useState(false);

    const carregarDados = async () => {
        setLoading(true);
        try {
            setDoacao(await obterDoacaoPorId(doacaoId));
            setErro('');
        } catch (error) {
            setDoacao(null);
            setErro(error instanceof ApiError && error.status === 404 ? 'Doação não encontrada.' : 'Não foi possível carregar a doação.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            let ativo = true;
            setLoading(true);
            setErro('');
            obterDoacaoPorId(doacaoId)
                .then((item) => {
                    if (ativo) setDoacao(item);
                })
                .catch((error) => {
                    if (ativo) {
                        setDoacao(null);
                        setErro(error instanceof ApiError && error.status === 404
                            ? 'Doação não encontrada.'
                            : 'Não foi possível carregar a doação.');
                    }
                })
                .finally(() => {
                    if (ativo) setLoading(false);
                });
            return () => { ativo = false; };
        }, [doacaoId, tentativa])
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
                        setExcluindo(true);
                        try {
                            await excluirDoacao(item.id);
                            Alert.alert('Sucesso', 'Doação excluída com sucesso!', [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        navigation.popTo('TelaDoacoes');
                                    },
                                },
                            ]);
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir a doação.');
                            setExcluindo(false);
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
                <Text style={styles.erroText}>{erro || 'Doação não encontrada.'}</Text>
                <TouchableOpacity style={styles.btnEditar} onPress={() => setTentativa((valor) => valor + 1)}>
                    <Text style={styles.btnEditarText}>Tentar novamente</Text>
                </TouchableOpacity>
                <Text style={styles.erroText}>{erro || 'Doação não encontrada.'}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.detalheScroll}>
            <DoacaoDetalhe
                doacao={doacao}
                onEditar={() => navigation.navigate('TelaFormularioDoacao', { doacaoId: doacao.id })}
                onExcluir={() => handleExcluirDoacao(doacao)}
                excluindo={excluindo}
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