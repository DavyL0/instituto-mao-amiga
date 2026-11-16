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
import { Ponto, RootStackParamList } from '../types/types';
import { theme } from '../theme/theme';
import * as pontosService from '../services/pontosService';
import { ApiError } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaDetalhePonto'>;

function PontoDetalhe({
    ponto,
    onEditar,
    onExcluir,
}: {
    ponto: Ponto;
    onEditar: () => void;
    onExcluir: () => void;
}) {
    const horarioExibicao = ponto.horario || ponto.diasHorarios || 'Não informado';
    const tipoExibicao = ponto.tipo
        ? ponto.tipo.charAt(0).toUpperCase() + ponto.tipo.slice(1).toLowerCase()
        : ponto.funcionamento || 'Não informado';

    return (
        <View style={styles.cardDetalhe}>
            <Text style={styles.nome}>{ponto.nome}</Text>

            <View style={styles.divisor} />

            <Text style={styles.label}>Endereço</Text>
            <Text style={styles.valor}>{ponto.endereco}</Text>

            {ponto.bairro ? (
                <>
                    <Text style={styles.label}>Bairro</Text>
                    <Text style={styles.valor}>{ponto.bairro}</Text>
                </>
            ) : null}

            <Text style={styles.label}>Horário</Text>
            <Text style={styles.valor}>{horarioExibicao}</Text>

            <Text style={styles.label}>Tipo</Text>
            <Text style={styles.tipoValor}>{tipoExibicao}</Text>

            <TouchableOpacity
                style={styles.btnEditar}
                onPress={onEditar}
                activeOpacity={0.8}
            >
                <Text style={styles.btnEditarText}>Editar Ponto</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.btnExcluir}
                onPress={onExcluir}
                activeOpacity={0.8}
            >
                <Text style={styles.btnExcluirText}>Excluir Ponto</Text>
            </TouchableOpacity>
        </View>
    );
}

function TelaDetalhePonto({ route, navigation }: Props) {
    const { pontoId } = route.params;
    const [ponto, setPonto] = useState<Ponto | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [naoEncontrado, setNaoEncontrado] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const carregarPonto = useCallback(async () => {
        setCarregando(true);
        setErro(null);
        setNaoEncontrado(false);

        try {
            const dadosPonto = await pontosService.buscarPorId(pontoId);
            if (!dadosPonto) {
                setNaoEncontrado(true);
            } else {
                setPonto(dadosPonto);
            }
        } catch (err: any) {
            if (err instanceof ApiError && err.status === 404) {
                setNaoEncontrado(true);
            } else if (err?.status === 404) {
                setNaoEncontrado(true);
            } else {
                setErro(
                    err?.message ||
                        'Não foi possível carregar os detalhes do ponto. Verifique sua conexão e se a API está online.'
                );
            }
        } finally {
            setCarregando(false);
        }
    }, [pontoId]);

    useFocusEffect(
        useCallback(() => {
            carregarPonto();
        }, [carregarPonto])
    );

    const handleExcluirPonto = (item: Ponto) => {
        Alert.alert(
            'Excluir Ponto',
            `Deseja realmente excluir o ponto "${item.nome}"?`,
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
                            await pontosService.excluir(item.id);
                            Alert.alert('Sucesso', 'Ponto excluído com sucesso!', [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        if (navigation.canGoBack()) {
                                            navigation.goBack();
                                        } else {
                                            navigation.navigate('TelaListaPontos');
                                        }
                                    },
                                },
                            ]);
                        } catch (error: any) {
                            console.error('Erro ao excluir ponto:', error);
                            let msg = 'Não foi possível excluir o ponto. Verifique sua conexão e se a API está online.';
                            if (error instanceof ApiError) {
                                if (error.status === 0) {
                                    msg = 'Não foi possível conectar ao servidor. Verifique se a API está ligada.';
                                } else {
                                    msg = error.message || msg;
                                }
                            } else if (error?.message) {
                                msg = error.message;
                            }
                            Alert.alert('Erro', msg);
                        }
                    },
                },
            ]
        );
    };

    if (carregando) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Carregando detalhes do ponto...</Text>
            </View>
        );
    }

    if (naoEncontrado) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorIcon}>🔍</Text>
                <Text style={styles.erroText}>ponto não encontrado</Text>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Text style={styles.actionButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (erro) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorTitle}>Erro ao carregar detalhes</Text>
                <Text style={styles.erroMensagem}>{erro}</Text>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={carregarPonto}
                    activeOpacity={0.8}
                >
                    <Text style={styles.actionButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!ponto) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.erroText}>ponto não encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.detalheScroll}>
            <PontoDetalhe
                ponto={ponto}
                onEditar={() => navigation.navigate('TelaFormularioPonto', { pontoId: ponto.id })}
                onExcluir={() => handleExcluirPonto(ponto)}
            />
        </ScrollView>
    );
}

export default TelaDetalhePonto;

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
        padding: theme.spacing['2xl'],
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
        marginVertical: theme.spacing.sm,
    },
    label: {
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xs,
    },
    valor: {
        fontSize: theme.fontSize.lg,
        color: theme.colors.textSecondary,
        lineHeight: 22,
    },
    tipoValor: {
        fontSize: theme.fontSize.md,
        fontWeight: '600',
        color: theme.colors.text,
        lineHeight: 20,
    },
    btnEditar: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.lg,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing['2xl'],
    },
    btnEditarText: {
        color: theme.colors.textWhite,
        fontWeight: 'bold',
        fontSize: theme.fontSize.md,
    },
    btnExcluir: {
        backgroundColor: theme.colors.danger,
        borderRadius: theme.borderRadius.lg,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
    },
    btnExcluirText: {
        color: theme.colors.textWhite,
        fontWeight: 'bold',
        fontSize: theme.fontSize.md,
    },
    errorIcon: {
        fontSize: 40,
        marginBottom: theme.spacing.md,
    },
    errorTitle: {
        color: theme.colors.danger,
        fontSize: theme.fontSize.xl,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xs,
    },
    erroText: {
        color: theme.colors.danger,
        fontSize: theme.fontSize.xl,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    erroMensagem: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.md,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    loadingText: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.md,
        marginTop: theme.spacing.md,
    },
    actionButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing['2xl'],
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
    },
    actionButtonText: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
    },
});
