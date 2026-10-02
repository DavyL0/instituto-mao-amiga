import AsyncStorage from '@react-native-async-storage/async-storage';
import { Doacao } from '../types/types';

export const STORAGE_KEY_LIST = '@institutomaoamiga:doacoes';

/**
 * Carrega a lista completa do histórico de doações salvas no AsyncStorage.
 */
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

/**
 * Retorna o total de itens doados no histórico ou a quantidade total de registros.
 * @param historico Opcional. Se não for passado, carrega do AsyncStorage.
 */
export async function getTotalHistorico(historico?: Doacao[]): Promise<{ totalRegistros: number; totalItens: number }> {
    const lista = historico ?? (await carregarHistorico());
    const totalRegistros = lista.length;
    const totalItens = lista.reduce((acumulador, item) => acumulador + (Number(item.qtdItem) || 0), 0);

    return {
        totalRegistros,
        totalItens,
    };
}

/**
 * Obtém uma doação específica do histórico pelo ID.
 */
export async function obterDoacaoPorId(id: number): Promise<Doacao | undefined> {
    const lista = await carregarHistorico();
    return lista.find((item) => item.id === id);
}
