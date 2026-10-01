import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DoacaoScreen } from '../components/FormularioDoacao';
import { RootStackParamList } from '../types/types';
import { theme } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaFormularioDoacao'>;

const DoacaoFormScreen = ({ navigation }: Props) => {
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
                    <Text style={styles.title}>Registrar Doação</Text>
                    <Text style={styles.subtitle}>
                        Preencha as informações do item para cadastrar no sistema.
                    </Text>
                </View>

                {/* Formulário e Histórico dentro do Card */}
                <View style={styles.card}>
                    <DoacaoScreen />
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