# Instituto Mão Amiga - Aplicativo Mobile

Aplicativo React Native/Expo para pontos de coleta e doações, acompanhado de uma API Spring Boot. Os caminhos abaixo partem desta pasta (`frontend/instituto-mao-amiga`).

## Como executar

### API

Instale o JDK 21 e confira `java -version`. O `backend/pom.xml` define `java.version` como 21; o README do backend pede Java 21+. Em outro terminal, a partir desta pasta:

```powershell
cd ..\..\backend
.\mvnw.cmd spring-boot:run
```

Em Linux/macOS, na pasta `backend`, use `./mvnw spring-boot:run`. O Maven Wrapper baixa o Maven necessário. A API usa H2 em arquivo (`backend/data/pontosdb`) e, por padrão, porta 8080. Abra `http://localhost:8080/swagger-ui/index.html` para consultar e executar os endpoints. Veja `backend/README.md` para detalhes.

### Aplicativo

Instale Node.js e npm compatíveis com as dependências em `package.json`. Nesta pasta, em outro terminal:

```powershell
npm install
npm start
```

Abra o projeto no Expo Go pelo QR code ou use as opções do Expo para emulador; para navegador, use `npm run web`. A execução do Expo não corrige as incompatibilidades de contrato descritas abaixo.

### Endereço da API

Em `src/services/api.ts`, troque `API_BASE_URL`, atualmente `http://192.168.1.100:3000`, pelo endereço acessível ao dispositivo e pela porta real da API, normalmente 8080:

- Celular físico: `http://IP_DO_COMPUTADOR:8080`; celular e computador devem estar na mesma rede, com a porta acessível no firewall.
- Emulador Android padrão: `http://10.0.2.2:8080`.
- Navegador no computador: `http://localhost:8080`.

Reinicie/recarregue o aplicativo após a alteração. O IP de exemplo não identifica automaticamente sua máquina.

## Roteiro de demonstração — até 3 minutos

Prepare antes da gravação: inicie API e app, abra o Swagger e deixe os corpos JSON abaixo à mão. Devido às incompatibilidades descritas adiante, use o Swagger para demonstrar as operações no servidor; não apresente o CRUD completo no app como funcional.

1. **0:00–0:35 — Buscar e cadastrar ponto:** no Swagger, execute `GET /api/v1/pontos/filtro` com `filtro` igual a um nome ou bairro. Em `POST /api/v1/pontos`, envie o JSON abaixo e copie o `id` UUID retornado.
   ```json
   {"nome":"Ponto Demo","endereco":"Rua Demo, 1","bairro":"Centro","horario":"8h às 17h","tipo":"coleta"}
   ```
2. **0:35–0:55 — Editar ponto e favoritos:** em `PUT /api/v1/pontos/{id}`, use o UUID copiado e o mesmo JSON com nome `Ponto Demo Editado`. No app, toque no coração do ponto, abra **Meus pontos** e mostre o favorito; toque novamente no coração para removê-lo.
3. **0:55–1:40 — Cadastrar, editar e excluir doação:** em `POST /api/v1/doacoes`, use o JSON abaixo, substituindo pelo UUID do ponto criado; copie o UUID da doação retornada. Em `PUT /api/v1/doacoes/{id}`, use esse UUID e altere `quantidade` para 2; em seguida execute `DELETE /api/v1/doacoes/{id}` com o mesmo UUID.
   ```json
   {"tipoItem":"Roupas","quantidade":1,"pontoDestinoId":"UUID_DO_PONTO"}
   ```
4. **1:40–2:10 — Excluir ponto:** após excluir a doação, execute `DELETE /api/v1/pontos/{id}` com o UUID do ponto de demonstração. Evite excluir dados preexistentes.
5. **2:10–2:45 — Erros:** repita `GET /api/v1/pontos/{id}` com o UUID recém-excluído e mostre o **404**. Em `POST /api/v1/pontos`, envie o JSON do primeiro passo com `nome` vazio e mostre o **400** e `errors` na resposta. As validações do formulário podem impedir o envio de dados inválidos antes de chegar à API; por isso use o Swagger para demonstrar o HTTP 400.
6. **2:45–3:00 — Decisão de dados:** explique favoritos locais versus pontos e doações no servidor, conforme abaixo. Os tempos são uma meta, não uma medição de execução.

## Favoritos e dados do servidor

`src/services/favoritosService.ts` guarda apenas IDs no `AsyncStorage` local (`@mao-amiga:pontos-favoritos`). É uma preferência por instalação/dispositivo: não sincroniza entre aparelhos nem contas e pode ser perdida ao limpar os dados locais. A tela **Meus pontos** consulta cada ID na API e omite pontos excluídos.

Pontos e doações são dados compartilhados persistidos pela API no H2, sobrevivendo ao reinício do servidor. Guardar apenas IDs locais evita copiar dados de pontos; referências a pontos excluídos são ignoradas na tela.

## Evidências e limitações da integração

- `backend/pom.xml`, `backend/README.md` e `backend/src/main/resources/application.properties` fundamentam Java 21, comando do wrapper, H2 e configuração; os controllers não definem outra porta, portanto usa-se a porta padrão 8080 do Spring Boot.
- `src/services/pontosService.ts` usa `/api/v1/pontos` e `/api/v1/pontos/filtro` com `page`, `size` e `filtro`, retornando página em `content`.
- `src/services/doacoesService.ts` envia `pontoDestino` como nome e parâmetros de paginação no estilo JSON Server; `DoacaoRequestDTO` exige `pontoDestinoId` UUID, e `DoacaoController` oferece paginação/filtro em `/api/v1/doacoes/filtro`. As listas simples da API não aplicam esses parâmetros. Os tipos do app também declaram IDs numéricos, enquanto a API usa UUID. Cadastro/edição de doações e paginação/busca, portanto, não devem ser considerados integrados sem ajustes.
- `PontoController`, `PontoRequestDTO` e `GlobalExceptionHandler` fundamentam os exemplos de 400 e 404. Os formulários validam dados localmente; o resultado HTTP deve ser observado diretamente na API.
- Este documento foi preparado por inspeção dos arquivos; os comandos, o roteiro e a comunicação entre app e API não foram executados nesta atualização. Não há evidência aqui para afirmar que a demonstração completa funciona ponta a ponta.
