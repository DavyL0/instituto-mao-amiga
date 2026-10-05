import {Doacao, Ponto, TipoItem} from "../types/types";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {theme} from "../theme/theme";
import React, { useEffect, useState } from "react";
import {pontosMock} from "../mocks/pontosMock";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NovoPontoModalProps = {
    visible: boolean;
    onClose: () => void;
    onSave: (doacao: Doacao) => void;
};

type ErrosForm = {
    tipoItem?: string;
    qtdItem?: string;
    ponto?: string;
};

const STORAGE_KEY_LIST = '@institutomaoamiga:doacoes';
const STORAGE_KEY_DRAFT = '@institutomaoamiga:draft_doacao';

export function NovaDoacaoModal(
    {visible, onClose, onSave}: NovoPontoModalProps
) {
    const [tipoItem, setTipoItem] = useState<TipoItem | ''>('');
    const [tipoDropdownAberto, setTipoDropdownAberto] = useState(false);
    const [qtdItem, setQtdItem] = useState('');
    const [pontoSelecionado, setPontoSelecionado] = useState<Ponto | null>(null);
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [erros, setErros] = useState<ErrosForm>({});

    function validar(): boolean {
        const novosErros: ErrosForm = {};

        if (!tipoItem) {
            novosErros.tipoItem = 'O tipo do item é obrigatório.';
        }

        const qtdNumerica = Number(qtdItem.trim().replace(',', '.'));
        if (!qtdItem.trim()) {
            novosErros.qtdItem = 'A quantidade é obrigatória.';
        } else if (isNaN(qtdNumerica) || qtdNumerica <= 0) {
            novosErros.qtdItem = 'Informe uma quantidade válida maior que zero.';
        } else if (!Number.isInteger(qtdNumerica)) {
            novosErros.qtdItem = 'A quantidade deve ser um número inteiro.';
        }

        if (!pontoSelecionado) {
            novosErros.ponto = 'Selecione o ponto de destino.';
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    async function salvar() {
        if (!validar()) return;

        const qtdNumerica = Number(qtdItem.trim().replace(',', '.'));

        const novaDoacao: Doacao = {
            id: Date.now(),
            tipoItem: tipoItem,
            qtdItem: qtdNumerica,
            pontoSelecionado: pontoSelecionado!,
            criadoEm: new Date().toISOString()
        };

        try {
            const doacoesSalvas = await AsyncStorage.getItem(STORAGE_KEY_LIST);
            const listaAtual: Doacao[] = doacoesSalvas ? JSON.parse(doacoesSalvas) : [];
            const novaLista = [novaDoacao, ...listaAtual];
            await AsyncStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(novaLista));
            await AsyncStorage.removeItem(STORAGE_KEY_DRAFT);
        } catch (error) {
            console.error('Erro ao salvar doação:', error);
        }

        limparFormulario();
        onSave(novaDoacao);
    }

    useEffect(() => {
        if (!visible) return;

        const dados = {
            tipoItem,
            qtdItem,
            pontoSelecionado,
        };

        AsyncStorage.setItem(
            STORAGE_KEY_DRAFT,
            JSON.stringify(dados)
        ).catch((error) => {
            console.error('Erro ao salvar rascunho:', error);
        });
    }, [tipoItem, qtdItem, pontoSelecionado, visible]);

    useEffect(() => {
        if (visible) {
            carregarFormulario();
        }
    }, [visible]);

    async function carregarFormulario() {
        try {
            const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY_DRAFT);

            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);

                setTipoItem(dados.tipoItem ?? '');
                setQtdItem(dados.qtdItem ?? '');
                setPontoSelecionado(dados.pontoSelecionado ?? null);
            }
        } catch (error) {
            console.error('Erro ao carregar rascunho:', error);
        }
    }

    function limparFormulario() {
        setTipoItem('');
        setTipoDropdownAberto(false);
        setQtdItem('');
        setPontoSelecionado(null);
        setErros({});
        setDropdownAberto(false);
    }

    function fechar() {
        limparFormulario();
        onClose();
    }

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={fechar}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalBackdrop}
            >
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={fechar}
                />
                <View style={styles.modalCard}>
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHeaderTitleGroup}>
                            <Text style={styles.modalTitle}>Registrar Nova Doação</Text>
                        </View>
                        <TouchableOpacity
                            onPress={fechar}
                            style={styles.closeButton}
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.formScrollContainer}
                    >
                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Item Doado*</Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.selectTrigger,
                                    erros.tipoItem ? styles.inputError : null
                                ]}
                                onPress={() => {
                                    setTipoDropdownAberto(prev => !prev);
                                    if (dropdownAberto) setDropdownAberto(false);
                                }}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styles.selectTriggerText,
                                        !tipoItem && styles.placeholderText
                                    ]}
                                >
                                    {tipoItem || 'Selecione o tipo do item'}
                                </Text>
                            </TouchableOpacity>
                            {erros.tipoItem ? <Text style={styles.errorText}>{erros.tipoItem}</Text> : null}
                            {tipoDropdownAberto && (
                                <View style={styles.dropdownContainer}>
                                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                                        {Object.values(TipoItem).map(itemTipo => {
                                            const selecionado = tipoItem === itemTipo;
                                            return (
                                                <TouchableOpacity
                                                    key={itemTipo}
                                                    style={[
                                                        styles.dropdownItem,
                                                        selecionado && styles.dropdownItemSelected
                                                    ]}
                                                    onPress={() => {
                                                        setTipoItem(itemTipo);
                                                        setTipoDropdownAberto(false);
                                                        if (erros.tipoItem) {
                                                            setErros(prev => ({
                                                                ...prev,
                                                                tipoItem: undefined
                                                            }));
                                                        }
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dropdownItemText,
                                                            selecionado && styles.dropdownItemTextSelected
                                                        ]}
                                                    >
                                                        {itemTipo}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Quantidade*</Text>
                            <TextInput
                                style={[
                                    styles.modalInput,
                                    erros.qtdItem ? styles.inputError : null
                                ]}
                                keyboardType='number-pad'
                                placeholder="Ex: 5"
                                placeholderTextColor={theme.colors.placeholder}
                                value={qtdItem}
                                onChangeText={(text) => {
                                    setQtdItem(text);
                                    if (erros.qtdItem) {
                                        setErros(prev => ({
                                            ...prev,
                                            qtdItem: undefined
                                        }));
                                    }
                                }}
                            />
                            {erros.qtdItem ? <Text style={styles.errorText}>{erros.qtdItem}</Text> : null}
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Ponto de Destino*</Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.selectTrigger,
                                    erros.ponto ? styles.inputError : null
                                ]}
                                onPress={() => {
                                    setDropdownAberto(prev => !prev);
                                    if (tipoDropdownAberto) setTipoDropdownAberto(false);
                                }}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styles.selectTriggerText,
                                        !pontoSelecionado && styles.placeholderText
                                    ]}
                                >
                                    {pontoSelecionado ? pontoSelecionado.nome : 'Selecione um ponto'}
                                </Text>
                            </TouchableOpacity>
                            {erros.ponto ? <Text style={styles.errorText}>{erros.ponto}</Text> : null}
                            {dropdownAberto && (
                                <View style={styles.dropdownContainer}>
                                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                                        {pontosMock.map(ponto => {
                                            const selecionado = pontoSelecionado?.id === ponto.id;
                                            return (
                                                <TouchableOpacity
                                                    key={ponto.id}
                                                    style={[
                                                        styles.dropdownItem,
                                                        selecionado && styles.dropdownItemSelected
                                                    ]}
                                                    onPress={() => {
                                                        setPontoSelecionado(ponto);
                                                        setDropdownAberto(false);
                                                        if (erros.ponto) {
                                                            setErros(prev => ({
                                                                ...prev,
                                                                ponto: undefined
                                                            }));
                                                        }
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dropdownItemText,
                                                            selecionado && styles.dropdownItemTextSelected
                                                        ]}
                                                    >
                                                        {ponto.nome}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.buttonCancel}
                            onPress={fechar}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.buttonCancelText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonSave}
                            onPress={salvar}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonSaveText}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: theme.colors.modalBackground,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    modalCard: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        width: '100%',
        maxWidth: 500,
        maxHeight: '90%',
        padding: theme.spacing.xl,
        shadowColor: theme.colors.shadow,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cardBorder,
    },
    modalHeaderTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalTitle: {
        color: theme.colors.text,
        fontSize: theme.fontSize.xl,
        fontWeight: 'bold',
    },
    closeButton: {
        width: 32,
        aspectRatio: 1,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.cardBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    formScrollContainer: {
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
    },
    formGroup: {
        marginBottom: 14,
    },
    formRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    inputLabel: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.sm,
        fontWeight: '600',
        marginBottom: 6,
    },
    inputError: {
        borderColor: theme.colors.danger,
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: theme.fontSize.xs,
        marginTop: 4,
    },
    modalInput: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        height: 46,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        fontSize: theme.fontSize.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    selectTrigger: {
        backgroundColor: theme.colors.background,
        height: 46,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectTriggerText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        flex: 1,
        marginRight: 8,
    },
    placeholderText: {
        color: theme.colors.placeholder,
    },
    dropdownContainer: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.cardBorder,
        borderWidth: 1,
        borderRadius: theme.borderRadius.lg,
        marginTop: theme.spacing.xs,
        maxHeight: 180,
        overflow: 'hidden',
    },
    dropdownScroll: {
        flexGrow: 0,
    },
    dropdownItem: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cardBorder,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownItemSelected: {
        backgroundColor: theme.colors.cardBackground,
    },
    dropdownItemText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.md,
        flex: 1,
    },
    dropdownItemTextSelected: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10,
        marginTop: theme.spacing.md,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: theme.colors.cardBorder,
    },
    buttonCancel: {
        paddingVertical: 10,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.cardBorder,
    },
    buttonCancelText: {
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
        fontWeight: '600',
    },
    buttonSave: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.primary,
    },
    buttonSaveText: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
    },
    emptyContainer: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    emptyText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textMuted,
        textAlign: 'center',
    },
});