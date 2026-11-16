import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Ponto, RootStackParamList} from "../types/types";
import {theme} from "../theme/theme";
import * as pontosService from "../services/pontosService";
import {ApiError} from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, 'TelaDetalhePonto'>;

function PontoDetalhe({ponto}: { ponto: Ponto }) {
    return (
        <View style={styles.cardDetalhe}>
            <Text style={styles.nome}>{ponto.nome}</Text>

            <View style={styles.divisor}/>

            <Text style={styles.label}>Endereço</Text>
            <Text style={styles.endereco}>{ponto.endereco}</Text>

            <Text style={styles.label}>Dias e Horários</Text>
            <Text style={styles.diasHorarios}>{ponto.diasHorarios}</Text>

            <Text style={styles.label}>Atendimento</Text>
            <Text style={styles.funcionamento}>{ponto.funcionamento}</Text>
        </View>
    );
}

function TelaDetalhePonto({route, navigation}: Props) {
    const {pontoId} = route.params;
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
                setErro(err?.message || 'Não foi possível carregar os detalhes do ponto. Verifique sua conexão e se a API está online.');
            }
        } finally {
            setCarregando(false);
        }
    }, [pontoId]);

    useEffect(() => {
        carregarPonto();
    }, [carregarPonto]);

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
            <PontoDetalhe ponto={ponto}/>
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
    },
    label: {
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginTop: theme.spacing.xl,
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
