import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@mao-amiga:pontos-favoritos';
type IdPonto = number | string;

let operacao: Promise<unknown> = Promise.resolve();

async function lerFavoritos(): Promise<IdPonto[]> {
    const valor = await AsyncStorage.getItem(CHAVE);
    if (valor === null) return [];
    const ids: unknown = JSON.parse(valor);
    if (!Array.isArray(ids) || !ids.every(id => typeof id === 'number' || typeof id === 'string')) {
        throw new Error('Favoritos armazenados são inválidos.');
    }
    return ids;
}

export async function listarFavoritos(): Promise<IdPonto[]> {
    await operacao;
    return lerFavoritos();
}

export function alternarFavorito(id: IdPonto): Promise<IdPonto[]> {
    const atualizacao = operacao.then(async () => {
        const ids = await lerFavoritos();
        const existe = ids.some(item => String(item) === String(id));
        const novos = existe ? ids.filter(item => String(item) !== String(id)) : [...ids, id];
        await AsyncStorage.setItem(CHAVE, JSON.stringify(novos));
        return novos;
    });
    operacao = atualizacao.catch(() => undefined);
    return atualizacao;
}