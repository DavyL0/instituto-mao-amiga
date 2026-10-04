import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { theme } from '../theme/theme';
import { Doacao, TipoItem } from '../types/types';
import { criarDoacao, editarDoacao, DoacaoFormData } from '../services/doacoesService';

const fieldsValidationSchema = yup.object().shape({
    tipoItem: yup
        .mixed<TipoItem>()
        .oneOf(Object.values(TipoItem), 'Selecione um tipo de item válido')
        .required('O tipo de item é obrigatório'),
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

type SelectDropdownProps = {
    label: string;
    options: TipoItem[];
    value?: TipoItem;
    onSelect: (value: TipoItem) => void;
    placeholder?: string;
    error?: string;
};

const SelectDropdown = ({
    label,
    options,
    value,
    onSelect,
    placeholder = 'Selecione uma opção',
    error,
}: SelectDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[
                    styles.selectTrigger,
                    error ? styles.inputError : null,
                    isOpen && styles.selectTriggerOpen,
                ]}
                onPress={() => setIsOpen((prev) => !prev)}
            >
                <Text
                    numberOfLines={1}
                    style={[
                        styles.selectTriggerText,
                        !value && styles.placeholderText,
                    ]}
                >
                    {value || placeholder}
                </Text>
                <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {isOpen && (
                <View style={styles.dropdownContainer}>
                    {options.map((option, index) => {
                        const isSelected = value === option;
                        const isLast = index === options.length - 1;
                        return (
                            <TouchableOpacity
                                key={option}
                                activeOpacity={0.7}
                                style={[
                                    styles.dropdownItem,
                                    isLast && styles.dropdownItemLast,
                                    isSelected && styles.dropdownItemSelected,
                                ]}
                                onPress={() => {
                                    onSelect(option);
                                    setIsOpen(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.dropdownItemText,
                                        isSelected && styles.dropdownItemTextSelected,
                                    ]}
                                >
                                    {option}
                                </Text>
                                {isSelected && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

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
            tipoItem: undefined,
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
                tipoItem: undefined,
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
                render={({ field: { onChange, value } }) => (
                    <SelectDropdown
                        label="Tipo do Item"
                        placeholder="Selecione o tipo do item"
                        options={Object.values(TipoItem)}
                        value={value}
                        onSelect={onChange}
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
    selectTriggerOpen: {
        borderColor: theme.colors.primary,
    },
    selectTriggerText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        flex: 1,
        marginRight: theme.spacing.md,
    },
    placeholderText: {
        color: theme.colors.placeholder,
    },
    chevron: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textSecondary,
    },
    dropdownContainer: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.cardBorder,
        borderWidth: 1,
        borderRadius: theme.borderRadius.lg,
        marginTop: theme.spacing.xs,
        overflow: 'hidden',
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
    dropdownItemLast: {
        borderBottomWidth: 0,
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
    checkmark: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: theme.fontSize.md,
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