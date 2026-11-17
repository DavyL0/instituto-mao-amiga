import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DoacaoScreen } from '../components/FormularioDoacao';
import { Doacao, RootStackParamList } from '../types/types';
import { theme } from '../theme/theme';
import { obterDoacaoPorId } from '../services/doacoesService';
import { ApiError } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaFormularioDoacao'>;

const DoacaoFormScreen = ({ route, navigation }: Props) => {
    const doacaoId = route.params?.doacaoId;
    const [doacaoParaEditar, setDoacaoParaEditar] = useState<Doacao | null>(null);
    const [loading, setLoading] = useState<boolean>(doacaoId != null);
    const [erro, setErro] = useState('');
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        let isMounted = true;
        if (doacaoId != null) {
            setLoading(true);
            setErro('');
            setDoacaoParaEditar(null);
            obterDoacaoPorId(doacaoId)
                .then((item) => {
                    if (isMounted) {
                        setDoacaoParaEditar(item || null);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    if (isMounted) {
                        setErro('Não foi possível carregar a doação para edição.');
                        setLoading(false);
                    }
                });
        }
        return () => {
            isMounted = false;
        };
    }, [doacaoId, tentativa]);

    const handleSuccess = () => {
        if (doacaoId != null) {
            navigation.goBack();
        } else {
            navigation.popTo('TelaDoacoes');
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Carregando dados da doação...</Text>
            </View>
        );
    }

    const isEditing = doacaoId != null;

    if (isEditing && !doacaoParaEditar) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>{erro || 'Doação não encontrada.'}</Text>
                <TouchableOpacity onPress={() => setTentativa((valor) => valor + 1)}>
                    <Text style={styles.loadingText}>Tentar novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (isEditing && !doacaoParaEditar) {
        return <View style={styles.centerContainer}><Text style={styles.loadingText}>{erro || 'Doação não encontrada.'}</Text></View>;
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                {/* Cabeçalho da Tela */}
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {isEditing ? 'Editar Doação' : 'Registrar Doação'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {isEditing
                            ? 'Atualize as informações da doação selecionada.'
                            : 'Preencha as informações do item para cadastrar no sistema.'}
                    </Text>
                </View>

                {/* Formulário dentro do Card */}
                <View style={styles.card}>
                    <DoacaoScreen
                        doacaoParaEditar={doacaoParaEditar}
                        onSuccess={handleSuccess}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default DoacaoFormScreen;

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