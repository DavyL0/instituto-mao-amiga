import React, { useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// 1. Schema de Validação (Yup)
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

// 2. Componente Reutilizável de Input com exibição de Erro
const TextField = ({ label, error, ...inputProps }: any) => (
    <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput style={styles.input} {...inputProps} />
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

// 3. Tela Principal
export const DoacaoScreen = () => {
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(fieldsValidationSchema),
    });

    useEffect(() => {
        register('tipoItem');
        register('quantidade');
        register('pontoDestino');
    }, [register]);

    const onSubmit = (data: any) => {
        Alert.alert(
            'Doação Registrada',
            `Item: ${data.tipoItem}\nQtd: ${data.quantidade}\nDestino: ${data.pontoDestino}`
        );
    };

    return (
        <View style={styles.mainContainer}>
            <TextField
                label="Tipo do Item"
                placeholder="Coloque o Tipo do Item"
                onChangeText={(value: string) => setValue('tipoItem', value)}
                error={errors.tipoItem?.message}
            />
            <TextField
                label="Quantidade"
                placeholder="Quantidade de Itens"
                keyboardType="numeric"
                onChangeText={(value: number) => setValue('quantidade', value)}
                error={errors.quantidade?.message}
            />
            <TextField
                label="Ponto de Destino"
                placeholder="Digite o Endereço do Ponto de Destino"
                onChangeText={(value: string) => setValue('pontoDestino', value)}
                error={errors.pontoDestino?.message}
            />
            <Button onPress={handleSubmit(onSubmit)} title="Registrar Doação" />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        padding: 16,
    },
    container: {
        marginBottom: 12,
    },
    label: {
        marginBottom: 4,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});