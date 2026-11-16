import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {PontoItem} from "../components/PontoItem";
import {theme} from "../theme/theme";
import {NovaDoacaoModal} from "../components/NovaDoacaoModal";
import {Doacao, Ponto, RootStackParamList} from "../types/types";
import {carregarHistorico} from "../services/doacoesService";
import * as pontosService from "../services/pontosService";

type Props = NativeStackScreenProps<RootStackParamList, 'TelaListaPontos'>;

const ITENS_POR_PAGINA = 5;

function TelaListaPontos({navigation}: Props) {
    const [busca, setBusca] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [doacoes, setDoacoes] = useState<Doacao[]>([]);

    const [pontos, setPontos] = useState<Ponto[]>([]);
    const [pagina, setPagina] = useState(1);
    const [carregandoInicial, setCarregandoInicial] = useState(true);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [recarregando, setRecarregando] = useState(false);
    const [temMais, setTemMais] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    // Evitar múltiplas requisições simultâneas ou da mesma página
    const requisicaoEmAndamento = useRef(false);
    const ultimaPaginaRequisitada = useRef(0);

    const carregarDadosDoacoes = async () => {
        const dados = await carregarHistorico();
        setDoacoes(dados);
    };

    useFocusEffect(
        useCallback(() => {
            carregarDadosDoacoes();
            buscarPontosPrimeiraPagina(busca, true);
        }, [busca, buscarPontosPrimeiraPagina])
    );

    const buscarPontosPrimeiraPagina = useCallback(async (termoBusca: string, ehRefresh = false) => {
        if (requisicaoEmAndamento.current && !ehRefresh) return;

        requisicaoEmAndamento.current = true;
        ultimaPaginaRequisitada.current = 1;

        if (ehRefresh) {
            setRecarregando(true);
        } else {
            setCarregandoInicial(true);
        }
        setErro(null);

        try {
            const novosPontos = await pontosService.buscarPagina(1, ITENS_POR_PAGINA, termoBusca);
            setPontos(novosPontos);
            setPagina(1);
            setTemMais(novosPontos.length >= ITENS_POR_PAGINA);
        } catch (err: any) {
            setErro(err?.message || 'Não foi possível carregar os pontos de coleta. Verifique sua conexão e se a API está online.');
        } finally {
            setCarregandoInicial(false);
            setRecarregando(false);
            requisicaoEmAndamento.current = false;
        }
    }, []);

    // Busca ao alterar o texto de busca ou ao montar a tela
    useEffect(() => {
        const timer = setTimeout(() => {
            buscarPontosPrimeiraPagina(busca);
        }, 300);

        return () => clearTimeout(timer);
    }, [busca, buscarPontosPrimeiraPagina]);

    const handleCarregarMais = async () => {
        if (
            requisicaoEmAndamento.current ||
            carregandoInicial ||
            carregandoMais ||
            !temMais ||
            erro
        ) {
            return;
        }

        const proximaPagina = pagina + 1;
        if (ultimaPaginaRequisitada.current === proximaPagina) {
            return;
        }

        requisicaoEmAndamento.current = true;
        ultimaPaginaRequisitada.current = proximaPagina;
        setCarregandoMais(true);

        try {
            const novosPontos = await pontosService.buscarPagina(proximaPagina, ITENS_POR_PAGINA, busca);

            if (novosPontos.length === 0) {
                setTemMais(false);
            } else {
                setPontos((prev) => {
                    const idsExistentes = new Set(prev.map((p) => p.id));
                    const filtrados = novosPontos.filter((p) => !idsExistentes.has(p.id));
                    return [...prev, ...filtrados];
                });
                setPagina(proximaPagina);
                if (novosPontos.length < ITENS_POR_PAGINA) {
                    setTemMais(false);
                }
            }
        } catch (err: any) {
            // Em erro ao carregar páginas adicionais, evita crash e preserva dados já carregados
            Alert.alert(
                'Aviso',
                'Não foi possível carregar mais pontos de coleta. Verifique sua conexão.'
            );
        } finally {
            setCarregandoMais(false);
            requisicaoEmAndamento.current = false;
        }
    };

    const handleRefresh = () => {
        buscarPontosPrimeiraPagina(busca, true);
    };

    const resumoDoacoes = useMemo(() => {
        const totalDoacoes = doacoes.length;
        const totalItens = doacoes.reduce((acc, d) => acc + (Number(d.qtdItem) || 0), 0);

        const porTipo: Record<string, { quantidade: number; doacoes: number }> = {};

        doacoes.forEach((doacao) => {
            const tipo = doacao.tipoItem || 'Outros';
            if (!porTipo[tipo]) {
                porTipo[tipo] = { quantidade: 0, doacoes: 0 };
            }
            porTipo[tipo].quantidade += Number(doacao.qtdItem) || 0;
            porTipo[tipo].doacoes += 1;
        });

        return {
            totalDoacoes,
            totalItens,
            porTipo,
        };
    }, [doacoes]);

    const handleSalvarDoacao = (doacao: Doacao) => {
        carregarDadosDoacoes();
        Alert.alert(
            'Doação Registrada com Sucesso!',
            `Item: ${doacao.tipoItem}\nQuantidade: ${doacao.qtdItem}\nPonto: ${doacao.pontoSelecionado.nome}`
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Pontos de Coleta</Text>
                </View>
                <TouchableOpacity
                    style={styles.btnNovoPonto}
                    onPress={() => navigation.navigate('TelaFormularioPonto')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.btnNovoPontoText}>+ Novo Ponto</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.inputBusca}
                placeholder="Buscar pontos..."
                placeholderTextColor={theme.colors.placeholder}
                value={busca}
                onChangeText={setBusca}
                autoCorrect={false}
            />

            <View style={styles.resumoContainer}>
                <View style={styles.resumoHeader}>
                    <Text style={styles.resumoTitulo}>Resumo de Doações</Text>
                    <Text style={styles.resumoTotalGeral}>
                        Total: {resumoDoacoes.totalDoacoes} {resumoDoacoes.totalDoacoes === 1 ? 'doação' : 'doações'} ({resumoDoacoes.totalItens} {resumoDoacoes.totalItens === 1 ? 'item' : 'itens'})
                    </Text>
                </View>

                {resumoDoacoes.totalDoacoes === 0 ? (
                    <Text style={styles.resumoVazioTexto}>Nenhuma doação registrada ainda.</Text>
                ) : (
                    <View style={styles.resumoLista}>
                        {Object.entries(resumoDoacoes.porTipo).map(([tipo, dados]) => (
                            <View key={tipo} style={styles.resumoItemLinha}>
                                <Text style={styles.resumoItemBullet}>•</Text>
                                <Text style={styles.resumoItemTexto}>
                                    <Text style={styles.resumoItemNome}>{tipo}: </Text>
                                    {dados.quantidade} {dados.quantidade === 1 ? 'unidade' : 'unidades'} em {dados.doacoes} {dados.doacoes === 1 ? 'doação' : 'doações'}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <NovaDoacaoModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSalvarDoacao}
            />

            <Pressable
                style={styles.floatingButton}
                onPress={() => navigation.navigate('TelaFormularioPonto')}
                accessibilityLabel="Cadastrar novo ponto"
                accessibilityRole="button"
            >
                <Text style={styles.floatingButtonText}>+</Text>
            </Pressable>

            <FlatList
                data={pontos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <PontoItem
                        ponto={item}
                        onPress={() => navigation.navigate('TelaDetalhePonto', {pontoId: item.id})}
                    />
                )}
                contentContainerStyle={styles.listaContainer}
                onEndReached={handleCarregarMais}
                onEndReachedThreshold={0.2}
                refreshControl={
                    <RefreshControl
                        refreshing={recarregando}
                        onRefresh={handleRefresh}
                        tintColor={theme.colors.primary}
                        colors={[theme.colors.primary]}
                    />
                }
                ListFooterComponent={
                    carregandoMais ? (
                        <View style={styles.footerLoading}>
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    carregandoInicial ? (
                        <View style={styles.emptyContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={styles.loadingText}>Carregando pontos de coleta...</Text>
                        </View>
                    ) : erro ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorIcon}>⚠️</Text>
                            <Text style={styles.errorTitle}>Erro ao carregar pontos</Text>
                            <Text style={styles.errorText}>{erro}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={() => buscarPontosPrimeiraPagina(busca)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhum ponto de coleta encontrado.</Text>
                        </View>
                    )
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing['2xl'],
        paddingTop: theme.spacing['2xl'],
        paddingBottom: theme.spacing.xs,
    },
    titleContainer: {
        flex: 1,
    },
    titleText: {
        color: theme.colors.text,
        fontSize: theme.fontSize['3xl'],
        fontWeight: 'bold',
    },
    btnNovoPonto: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
    btnNovoPontoText: {
        color: theme.colors.textWhite,
        fontWeight: 'bold',
        fontSize: theme.fontSize.sm,
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
    resumoContainer: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        marginHorizontal: theme.spacing['2xl'],
        marginBottom: theme.spacing.md,
        padding: theme.spacing['2xl'],
    },
    resumoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: theme.spacing.sm,
    },
    resumoTitulo: {
        color: theme.colors.text,
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
    },
    resumoTotalGeral: {
        color: theme.colors.primary,
        fontSize: theme.fontSize.xs,
        fontWeight: '600',
    },
    resumoVazioTexto: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.sm,
        fontStyle: 'italic',
    },
    resumoLista: {
        marginTop: theme.spacing.xs,
        gap: theme.spacing.xs,
    },
    resumoItemLinha: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resumoItemBullet: {
        color: theme.colors.primary,
        fontSize: theme.fontSize.sm,
        marginRight: theme.spacing.sm,
    },
    resumoItemTexto: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.sm,
    },
    resumoItemNome: {
        fontWeight: '600',
        color: theme.colors.text,
    },
    listaContainer: {
        paddingHorizontal: theme.spacing['2xl'],
        paddingBottom: 80,
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
    loadingText: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.md,
        marginTop: theme.spacing.md,
    },
    footerLoading: {
        paddingVertical: theme.spacing.xl,
        alignItems: 'center',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing['3xl'],
        paddingHorizontal: theme.spacing['2xl'],
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.danger,
        marginVertical: theme.spacing.xl,
    },
    errorIcon: {
        fontSize: 32,
        marginBottom: theme.spacing.sm,
    },
    errorTitle: {
        color: theme.colors.danger,
        fontSize: theme.fontSize.xl,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xs,
    },
    errorText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.md,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    retryButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing['2xl'],
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
    },
    retryButtonText: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
    },
    floatingButton: {
        position: 'absolute',
        right: theme.spacing['2xl'],
        bottom: 80,
        backgroundColor: theme.colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.shadow,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        zIndex: 999,
    },
    floatingButtonText: {
        color: theme.colors.textWhite,
        fontSize: 32,
        lineHeight: 34,
        fontWeight: 'bold',
    },
    taskBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: theme.colors.cardBackground,
        borderTopWidth: 1,
        borderTopColor: theme.colors.cardBorder,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: theme.spacing.xs,
    },
    taskBarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xs,
    },
    taskBarItemActive: {
        borderTopWidth: 2,
        borderTopColor: theme.colors.primary,
    },
    taskBarIcon: {
        fontSize: 20,
        marginBottom: 2,
    },
    taskBarLabel: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textMuted,
        fontWeight: '500',
    },
    taskBarLabelActive: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});
