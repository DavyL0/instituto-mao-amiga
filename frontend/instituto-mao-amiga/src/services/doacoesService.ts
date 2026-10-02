import AsyncStorage from '@react-native-async-storage/async-storage';
import { Doacao } from '../types/types';

export const STORAGE_KEY_LIST = '@institutomaoamiga:doacoes';

export async function carregarHistorico(): Promise<Doacao[]> {
    try {
        const doacoesSalvas = await AsyncStorage.getItem(STORAGE_KEY_LIST);
        if (doacoesSalvas) {
            const parsed = JSON.parse(doacoesSalvas);
            return Array.isArray(parsed) ? parsed : [];
        }
        return [];
    } catch (error) {
        console.error('Erro ao carregar histórico de doações:', error);
        return [];
    }
}

export async function getTotalHistorico(historico?: Doacao[]): Promise<{ totalRegistros: number; totalItens: number }> {
    const lista = historico ?? (await carregarHistorico());
    const totalRegistros = lista.length;
    const totalItens = lista.reduce((acumulador, item) => acumulador + (Number(item.qtdItem) || 0), 0);

    return {
        totalRegistros,
        totalItens,
    };
}

export async function obterDoacaoPorId(id: number): Promise<Doacao | undefined> {
    const lista = await carregarHistorico();
    return lista.find((item) => item.id === id);
}

export async function excluirDoacao(id: number): Promise<void> {
    try {
        const historico = await carregarHistorico();
        const novaLista = historico.filter((item) => item.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(novaLista));
    } catch (error) {
        console.error('Erro ao excluir doação:', error);
    }
}
