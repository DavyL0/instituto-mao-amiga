import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {DoacaoScreen} from "../components/FormularioDoacao";

const DoacaoFormScreen = () => {
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

                {/* Formuário (Componente Criado) dentro de um Card */}
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
        backgroundColor: '#f4f6f8',
    },
    scrollContainer: {
        padding: 20,
        paddingTop: 40,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        elevation: 3, // Sombra Android
        shadowColor: '#000', // Sombra iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});