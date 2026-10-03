import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { theme } from '../theme/theme';
import { Doacao } from '../types/types';
import { criarDoacao, editarDoacao, DoacaoFormData } from '../services/doacoesService';

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

type DoacaoScreenProps = {
    doacaoParaEditar?: Doacao | null;
    onSuccess?: (doacaoSalva?: Doacao) => void;
};

export const DoacaoScreen = ({ doacaoParaEditar, onSuccess }: DoacaoScreenProps) => {
    const isEditing = Boolean(doacaoParaEditar);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DoacaoFormData>({
        resolver: yupResolver(fieldsValidationSchema),
        defaultValues: {
            tipoItem: '',
            quantidade: undefined as unknown as number,
            pontoDestino: '',
        },
    });

    useEffect(() => {
        if (doacaoParaEditar) {
            reset({
                tipoItem: doacaoParaEditar.tipoItem,
                quantidade: doacaoParaEditar.qtdItem,
                pontoDestino:
                    typeof doacaoParaEditar.pontoSelecionado === 'object' && doacaoParaEditar.pontoSelecionado !== null
                        ? doacaoParaEditar.pontoSelecionado.nome
                        : typeof doacaoParaEditar.pontoSelecionado === 'string'
                        ? doacaoParaEditar.pontoSelecionado
                        : '',
            });
        } else {
            reset({
                tipoItem: '',
                quantidade: undefined as unknown as number,
                pontoDestino: '',
            });
        }
    }, [doacaoParaEditar, reset]);

    const onSubmit = async (data: DoacaoFormData) => {
        try {
            if (doacaoParaEditar) {
                const doacaoAtualizada = await editarDoacao(doacaoParaEditar.id, data);
                Alert.alert('Sucesso', 'Doação atualizada com sucesso!');
                onSuccess?.(doacaoAtualizada);
            } else {
                const novaDoacao = await criarDoacao(data);
                reset();
                Alert.alert(
                    'Doação Registrada com Sucesso!',
                    `Item: ${novaDoacao.tipoItem}\nQuantidade: ${novaDoacao.qtdItem}\nDestino: ${
                        typeof novaDoacao.pontoSelecionado === 'object'
                            ? novaDoacao.pontoSelecionado.nome
                            : novaDoacao.pontoSelecionado
                    }`
                );
                onSuccess?.(novaDoacao);
            }
        } catch (error) {
            console.error('Erro ao salvar doação:', error);
            Alert.alert(
                'Erro',
                doacaoParaEditar
                    ? 'Não foi possível atualizar a doação.'
                    : 'Não foi possível registrar a doação.'
            );
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
                <Text style={styles.buttonSubmitText}>
                    {isEditing ? 'Salvar Alterações' : 'Registrar Doação'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

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