import React, {useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, TextInput} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {pontosMock} from "../mocks/pontosMock";
import {PontoItem} from "../components/PontoItem";
import {theme} from "../theme/theme";
import {NovaDoacaoModal} from "../components/NovaDoacaoModal";

function TelaListaPontos({navigation}: any) {
    const [busca, setBusca] = useState('')
    const pontosFiltrados = useMemo(() => {
        return pontosMock.filter(ponto => ponto.nome.toLowerCase().includes(busca.toLowerCase()))
    }, [busca])

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Pontos de Coleta</Text>
            <TextInput
                style={styles.inputBusca}
                placeholder="Buscar pontos..."
                placeholderTextColor={theme.colors.placeholder}
                value={busca}
                onChangeText={setBusca}
                autoCorrect={false}
            />
            <NovaDoacaoModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={() => {/*todo*/}}/>
            <Pressable
                style={styles.floatingButton}
                onPress={() => setModalVisible(true)}
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
            />
        </SafeAreaView>
    );
}

export default TelaListaPontos;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    titleText: {
        color: theme.colors.text,
        fontSize: theme.fontSize['4xl'],
        fontWeight: 'bold',
        marginLeft: theme.spacing['2xl'],
        marginTop: theme.spacing['2xl'],
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
        paddingBottom: theme.spacing['3xl'],
    },
    floatingButton: {
        backgroundColor: theme.colors.primary,
        width: 44,
        aspectRatio: 1,
        borderRadius: theme.borderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        right: 30,
        elevation: 5,
        shadowColor: theme.colors.shadow,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 999,
    },
    floatingButtonText: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize['4xl'],
        fontWeight: 'bold',
        lineHeight: 32,
    },
});