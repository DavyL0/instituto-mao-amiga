import * as api from './api';
import { Doacao, TipoItem } from '../types/types';

export type DoacaoFormData = {
    tipoItem: TipoItem;
    quantidade: number;
    pontoDestino: string;
};

type DoacaoApi = Doacao & { quantidade?: number; pontoDestino?: string };

function converterDoacao(item: DoacaoApi): Doacao {
    return {
        ...item,
        qtdItem: item.quantidade ?? item.qtdItem,
        pontoSelecionado: item.pontoSelecionado ?? {
            id: 0,
            nome: item.pontoDestino ?? '',
            endereco: '',
        },
    };
}

export async function buscarPaginaDoacoes(pagina = 1, limite = 10, busca?: string): Promise<Doacao[]> {
    const params = new URLSearchParams();
    params.append('_page', String(pagina));
    params.append('_limit', String(limite));
    params.append('_sort', 'criadoEm');
    params.append('_order', 'desc');
    if (busca?.trim()) params.append('tipoItem', busca.trim());
    const resposta = await api.get<DoacaoApi[] | { data: DoacaoApi[] }>(`/api/v1/doacoes?${params.toString()}`);
    const itens = Array.isArray(resposta) ? resposta : resposta.data;
    if (!Array.isArray(itens)) throw new Error('Resposta inválida ao carregar doações.');
    return itens.map(converterDoacao);
}

export async function carregarHistorico(): Promise<Doacao[]> {
    const lista: Doacao[] = [];
    const limite = 100;
    for (let pagina = 1; ; pagina++) {
        const itens = await buscarPaginaDoacoes(pagina, limite);
        lista.push(...itens);
        if (itens.length < limite) return lista;
    }
}

export async function getTotalHistorico(historico?: Doacao[]): Promise<{ totalRegistros: number; totalItens: number }> {
    const lista = historico ?? await carregarHistorico();
    return { totalRegistros: lista.length, totalItens: lista.reduce((total, item) => total + (Number(item.qtdItem) || 0), 0) };
}

export async function obterDoacaoPorId(id: number): Promise<Doacao> {
    return converterDoacao(await api.get<DoacaoApi>(`/api/v1/doacoes/${id}`));
}

export async function criarDoacao(data: DoacaoFormData): Promise<Doacao> {
    return converterDoacao(await api.post<DoacaoApi>('/api/v1/doacoes', { ...data, pontoDestino: data.pontoDestino.trim() }));
}

export async function editarDoacao(id: number, data: DoacaoFormData): Promise<Doacao> {
    return converterDoacao(await api.put<DoacaoApi>(`/api/v1/doacoes/${id}`, { ...data, pontoDestino: data.pontoDestino.trim() }));
}

export async function excluirDoacao(id: number): Promise<void> {
    await api.del<void>(`/api/v1/doacoes/${id}`);
}
