import * as api from './api';
import { Doacao, Ponto, TipoItem } from '../types/types';

const DOACOES_ENDPOINT = '/api/v1/doacoes';

export type DoacaoFormData = {
    tipoItem: TipoItem;
    quantidade: number;
    pontoDestino: string;
};

export type ListarDoacoesParams = {
    pagina?: number;
    limite?: number;
    tipoItem?: string;
};

export type ListarDoacoesResponse = {
    dados: Doacao[];
    total: number;
    pagina: number;
    limite: number;
    temProximaPagina: boolean;
};

function normalizarDoacao(item: any): Doacao {
    const pontoSelecionado: Ponto =
        typeof item.pontoSelecionado === 'object' && item.pontoSelecionado !== null
            ? item.pontoSelecionado
            : {
                id: item.pontoId ?? 0,
                nome: item.pontoDestino ?? item.pontoSelecionado ?? 'Não informado',
                endereco: '',
                diasHorarios: '',
                funcionamento: '',
            };

    return {
        id: Number(item.id),
        tipoItem: item.tipoItem,
        qtdItem: Number(item.qtdItem ?? item.quantidade ?? 0),
        pontoSelecionado,
        criadoEm: item.criadoEm ?? item.createdAt ?? new Date().toISOString(),
    };
}

function normalizarListaResponse(
    resposta: any,
    pagina: number,
    limite: number
): ListarDoacoesResponse {
    const listaBruta = Array.isArray(resposta)
        ? resposta
        : Array.isArray(resposta?.dados)
            ? resposta.dados
            : Array.isArray(resposta?.data)
                ? resposta.data
                : Array.isArray(resposta?.items)
                    ? resposta.items
                    : [];

    const dados = listaBruta.map(normalizarDoacao);

    const total = Number(
        resposta?.total ??
        resposta?.totalRegistros ??
        resposta?.count ??
        dados.length
    );

    const paginaResposta = Number(resposta?.pagina ?? resposta?.page ?? pagina);
    const limiteResposta = Number(resposta?.limite ?? resposta?.limit ?? limite);

    const temProximaPagina =
        typeof resposta?.temProximaPagina === 'boolean'
            ? resposta.temProximaPagina
            : typeof resposta?.hasNextPage === 'boolean'
                ? resposta.hasNextPage
                : dados.length === limiteResposta && paginaResposta * limiteResposta < total;

    return {
        dados,
        total,
        pagina: paginaResposta,
        limite: limiteResposta,
        temProximaPagina,
    };
}

export async function listarPagina({
                                       pagina = 1,
                                       limite = 10,
                                       tipoItem,
                                   }: ListarDoacoesParams = {}): Promise<ListarDoacoesResponse> {
    const params = new URLSearchParams();

    params.append('pagina', String(pagina));
    params.append('limite', String(limite));

    if (tipoItem && tipoItem.trim().length > 0) {
        params.append('tipoItem', tipoItem.trim());
    }

    const resposta = await api.get<any>(`${DOACOES_ENDPOINT}?${params.toString()}`);
    return normalizarListaResponse(resposta, pagina, limite);
}

export async function carregarHistorico(): Promise<Doacao[]> {
    const resposta = await listarPagina({
        pagina: 1,
        limite: 100,
    });

    return resposta.dados;
}

export async function getTotalHistorico(
    historico?: Doacao[]
): Promise<{ totalRegistros: number; totalItens: number }> {
    const lista = historico ?? (await carregarHistorico());

    return {
        totalRegistros: lista.length,
        totalItens: lista.reduce(
            (acumulador, item) => acumulador + (Number(item.qtdItem) || 0),
            0
        ),
    };
}

export async function obterDoacaoPorId(id: number | string): Promise<Doacao> {
    const resposta = await api.get<any>(`${DOACOES_ENDPOINT}/${id}`);
    return normalizarDoacao(resposta);
}

export async function buscarPorId(id: number | string): Promise<Doacao> {
    return obterDoacaoPorId(id);
}

export async function criarDoacao(data: DoacaoFormData): Promise<Doacao> {
    const payload = {
        tipoItem: data.tipoItem,
        quantidade: data.quantidade,
        pontoDestino: data.pontoDestino.trim(),
    };

    const resposta = await api.post<any>(DOACOES_ENDPOINT, payload);
    return normalizarDoacao(resposta);
}

export async function cadastrar(data: DoacaoFormData): Promise<Doacao> {
    return criarDoacao(data);
}

export async function editarDoacao(
    id: number | string,
    data: DoacaoFormData
): Promise<Doacao> {
    const payload = {
        tipoItem: data.tipoItem,
        quantidade: data.quantidade,
        pontoDestino: data.pontoDestino.trim(),
    };

    const resposta = await api.put<any>(`${DOACOES_ENDPOINT}/${id}`, payload);
    return normalizarDoacao(resposta);
}

export async function editar(
    id: number | string,
    data: DoacaoFormData
): Promise<Doacao> {
    return editarDoacao(id, data);
}

export async function excluirDoacao(id: number | string): Promise<void> {
    await api.del<void>(`${DOACOES_ENDPOINT}/${id}`);
}

export async function excluir(id: number | string): Promise<void> {
    return excluirDoacao(id);
}