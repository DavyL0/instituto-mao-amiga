# Instituto Mão Amiga - Aplicativo Mobile

Aplicativo móvel desenvolvido com React Native e Expo para o Instituto Mão Amiga.

## Configuração da API

A camada de rede está centralizada e isolada:
- `src/services/api.ts`: Centraliza a URL base da API e métodos HTTP (`get`, `post`, `put`, `del`), com tratamento padronizado de exceções (`ApiError`).
- `src/services/pontosService.ts`: Serviço de pontos de coleta com operações de listar, buscar página com paginação e filtro, buscar por ID, cadastrar, editar e excluir.

### Alterando a URL do Servidor:
Para alterar a URL da API, edite a constante `API_BASE_URL` no arquivo `src/services/api.ts`:
- **Execução no celular via rede local**: configure com o IP da sua máquina local, por exemplo: `http://192.168.1.100:3000` (substitua pelo IP do computador na rede local).
- **Execução no emulador Android**: `http://10.0.2.2:3000`.
- **Execução / Testes no Navegador Web**: `http://localhost:3000`.

## Como Executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie a API backend (ex: json-server ou servidor backend na porta 3000):
   ```bash
   npx json-server --watch db.json --port 3000
   ```

3. Inicie o Expo:
   ```bash
   npm start
   # ou para testar diretamente no navegador web:
   npm run web
   ```

## Testes Realizados

Os testes e validações foram executados no navegador web (`npm run web`) e em ambiente local com a API simulando respostas de paginação, busca por texto, detalhe por ID (incluindo tratamento de 404 - "ponto não encontrado"), estado de carregamento inicial (loading spinner) e tratamento amigável de erros de conexão quando a API está desligada.
