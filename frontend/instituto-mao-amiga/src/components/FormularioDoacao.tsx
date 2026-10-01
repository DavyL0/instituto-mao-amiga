import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';
import { Doacao } from '../types/types';

type DoacaoFormData = {
    tipoItem: string;
    quantidade: number;
    pontoDestino: string;
};

const STORAGE_KEY_LIST = '@institutomaoamiga:doacoes';

const fieldsValidationSchema = yup.object().shape({
    tipoItem: yup
        .string()
        .required('O tipo de item não pode ser vazio'),
    quantidade: yup
        .number()
        .typeError('Digite um número válido')
        .integer('A quantidade deve ser um número inteiro')
        .required('A quantidade não pode ser vazia')
        .min(1, 'Deve conter pelo menos 1 item'),
    pontoDestino: yup
        .string()
        .required('O ponto de destino não pode ser vazio'),
});

type TextFieldProps = TextInputProps & {
    label: string;
    error?: string;
};

const TextField = ({ label, error, ...inputProps }: TextFieldProps) => (
    <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholderTextColor={theme.colors.placeholder}
            {...inputProps}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
);

export const DoacaoScreen = ({ onSuccess }: { onSuccess?: () => void }) => {
    const [historico, setHistorico] = useState<Doacao[]>([]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DoacaoFormData>({
        resolver: yupResolver(fieldsValidationSchema),
        defaultValues: {
            tipoItem: '',
            pontoDestino: '',
        },
    });

    const carregarHistorico = async () => {
        try {
            const doacoesSalvas = await AsyncStorage.getItem(STORAGE_KEY_LIST);
            if (doacoesSalvas) {
                const parsed = JSON.parse(doacoesSalvas);
                setHistorico(Array.isArray(parsed) ? parsed : []);
            } else {
                setHistorico([]);
            }
        } catch (error) {
            console.error('Erro ao carregar histórico de doações:', error);
        }
    };

    useEffect(() => {
        carregarHistorico();
    }, []);

    const onSubmit = async (data: DoacaoFormData) => {
        try {
            const novaDoacao: Doacao = {
                id: Date.now(),
                tipoItem: data.tipoItem.trim(),
                qtdItem: data.quantidade,
                pontoSelecionado: {
                    id: 0,
                    nome: data.pontoDestino.trim(),
                    endereco: '',
                    diasHorarios: '',
                    funcionamento: '',
                },
                criadoEm: new Date().toISOString(),
            };

            const doacoesSalvas = await AsyncStorage.getItem(STORAGE_KEY_LIST);
            const listaAtual: Doacao[] = doacoesSalvas ? JSON.parse(doacoesSalvas) : [];
            const novaLista = [novaDoacao, ...listaAtual];
            await AsyncStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(novaLista));

            setHistorico(novaLista);
            reset();
            onSuccess?.();

            Alert.alert(
                'Doação Registrada com Sucesso!',
                `Item: ${novaDoacao.tipoItem}\nQuantidade: ${novaDoacao.qtdItem}\nDestino: ${novaDoacao.pontoSelecionado.nome}`
            );
        } catch (error) {
            console.error('Erro ao registrar doação:', error);
            Alert.alert('Erro', 'Não foi possível registrar a doação.');
        }
    };

    return (
        <View style={styles.mainContainer}>
            <Controller
                control={control}
                name="tipoItem"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        label="Tipo do Item"
                        placeholder="Ex: Alimentos não perecíveis"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.tipoItem?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="quantidade"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        label="Quantidade"
                        placeholder="Ex: 10"
                        keyboardType="numeric"
                        onBlur={onBlur}
                        onChangeText={(text) => {
                            const parsed = parseInt(text, 10);
                            onChange(isNaN(parsed) ? undefined : parsed);
                        }}
                        value={value !== undefined ? String(value) : ''}
                        error={errors.quantidade?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="pontoDestino"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        label="Ponto de Destino"
                        placeholder="Ex: Catedral Bom Jesus"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.pontoDestino?.message}
                    />
                )}
            />

            <TouchableOpacity
                style={styles.buttonSubmit}
                onPress={handleSubmit(onSubmit)}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonSubmitText}>Registrar Doação</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DoacaoScreen;

const styles = StyleSheet.create({
    mainContainer: {
        padding: theme.spacing['2xl'],
    },
    container: {
        marginBottom: theme.spacing.xl,
    },
    label: {
        marginBottom: theme.spacing.xs,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
        height: 46,
    },
    inputError: {
        borderColor: theme.colors.danger,
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: theme.fontSize.xs,
        marginTop: theme.spacing.xs,
    },
    buttonSubmit: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.lg,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
    },
    buttonSubmitText: {
        color: theme.colors.textWhite,
        fontWeight: 'bold',
        fontSize: theme.fontSize.xl,
    },
    emptyContainer: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing['2xl'],
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    emptyText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textMuted,
        textAlign: 'center',
    },
});