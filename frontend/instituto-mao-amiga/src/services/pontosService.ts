// src/services/pontosService.ts
import * as api from './api';
import { Ponto } from '../types/types';

export async function listar(): Promise<Ponto[]> {
    return api.get<Ponto[]>('/api/v1/pontos');
}

export async function buscarPagina(
    pagina: number = 1,
    limite: number = 10,
    busca?: string
): Promise<Ponto[]> {
    const params = new URLSearchParams();
    params.append('page', String(pagina - 1));
    params.append('size', String(limite));

    if (busca && busca.trim().length > 0) {
        params.append('filtro', busca.trim());
    }

    const endpoint = `/api/v1/pontos/filtro?${params.toString()}`;
    const resposta = await api.get<any>(endpoint);

    if (Array.isArray(resposta)) {
        return resposta;
    }
    if (resposta && Array.isArray(resposta.content)) {
        return resposta.content;
    }
    throw new Error('Resposta inválida ao carregar pontos.');
}

export async function buscarPorId(id: number | string): Promise<Ponto> {
    return api.get<Ponto>(`/api/v1/pontos/${id}`);
}

export async function cadastrar(ponto: Omit<Ponto, 'id'> | Partial<Ponto>): Promise<Ponto> {
    return api.post<Ponto>('/api/v1/pontos', ponto);
}

export async function editar(id: number | string, ponto: Partial<Ponto>): Promise<Ponto> {
    return api.put<Ponto>(`/api/v1/pontos/${id}`, ponto);
}

export async function excluir(id: number | string): Promise<void> {
    return api.del<void>(`/api/v1/pontos/${id}`);
}
