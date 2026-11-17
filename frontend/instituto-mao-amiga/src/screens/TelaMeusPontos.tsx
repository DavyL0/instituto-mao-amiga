import React, {useCallback, useRef, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PontoItem} from '../components/PontoItem';
import {alternarFavorito, listarFavoritos} from '../services/favoritosService';
import * as pontosService from '../services/pontosService';
import {theme} from '../theme/theme';
import {Ponto, RootStackParamList} from '../types/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaMeusPontos'>;

export default function TelaMeusPontos({navigation}: Props) {
    const [pontos, setPontos] = useState<Ponto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);
    const [tentativa, setTentativa] = useState(0);
    const [salvando, setSalvando] = useState(false);
    const salvandoRef = useRef(false);

    useFocusEffect(useCallback(() => {
        let ativo = true;
        setCarregando(true);
        setErro(false);
        const carregar = async () => {
            try {
                const ids = await listarFavoritos();
                const resultados = await Promise.all(ids.map(async (id) => {
                    try {
                        return await pontosService.buscarPorId(id);
                    } catch (error: unknown) {
                        if (typeof error === 'object' && error !== null && 'status' in error && error.status === 404) return null;
                        throw error;
                    }
                }));
                if (ativo) setPontos(resultados.filter((ponto): ponto is Ponto => ponto !== null));
            } catch {
                if (ativo) {
                    setPontos([]);
                    setErro(true);
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        };
        carregar();
        return () => { ativo = false; };
    }, [tentativa]));

    const remover = async (ponto: Ponto) => {
        if (salvandoRef.current) return;
        salvandoRef.current = true;
        setSalvando(true);
        setPontos((anteriores) => anteriores.filter((item) => String(item.id) !== String(ponto.id)));
        try {
            await alternarFavorito(ponto.id);
        } catch {
            setPontos((anteriores) => [...anteriores, ponto]);
            Alert.alert('Erro', 'Não foi possível remover o favorito.');
        } finally {
            salvandoRef.current = false;
            setSalvando(false);
        }
    };

    return (
        <View style={styles.container}>
            {carregando ? (
                <ActivityIndicator style={styles.estado} size="large" color={theme.colors.primary} />
            ) : erro ? (
                <View style={styles.estado}>
                    <Text style={styles.texto}>Não foi possível carregar seus pontos. Verifique sua conexão.</Text>
                    <TouchableOpacity style={styles.botao} onPress={() => setTentativa((valor) => valor + 1)}>
                        <Text style={styles.botaoTexto}>Tentar novamente</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={pontos}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.lista}
                    renderItem={({item}) => (
                        <PontoItem
                            ponto={item}
                            onPress={() => navigation.navigate('TelaDetalhePonto', {pontoId: item.id})}
                            favorito
                            onAlternarFavorito={() => remover(item)}
                            favoritoDesabilitado={salvando}
                        />
                    )}
                    ListEmptyComponent={<Text style={[styles.texto, styles.estado]}>Você ainda não possui pontos favoritos.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.colors.background},
    lista: {padding: theme.spacing['2xl']},
    estado: {alignItems: 'center', padding: theme.spacing['3xl']},
    texto: {color: theme.colors.textMuted, fontSize: theme.fontSize.lg, textAlign: 'center'},
    botao: {backgroundColor: theme.colors.primary, padding: theme.spacing.md, marginTop: theme.spacing.lg, borderRadius: theme.borderRadius.sm},
    botaoTexto: {color: theme.colors.textWhite, fontWeight: 'bold'},
});