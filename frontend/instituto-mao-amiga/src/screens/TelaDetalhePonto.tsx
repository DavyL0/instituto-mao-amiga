import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {pontosMock} from "../mocks/pontosMock";
import {Ponto} from "../types/produto";
import {theme} from "../theme/theme";

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

function TelaDetalhePonto({route}: any) {
    const {pontoId} = route.params;
    const ponto = pontosMock.find((item) => item.id === pontoId);

    if (!ponto) {
        return (
            <View style={styles.container}>
                <Text style={styles.erroText}>Ponto de coleta não encontrado.</Text>
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
    erroText: {
        color: theme.colors.danger,
        fontSize: theme.fontSize.xl,
        textAlign: 'center',
        marginTop: theme.spacing['4xl'],
    },
});