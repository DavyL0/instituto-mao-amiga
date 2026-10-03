import AsyncStorage from '@react-native-async-storage/async-storage';
import { Doacao } from '../types/types';

export const STORAGE_KEY_LIST = '@institutomaoamiga:doacoes';

export type DoacaoFormData = {
    tipoItem: string;
    quantidade: number;
    pontoDestino: string;
};

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

export async function criarDoacao(data: DoacaoFormData): Promise<Doacao> {
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

        const historico = await carregarHistorico();
        const novaLista = [novaDoacao, ...historico];
        await AsyncStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(novaLista));

        return novaDoacao;
    } catch (error) {
        console.error('Erro ao criar doação:', error);
        throw error;
    }
}

export async function editarDoacao(id: number, data: DoacaoFormData): Promise<Doacao> {
    try {
        const historico = await carregarHistorico();
        let doacaoAtualizada: Doacao | undefined;

        const novaLista = historico.map((item) => {
            if (item.id === id) {
                doacaoAtualizada = {
                    ...item,
                    tipoItem: data.tipoItem.trim(),
                    qtdItem: data.quantidade,
                    pontoSelecionado: {
                        ...(typeof item.pontoSelecionado === 'object' && item.pontoSelecionado !== null
                            ? item.pontoSelecionado
                            : { id: 0, endereco: '', diasHorarios: '', funcionamento: '' }),
                        nome: data.pontoDestino.trim(),
                    },
                };
                return doacaoAtualizada;
            }
            return item;
        });

        if (!doacaoAtualizada) {
            throw new Error(`Doação com ID ${id} não encontrada para edição.`);
        }

        await AsyncStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(novaLista));
        return doacaoAtualizada;
    } catch (error) {
        console.error('Erro ao editar doação:', error);
        throw error;
    }
}

export async function excluirDoacao(id: number): Promise<void> {
    try {
        const historico = await carregarHistorico();
        const novaLista = historico.filter((item) => item.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(novaLista));
    } catch (error) {
        console.error('Erro ao excluir doação:', error);
        throw error;
    }
}
