import {Ponto} from "../types/produto";
import {StyleSheet, TouchableOpacity, Text} from "react-native";
import {theme} from "../theme/theme";

export function PontoItem({ponto, onPress}: { ponto: Ponto; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
            <Text style={styles.nome}>{ponto.nome}</Text>
            <Text style={styles.endereco}>📍 {ponto.endereco}</Text>
            <Text style={styles.diasHorarios}>🕒 {ponto.diasHorarios}</Text>
            <Text style={styles.funcionamento}>{ponto.funcionamento}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing['2xl'],
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    nome: {
        fontSize: theme.fontSize['2xl'],
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    endereco: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
        lineHeight: 20,
    },
    diasHorarios: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.sm,
        lineHeight: 18,
    },
    funcionamento: {
        fontSize: theme.fontSize.xs,
        fontWeight: '600',
        color: theme.colors.primary,
    },
});