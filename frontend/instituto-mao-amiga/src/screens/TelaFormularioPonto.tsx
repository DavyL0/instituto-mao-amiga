import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormularioPonto } from '../components/FormularioPonto';
import { Ponto, RootStackParamList } from '../types/types';
import { theme } from '../theme/theme';
import * as pontosService from '../services/pontosService';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaFormularioPonto'>;

const TelaFormularioPonto = ({ route, navigation }: Props) => {
    const pontoId = route.params?.pontoId;
    const [pontoParaEditar, setPontoParaEditar] = useState<Ponto | null>(null);
    const [loading, setLoading] = useState<boolean>(Boolean(pontoId));

    useEffect(() => {
        let isMounted = true;
        if (pontoId) {
            pontosService.buscarPorId(pontoId)
                .then((item) => {
                    if (isMounted) {
                        setPontoParaEditar(item || null);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    if (isMounted) {
                        setLoading(false);
                    }
                });
        }
        return () => {
            isMounted = false;
        };
    }, [pontoId]);

    const handleSuccess = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('TelaListaPontos');
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Carregando dados do ponto...</Text>
            </View>
        );
    }

    const isEditing = Boolean(pontoId);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {isEditing ? 'Editar Ponto' : 'Cadastrar Ponto'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {isEditing
                            ? 'Atualize as informações do ponto selecionado.'
                            : 'Preencha as informações para cadastrar um novo ponto no sistema.'}
                    </Text>
                </View>

                <View style={styles.card}>
                    <FormularioPonto
                        pontoParaEditar={pontoParaEditar}
                        onSuccess={handleSuccess}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default TelaFormularioPonto;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },
    scrollContainer: {
        padding: theme.spacing['2xl'],
    },
    header: {
        marginBottom: theme.spacing['2xl'],
    },
    title: {
        fontSize: theme.fontSize['3xl'],
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textMuted,
        marginTop: theme.spacing.xs,
    },
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: theme.spacing['3xl'],
    },
});
