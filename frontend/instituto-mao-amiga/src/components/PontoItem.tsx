import React from 'react';
import { Ponto } from '../types/types';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../theme/theme';

export function PontoItem({ ponto, onPress, favorito, onAlternarFavorito, favoritoDesabilitado }: {
    ponto: Ponto;
    onPress: () => void;
    favorito?: boolean;
    onAlternarFavorito?: () => void;
    favoritoDesabilitado?: boolean;
}) {
    const enderecoFormatado = ponto.bairro
        ? `${ponto.endereco} - ${ponto.bairro}`
        : ponto.endereco;

    const horarioExibicao = ponto.horario || ponto.diasHorarios;

    const tipoExibicao = ponto.tipo
        ? ponto.tipo.charAt(0).toUpperCase() + ponto.tipo.slice(1).toLowerCase()
        : ponto.funcionamento || '';

    return (
        <View style={styles.card}>
          <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
            <View style={styles.headerRow}>
                <Text style={styles.nome}>{ponto.nome}</Text>
                {tipoExibicao ? (
                    <View style={styles.tipoBadge}>
                        <Text style={styles.tipoBadgeText}>{tipoExibicao}</Text>
                    </View>
                ) : null}
            </View>
            <Text style={styles.endereco}>{enderecoFormatado}</Text>
            {horarioExibicao ? (
                <Text style={styles.diasHorarios}>🕒 {horarioExibicao}</Text>
            ) : null}
          </TouchableOpacity>
          {onAlternarFavorito && (
              <TouchableOpacity
                  style={styles.favorito}
                  onPress={onAlternarFavorito}
                  disabled={favoritoDesabilitado}
                  accessibilityRole="button"
                  accessibilityLabel={`${favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}: ${ponto.nome}`}
                  accessibilityState={{checked: !!favorito, disabled: !!favoritoDesabilitado}}
              >
                  <Text style={styles.favoritoTexto}>{favorito ? '♥' : '♡'}</Text>
              </TouchableOpacity>
          )}
        </View>
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    favorito: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    favoritoTexto: {
        color: theme.colors.primary,
        fontSize: 28,
    },
    nome: {
        fontSize: theme.fontSize['2xl'],
        fontWeight: 'bold',
        color: theme.colors.text,
        flex: 1,
    },
    tipoBadge: {
        backgroundColor: theme.colors.iconSurface,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    tipoBadgeText: {
        fontSize: theme.fontSize.xs,
        fontWeight: 'bold',
        color: theme.colors.primary,
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
        lineHeight: 18,
    },
});
