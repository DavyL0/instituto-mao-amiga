import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { theme } from '../theme/theme';
import { Ponto, PontoFormData, TipoPonto } from '../types/types';
import * as pontosService from '../services/pontosService';
import { ApiError } from '../services/api';

const fieldsValidationSchema = yup.object().shape({
    nome: yup
        .string()
        .trim()
        .required('O nome é obrigatório'),
    endereco: yup
        .string()
        .trim()
        .required('O endereço é obrigatório'),
    bairro: yup
        .string()
        .trim()
        .required('O bairro é obrigatório'),
    horario: yup
        .string()
        .trim()
        .required('O horário é obrigatório'),
    tipo: yup
        .string()
        .oneOf(['coleta', 'distribuição'], 'Selecione o tipo do ponto')
        .required('O tipo do ponto é obrigatório'),
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

type FormularioPontoProps = {
    pontoParaEditar?: Ponto | null;
    onSuccess?: (pontoSalvo?: Ponto) => void;
};

export const FormularioPonto = ({ pontoParaEditar, onSuccess }: FormularioPontoProps) => {
    const isEditing = Boolean(pontoParaEditar);
    const [submitting, setSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PontoFormData>({
        resolver: yupResolver(fieldsValidationSchema),
        defaultValues: {
            nome: '',
            endereco: '',
            bairro: '',
            horario: '',
            tipo: '',
        },
    });

    useEffect(() => {
        if (pontoParaEditar) {
            let tipoNormalizado: TipoPonto | string = 'coleta';
            if (pontoParaEditar.tipo) {
                const tipoLower = pontoParaEditar.tipo.toLowerCase();
                tipoNormalizado = tipoLower.includes('distribui') ? 'distribuição' : 'coleta';
            } else if (pontoParaEditar.funcionamento) {
                const funcLower = pontoParaEditar.funcionamento.toLowerCase();
                tipoNormalizado = funcLower.includes('distribui') ? 'distribuição' : 'coleta';
            }

            reset({
                nome: pontoParaEditar.nome || '',
                endereco: pontoParaEditar.endereco || '',
                bairro: pontoParaEditar.bairro || '',
                horario: pontoParaEditar.horario || pontoParaEditar.diasHorarios || '',
                tipo: tipoNormalizado,
            });
        } else {
            reset({
                nome: '',
                endereco: '',
                bairro: '',
                horario: '',
                tipo: '',
            });
        }
    }, [pontoParaEditar, reset]);

    const onSubmit = async (data: PontoFormData) => {
        try {
            setSubmitting(true);
            const payload: Partial<Ponto> = {
                nome: data.nome.trim(),
                endereco: data.endereco.trim(),
                bairro: data.bairro.trim(),
                horario: data.horario.trim(),
                tipo: data.tipo,
                diasHorarios: data.horario.trim(),
                funcionamento: data.tipo === 'distribuição' ? 'Distribuição' : 'Coleta',
            };

            if (pontoParaEditar) {
                const pontoAtualizado = await pontosService.editar(pontoParaEditar.id, payload);
                Alert.alert('Sucesso', 'Ponto atualizado com sucesso!', [
                    {
                        text: 'OK',
                        onPress: () => onSuccess?.(pontoAtualizado),
                    },
                ]);
            } else {
                const novoPonto = await pontosService.cadastrar(payload);
                reset();
                Alert.alert('Sucesso', 'Ponto cadastrado com sucesso!', [
                    {
                        text: 'OK',
                        onPress: () => onSuccess?.(novoPonto),
                    },
                ]);
            }
        } catch (error: any) {
            console.error('Erro ao salvar ponto:', error);
            let msg = 'Não foi possível salvar o ponto. Verifique sua conexão e se a API está online.';
            if (error instanceof ApiError) {
                if (error.status === 400) {
                    msg = error.message || 'Dados inválidos. Por favor, revise as informações.';
                } else if (error.status === 0) {
                    msg = 'Não foi possível conectar ao servidor. Verifique se a API está ligada.';
                } else {
                    msg = error.message || msg;
                }
            } else if (error?.message) {
                msg = error.message;
            }
            Alert.alert('Erro', msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <Controller
                control={control}
                name="nome"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        label="Nome do Ponto"
                        placeholder="Ex: Paróquia São José"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.nome?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="endereco"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        label="Endereço"
                        placeholder="Ex: Rua das Flores, 123"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.endereco?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="bairro"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        label="Bairro"
                        placeholder="Ex: Centro"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.bairro?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="horario"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        label="Horário"
                        placeholder="Ex: Seg a Sex, das 08h às 17h"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.horario?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="tipo"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.container}>
                        <Text style={styles.label}>Tipo</Text>
                        <View style={styles.tipoContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.tipoButton,
                                    value === 'coleta' && styles.tipoButtonSelected,
                                    errors.tipo ? styles.tipoButtonError : null,
                                ]}
                                onPress={() => onChange('coleta')}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.tipoButtonText,
                                        value === 'coleta' && styles.tipoButtonTextSelected,
                                    ]}
                                >
                                    Coleta
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.tipoButton,
                                    value === 'distribuição' && styles.tipoButtonSelected,
                                    errors.tipo ? styles.tipoButtonError : null,
                                ]}
                                onPress={() => onChange('distribuição')}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.tipoButtonText,
                                        value === 'distribuição' && styles.tipoButtonTextSelected,
                                    ]}
                                >
                                    Distribuição
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {errors.tipo ? (
                            <Text style={styles.errorText}>{errors.tipo.message}</Text>
                        ) : null}
                    </View>
                )}
            />

            <TouchableOpacity
                style={[styles.buttonSubmit, submitting && styles.buttonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={submitting}
                activeOpacity={0.8}
            >
                {submitting ? (
                    <ActivityIndicator size="small" color={theme.colors.textWhite} />
                ) : (
                    <Text style={styles.buttonSubmitText}>
                        {isEditing ? 'Salvar alterações' : 'Cadastrar Ponto'}
                    </Text>
                )}
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
    tipoContainer: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    tipoButton: {
        flex: 1,
        height: 46,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipoButtonSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    tipoButtonError: {
        borderColor: theme.colors.danger,
    },
    tipoButtonText: {
        fontSize: theme.fontSize.md,
        fontWeight: '500',
        color: theme.colors.textSecondary,
    },
    tipoButtonTextSelected: {
        color: theme.colors.textWhite,
        fontWeight: 'bold',
    },
    buttonSubmit: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.lg,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonSubmitText: {
        color: theme.colors.textWhite,
        fontWeight: 'bold',
        fontSize: theme.fontSize.xl,
    },
});
