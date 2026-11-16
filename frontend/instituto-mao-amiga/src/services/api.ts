// src/services/api.ts

// Configuração centralizada da URL da API
// Para testar no celular via rede local, altere para o IP do seu computador (ex: 'http://192.168.1.100:3000')
// Para testar no emulador Android, pode ser 'http://10.0.2.2:3000'
// Para testar no navegador (Web), pode ser 'http://localhost:3000'
export const API_BASE_URL = 'http://192.168.1.100:3000';

export class ApiError extends Error {
    status: number;
    data?: any;

    constructor(status: number, message: string, data?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${cleanEndpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    let response: Response;
    try {
        response = await fetch(url, {
            ...options,
            headers,
        });
    } catch (networkError: any) {
        throw new ApiError(
            0,
            networkError?.message || 'Não foi possível conectar ao servidor. Verifique sua conexão e se a API está em execução.'
        );
    }

    let responseData: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        try {
            responseData = await response.json();
        } catch {
            responseData = null;
        }
    } else {
        try {
            responseData = await response.text();
        } catch {
            responseData = null;
        }
    }

    if (!response.ok) {
        const errorMessage =
            (typeof responseData === 'object' && responseData !== null && (responseData.message || responseData.error))
                ? (responseData.message || responseData.error)
                : typeof responseData === 'string' && responseData.length > 0
                ? responseData
                : `Erro na requisição (Status: ${response.status})`;

        throw new ApiError(response.status, errorMessage, responseData);
    }

    return responseData as T;
}

export async function get<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, {
        method: 'GET',
    });
}

export async function post<T>(endpoint: string, data?: any): Promise<T> {
    return request<T>(endpoint, {
        method: 'POST',
        body: data !== undefined ? JSON.stringify(data) : undefined,
    });
}

export async function put<T>(endpoint: string, data?: any): Promise<T> {
    return request<T>(endpoint, {
        method: 'PUT',
        body: data !== undefined ? JSON.stringify(data) : undefined,
    });
}

export async function del<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, {
        method: 'DELETE',
    });
}
