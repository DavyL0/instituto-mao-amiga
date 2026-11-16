// src/services/pontosService.ts
import * as api from './api';
import { Ponto } from '../types/types';

export async function listar(): Promise<Ponto[]> {
    return api.get<Ponto[]>('/pontos');
}

export async function buscarPagina(
    pagina: number = 1,
    limite: number = 10,
    busca?: string
): Promise<Ponto[]> {
    const params = new URLSearchParams();
    params.append('_page', String(pagina));
    params.append('_limit', String(limite));

    if (busca && busca.trim().length > 0) {
        params.append('q', busca.trim());
    }

    const endpoint = `/pontos?${params.toString()}`;
    const resposta = await api.get<any>(endpoint);

    if (Array.isArray(resposta)) {
        return resposta;
    }
    if (resposta && Array.isArray(resposta.data)) {
        return resposta.data;
    }
    return [];
}

export async function buscarPorId(id: number | string): Promise<Ponto> {
    return api.get<Ponto>(`/pontos/${id}`);
}

export async function cadastrar(ponto: Omit<Ponto, 'id'> | Partial<Ponto>): Promise<Ponto> {
    return api.post<Ponto>('/pontos', ponto);
}

export async function editar(id: number | string, ponto: Partial<Ponto>): Promise<Ponto> {
    return api.put<Ponto>(`/pontos/${id}`, ponto);
}

export async function excluir(id: number | string): Promise<void> {
    return api.del<void>(`/pontos/${id}`);
}
