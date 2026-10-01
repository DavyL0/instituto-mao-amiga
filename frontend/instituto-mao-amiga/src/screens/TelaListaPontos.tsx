import React, {useMemo, useState} from 'react';
import {Alert, FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {pontosMock} from "../mocks/pontosMock";
import {PontoItem} from "../components/PontoItem";
import {theme} from "../theme/theme";
import {NovaDoacaoModal} from "../components/NovaDoacaoModal";
import {Doacao, RootStackParamList} from "../types/types";

type Props = NativeStackScreenProps<RootStackParamList, 'TelaListaPontos'>;

function TelaListaPontos({navigation}: Props) {
    const [busca, setBusca] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const pontosFiltrados = useMemo(() => {
        return pontosMock.filter(ponto =>
            ponto.nome.toLowerCase().includes(busca.toLowerCase()) ||
            ponto.endereco.toLowerCase().includes(busca.toLowerCase())
        );
    }, [busca]);

    const handleSalvarDoacao = (doacao: Doacao) => {
        Alert.alert(
            'Doação Registrada com Sucesso!',
            `Item: ${doacao.tipoItem}\nQuantidade: ${doacao.qtdItem}\nPonto: ${doacao.pontoSelecionado.nome}`
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <Text style={styles.titleText}>Pontos de Coleta</Text>
            </View>

            <TextInput
                style={styles.inputBusca}
                placeholder="Buscar pontos..."
                placeholderTextColor={theme.colors.placeholder}
                value={busca}
                onChangeText={setBusca}
                autoCorrect={false}
            />

            <NovaDoacaoModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSalvarDoacao}
            />

            <Pressable
                style={styles.floatingButton}
                onPress={() => setModalVisible(true)}
                accessibilityLabel="Adicionar nova doação"
                accessibilityRole="button"
            >
                <Text style={styles.floatingButtonText}>+</Text>
            </Pressable>

            <FlatList
                data={pontosFiltrados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <PontoItem
                        ponto={item}
                        onPress={() => navigation.navigate('TelaDetalhePonto', {pontoId: item.id})}
                    />
                )}
                contentContainerStyle={styles.listaContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum ponto de coleta encontrado.</Text>
                    </View>
                }
            />

            {/* Task Bar / Bottom Navigation Bar */}
            <View style={styles.taskBar}>
                <TouchableOpacity
                    style={[styles.taskBarItem, styles.taskBarItemActive]}
                    activeOpacity={0.7}
                >
                    <Text style={styles.taskBarIcon}>📍</Text>
                    <Text style={[styles.taskBarLabel, styles.taskBarLabelActive]}>Pontos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.taskBarItem}
                    onPress={() => navigation.navigate('TelaDoacoes')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.taskBarIcon}>🎁</Text>
                    <Text style={styles.taskBarLabel}>Doações</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.taskBarItem}
                    onPress={() => navigation.navigate('TelaFormularioDoacao')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.taskBarIcon}>📝</Text>
                    <Text style={styles.taskBarLabel}>Cadastrar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default TelaListaPontos;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing['2xl'],
        paddingTop: theme.spacing['2xl'],
    },
    titleText: {
        color: theme.colors.text,
        fontSize: theme.fontSize['4xl'],
        fontWeight: 'bold',
    },
    inputBusca: {
        backgroundColor: theme.colors.cardBackground,
        color: theme.colors.text,
        height: 50,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing['2xl'],
        fontSize: theme.fontSize.xl,
        marginHorizontal: theme.spacing['2xl'],
        marginTop: theme.spacing['2xl'],
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    listaContainer: {
        padding: theme.spacing['2xl'],
        paddingBottom: 90,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing['4xl'],
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.lg,
    },
    floatingButton: {
        backgroundColor: theme.colors.primary,
        width: 48,
        aspectRatio: 1,
        borderRadius: theme.borderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 84,
        right: 24,
        elevation: 6,
        shadowColor: theme.colors.shadow,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 999,
    },
    floatingButtonText: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize['4xl'],
        fontWeight: 'bold',
        lineHeight: 32,
    },
    taskBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 68,
        backgroundColor: theme.colors.cardBackground,
        borderTopWidth: 1,
        borderTopColor: theme.colors.cardBorder,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 6,
        paddingTop: 6,
        elevation: 8,
        shadowColor: theme.colors.shadow,
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    taskBarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },
    taskBarItemActive: {
        opacity: 1,
    },
    taskBarIcon: {
        fontSize: 20,
        marginBottom: 2,
    },
    taskBarLabel: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    taskBarLabelActive: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});