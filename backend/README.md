# Instituto Mão Amiga - API de Pontos de Coleta e Distribuição

Projeto Spring Boot com operações CRUD completas para gerenciamento de pontos de coleta e distribuição de doações em Goiânia, utilizando banco de dados H2 gravado em arquivo e documentado com Swagger / OpenAPI.

---

## 📋 Critérios de Aceite Atendidos

- [x] **Dependências**: Spring Web, Spring Data JPA, H2 Database, Lombok, Swagger (springdoc-openapi) e Spring Boot Starter Validation.
- [x] **Estrutura de Pacotes**: `entity`, `repository`, `service`, `controller`, `dto` e `config`.
- [x] **Entidade Ponto**: `id` (UUID), `nome`, `endereco`, `bairro`, `horario` (texto, ex: "Seg a Sex, 8h às 17h") e `tipo` ("coleta" ou "distribuição").
- [x] **Banco H2 em Arquivo**: persistência configurada via `jdbc:h2:file:./data/pontosdb`.
- [x] **Carga Inicial**: pelo menos 25 pontos em Goiânia carregados automaticamente sem duplicação a cada reinício.
- [x] **Busca Paginada com Filtro**: `GET /api/v1/pontos/filtro` com `@Query` no repositório buscando por nome ou bairro (sem diferenciar maiúsculas/minúsculas), paginação padrão de 10 itens ordenados por nome (`@PageableDefault`) e suporte a ordenação dinâmica (`sort=bairro,asc`).
- [x] **Formato de Serialização Paginada**: formato `content + page` via `spring.data.web.pageable.serialization-mode=via_dto`.
- [x] **Bean Validation e @Valid**: DTO com validação de campos obrigatórios e não vazios (`@NotBlank`).
- [x] **PontoResponseDTO (record)**: Controller retorna apenas DTOs imutáveis, nunca a entidade diretamente.
- [x] **Endpoints**:
  - `GET /api/v1/pontos`
  - `GET /api/v1/pontos/filtro`
  - `GET /api/v1/pontos/{id}`
  - `POST /api/v1/pontos`
  - `PUT /api/v1/pontos/{id}`
  - `DELETE /api/v1/pontos/{id}`
- [x] **Tratamento de Erros**:
  - `404 Not Found` em buscas, edições ou exclusões de IDs inexistentes.
  - `400 Bad Request` com detalhamento em validações de campos vazios ou ausentes.
- [x] **CORS**: `@CrossOrigin(origins = "*")` liberado no controller.
- [x] **Documentação**: Swagger UI disponível em `http://localhost:8080/swagger-ui/index.html`.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Java 21+
- Maven (ou wrapper `./mvnw`)

### Executar a aplicação
```bash
./mvnw spring-boot:run
```

### Executar os testes
```bash
./mvnw test
```

### Acesso ao Swagger UI
- Interface gráfica: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- Especificação OpenAPI (JSON): [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### Acesso ao Console H2
- URL: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- JDBC URL: `jdbc:h2:file:./data/pontosdb`
- Usuário: `sa`
- Senha: *(vazio)*

---

## 📡 Endpoints e Exemplos de Resposta do Swagger

### 1. `GET /api/v1/pontos/filtro` - Busca paginada com filtro (3 Exemplos)

O endpoint aceita parâmetros opcionais de consulta:
- `filtro` (opcional): termo para busca insensível a maiúsculas/minúsculas no `nome` ou `bairro`.
- `page` (opcional, padrão `0`): número da página (base 0).
- `size` (opcional, padrão `10` via `@PageableDefault`): tamanho da página.
- `sort` (opcional, padrão `nome,asc` via `@PageableDefault`): campo e direção de ordenação (ex: `sort=bairro,asc`).

A resposta segue a convenção `content + page` (`spring.data.web.pageable.serialization-mode=via_dto`).

#### Exemplo 1.1: Sem filtro (Primeira página, 10 itens ordenados por nome)
**URL**: `http://localhost:8080/api/v1/pontos/filtro` (ou `http://localhost:8080/api/v1/pontos/filtro?page=0&size=10`)  
**Método**: `GET`  
**Código HTTP**: `200 OK`

```json
{
  "content": [
    {
      "id": "e3b0c442-98fc-1c14-9afb-4c8996fb9242",
      "nome": "Ponto Alameda Ricardo Paranhos",
      "endereco": "Alameda Ricardo Paranhos, Qd. 240",
      "bairro": "Setor Marista",
      "horario": "Seg a Sex, 7h às 19h",
      "tipo": "distribuição"
    },
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "nome": "Ponto Bosque dos Buritis",
      "endereco": "Av. Assis Chateaubriand, s/n",
      "bairro": "Setor Oeste",
      "horario": "Seg a Sex, 8h às 16h",
      "tipo": "distribuição"
    },
    {
      "id": "f5e4d3c2-b1a0-0987-dcba-fe0987654321",
      "nome": "Ponto Central - Praça Cívica",
      "endereco": "Praça Pedro Ludovico Teixeira, s/n",
      "bairro": "Setor Central",
      "horario": "Seg a Sex, 8h às 17h",
      "tipo": "coleta"
    },
    {
      "id": "11111111-2222-3333-4444-555555555555",
      "nome": "Ponto Goiânia Shopping",
      "endereco": "Av. T-10, 1300",
      "bairro": "Setor Bueno",
      "horario": "Seg a Sáb, 10h às 22h",
      "tipo": "distribuição"
    },
    {
      "id": "22222222-3333-4444-5555-666666666666",
      "nome": "Ponto Jardim Botânico",
      "endereco": "Av. Jardim Botânico, s/n",
      "bairro": "Setor Pedro Ludovico",
      "horario": "Ter a Dom, 8h às 17h",
      "tipo": "coleta"
    },
    {
      "id": "33333333-4444-5555-6666-777777777777",
      "nome": "Ponto Lago das Rosas",
      "endereco": "Alameda das Rosas, s/n",
      "bairro": "Setor Oeste",
      "horario": "Seg a Sáb, 8h às 17h",
      "tipo": "coleta"
    },
    {
      "id": "44444444-5555-6666-7777-888888888888",
      "nome": "Ponto Parque Areião",
      "endereco": "Av. Americano do Brasil, s/n",
      "bairro": "Setor Pedro Ludovico",
      "horario": "Seg a Dom, 7h às 18h",
      "tipo": "distribuição"
    },
    {
      "id": "55555555-6666-7777-8888-999999999999",
      "nome": "Ponto Parque Beija-Flor",
      "endereco": "Av. Paulo VI, s/n",
      "bairro": "Setor Jaó",
      "horario": "Ter a Dom, 8h às 17h",
      "tipo": "distribuição"
    },
    {
      "id": "66666666-7777-8888-9999-aaaaaaaaaaaa",
      "nome": "Ponto Parque Cascavel",
      "endereco": "Rua do Parque, s/n",
      "bairro": "Jardim Atlântico",
      "horario": "Seg a Dom, 8h às 18h",
      "tipo": "coleta"
    },
    {
      "id": "77777777-8888-9999-aaaa-bbbbbbbbbbbb",
      "nome": "Ponto Parque Flamboyant",
      "endereco": "Rua 15, s/n",
      "bairro": "Jardim Goiás",
      "horario": "Ter a Dom, 9h às 17h",
      "tipo": "coleta"
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 26,
    "totalPages": 3
  }
}
```

---

#### Exemplo 1.2: Filtrando por bairro (`filtro=Bueno` ou `filtro=Setor Bueno`)
**URL**: `http://localhost:8080/api/v1/pontos/filtro?filtro=Bueno`  
**Método**: `GET`  
**Código HTTP**: `200 OK`

```json
{
  "content": [
    {
      "id": "11111111-2222-3333-4444-555555555555",
      "nome": "Ponto Goiânia Shopping",
      "endereco": "Av. T-10, 1300",
      "bairro": "Setor Bueno",
      "horario": "Seg a Sáb, 10h às 22h",
      "tipo": "distribuição"
    },
    {
      "id": "88888888-9999-aaaa-bbbb-cccccccccccc",
      "nome": "Ponto Parque Vaca Brava",
      "endereco": "Av. T-10, s/n",
      "bairro": "Setor Bueno",
      "horario": "Seg a Sáb, 8h às 18h",
      "tipo": "coleta"
    },
    {
      "id": "99999999-aaaa-bbbb-cccc-dddddddddddd",
      "nome": "Ponto Praça Senador Coimbra Bueno",
      "endereco": "Praça Sen. Coimbra Bueno, s/n",
      "bairro": "Setor Coimbra",
      "horario": "Seg a Sex, 8h às 17h",
      "tipo": "coleta"
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 3,
    "totalPages": 1
  }
}
```

---

#### Exemplo 1.3: Pedindo a segunda página (`page=1&size=10`)
**URL**: `http://localhost:8080/api/v1/pontos/filtro?page=1&size=10`  
**Método**: `GET`  
**Código HTTP**: `200 OK`

```json
{
  "content": [
    {
      "id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      "nome": "Ponto Parque Leolídio di Ramos Caiado",
      "endereco": "Rua J-100, s/n",
      "bairro": "Setor Goiânia 2",
      "horario": "Ter a Dom, 8h às 17h",
      "tipo": "coleta"
    },
    {
      "id": "bbbbbbbb-cccc-dddd-eeee-ffffffffffff",
      "nome": "Ponto Parque Macambira Anicuns",
      "endereco": "Av. Madrid, s/n",
      "bairro": "Setor Faiçalville",
      "horario": "Ter a Dom, 7h às 18h",
      "tipo": "coleta"
    },
    {
      "id": "88888888-9999-aaaa-bbbb-cccccccccccc",
      "nome": "Ponto Parque Vaca Brava",
      "endereco": "Av. T-10, s/n",
      "bairro": "Setor Bueno",
      "horario": "Seg a Sáb, 8h às 18h",
      "tipo": "coleta"
    },
    {
      "id": "cccccccc-dddd-eeee-ffff-000000000000",
      "nome": "Ponto Passeio das Águas Shopping",
      "endereco": "Av. Perimetral Norte, 8303",
      "bairro": "Fazenda Caveiras",
      "horario": "Seg a Sáb, 10h às 22h",
      "tipo": "distribuição"
    },
    {
      "id": "dddddddd-eeee-ffff-0000-111111111111",
      "nome": "Ponto Praça C-8",
      "endereco": "Rua C-8, s/n",
      "bairro": "Setor Sudoeste",
      "horario": "Seg a Sex, 8h às 17h",
      "tipo": "distribuição"
    },
    {
      "id": "eeeeeeee-ffff-0000-1111-222222222222",
      "nome": "Ponto Praça da Matriz Campinas",
      "endereco": "Praça Santo Afonso, s/n",
      "bairro": "Setor Campinas",
      "horario": "Seg a Sáb, 8h às 17h",
      "tipo": "coleta"
    },
    {
      "id": "ffffffff-0000-1111-2222-333333333333",
      "nome": "Ponto Praça da Nova Suíça",
      "endereco": "Praça Wilson Rocha, s/n",
      "bairro": "Setor Nova Suíça",
      "horario": "Seg a Sáb, 8h às 18h",
      "tipo": "coleta"
    },
    {
      "id": "00000000-1111-2222-3333-444444444444",
      "nome": "Ponto Praça do Cruzeiro",
      "endereco": "Rua 84, s/n",
      "bairro": "Setor Sul",
      "horario": "Seg a Sex, 8h às 18h",
      "tipo": "distribuição"
    },
    {
      "id": "11111111-ffff-2222-3333-444444444444",
      "nome": "Ponto Praça Santos Dumont",
      "endereco": "Av. 4ª Radial, s/n",
      "bairro": "Setor Pedro Ludovico",
      "horario": "Seg a Sex, 8h às 17h",
      "tipo": "distribuição"
    },
    {
      "id": "22222222-eeee-3333-4444-555555555555",
      "nome": "Ponto Praça Senador Coimbra Bueno",
      "endereco": "Praça Sen. Coimbra Bueno, s/n",
      "bairro": "Setor Coimbra",
      "horario": "Seg a Sex, 8h às 17h",
      "tipo": "coleta"
    }
  ],
  "page": {
    "size": 10,
    "number": 1,
    "totalElements": 26,
    "totalPages": 3
  }
}
```

---

### 2. `GET /api/v1/pontos` - Listar todos os pontos (sem paginação)
**URL**: `http://localhost:8080/api/v1/pontos`  
**Método**: `GET`  
**Código HTTP**: `200 OK`

```json
[
  {
    "id": "e3b0c442-98fc-1c14-9afb-4c8996fb9242",
    "nome": "Ponto Central - Praça Cívica",
    "endereco": "Praça Pedro Ludovico Teixeira, s/n",
    "bairro": "Setor Central",
    "horario": "Seg a Sex, 8h às 17h",
    "tipo": "coleta"
  },
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "nome": "Ponto Parque Vaca Brava",
    "endereco": "Av. T-10, s/n",
    "bairro": "Setor Bueno",
    "horario": "Seg a Sáb, 8h às 18h",
    "tipo": "coleta"
  },
  {
    "id": "f5e4d3c2-b1a0-0987-dcba-fe0987654321",
    "nome": "Ponto Bosque dos Buritis",
    "endereco": "Av. Assis Chateaubriand, s/n",
    "bairro": "Setor Oeste",
    "horario": "Seg a Sex, 8h às 16h",
    "tipo": "distribuição"
  }
]
```

---

### 2. `GET /api/v1/pontos/{id}` - Buscar ponto por ID

#### Resposta `200 OK` (Ponto encontrado)
**URL**: `http://localhost:8080/api/v1/pontos/e3b0c442-98fc-1c14-9afb-4c8996fb9242`  
**Método**: `GET`

```json
{
  "id": "e3b0c442-98fc-1c14-9afb-4c8996fb9242",
  "nome": "Ponto Central - Praça Cívica",
  "endereco": "Praça Pedro Ludovico Teixeira, s/n",
  "bairro": "Setor Central",
  "horario": "Seg a Sex, 8h às 17h",
  "tipo": "coleta"
}
```

#### Resposta `404 Not Found` (ID inexistente)
**URL**: `http://localhost:8080/api/v1/pontos/00000000-0000-0000-0000-000000000000`  
**Método**: `GET`

```json
{
  "timestamp": "2026-11-16T18:30:00.000Z",
  "status": 404,
  "error": "Not Found",
  "message": "Ponto não encontrado com o ID: 00000000-0000-0000-0000-000000000000",
  "path": "/api/v1/pontos/00000000-0000-0000-0000-000000000000"
}
```

---

### 3. `POST /api/v1/pontos` - Cadastrar novo ponto
**URL**: `http://localhost:8080/api/v1/pontos`  
**Método**: `POST`

#### Corpo da Requisição (Válido):
```json
{
  "nome": "Ponto Setor Sul - Praça do Cruzeiro",
  "endereco": "Rua 84, s/n",
  "bairro": "Setor Sul",
  "horario": "Seg a Sex, 8h às 18h",
  "tipo": "distribuição"
}
```

#### Resposta `201 Created`:
```json
{
  "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "nome": "Ponto Setor Sul - Praça do Cruzeiro",
  "endereco": "Rua 84, s/n",
  "bairro": "Setor Sul",
  "horario": "Seg a Sex, 8h às 18h",
  "tipo": "distribuição"
}
```

#### Resposta `400 Bad Request` (Campo obrigatório vazio/ausente):
**Corpo da Requisição (Inválido - nome vazio):**
```json
{
  "nome": "",
  "endereco": "Av. Goiás, 100",
  "bairro": "Setor Central",
  "horario": "Seg a Sex, 8h às 17h",
  "tipo": "coleta"
}
```

**Resposta `400 Bad Request`:**
```json
{
  "timestamp": "2026-11-16T18:32:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Erro de validação nos campos informados",
  "path": "/api/v1/pontos",
  "errors": {
    "nome": "O nome é obrigatório e não pode ser vazio"
  }
}
```

---

### 4. `PUT /api/v1/pontos/{id}` - Atualizar ponto existente
**URL**: `http://localhost:8080/api/v1/pontos/e3b0c442-98fc-1c14-9afb-4c8996fb9242`  
**Método**: `PUT`

#### Corpo da Requisição:
```json
{
  "nome": "Ponto Central - Praça Cívica Reformado",
  "endereco": "Praça Pedro Ludovico Teixeira, 10",
  "bairro": "Setor Central",
  "horario": "Seg a Sáb, 7h às 19h",
  "tipo": "coleta"
}
```

#### Resposta `200 OK`:
```json
{
  "id": "e3b0c442-98fc-1c14-9afb-4c8996fb9242",
  "nome": "Ponto Central - Praça Cívica Reformado",
  "endereco": "Praça Pedro Ludovico Teixeira, 10",
  "bairro": "Setor Central",
  "horario": "Seg a Sáb, 7h às 19h",
  "tipo": "coleta"
}
```

#### Resposta `400 Bad Request` (Edição com campo vazio):
```json
{
  "timestamp": "2026-11-16T18:33:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Erro de validação nos campos informados",
  "path": "/api/v1/pontos/e3b0c442-98fc-1c14-9afb-4c8996fb9242",
  "errors": {
    "endereco": "O endereço é obrigatório e não pode ser vazio"
  }
}
```

#### Resposta `404 Not Found` (Edição de ID inexistente):
```json
{
  "timestamp": "2026-11-16T18:34:00.000Z",
  "status": 404,
  "error": "Not Found",
  "message": "Ponto não encontrado com o ID: 00000000-0000-0000-0000-000000000000",
  "path": "/api/v1/pontos/00000000-0000-0000-0000-000000000000"
}
```

---

### 5. `DELETE /api/v1/pontos/{id}` - Excluir ponto
**URL**: `http://localhost:8080/api/v1/pontos/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`  
**Método**: `DELETE`

#### Resposta `204 No Content`:
*(Sem corpo retornado)*

#### Resposta `404 Not Found` (Exclusão de ID inexistente):
```json
{
  "timestamp": "2026-11-16T18:35:00.000Z",
  "status": 404,
  "error": "Not Found",
  "message": "Ponto não encontrado com o ID: 00000000-0000-0000-0000-000000000000",
  "path": "/api/v1/pontos/00000000-0000-0000-0000-000000000000"
}
```

---

## 🗂️ Estrutura do Projeto

```text
src/main/java/com/davy/backend/
├── BackendApplication.java
├── config/
│   ├── DataLoader.java        # Carga inicial com 10 pontos de Goiânia sem duplicação
│   └── OpenApiConfig.java     # Configuração da documentação Swagger/OpenAPI
├── controller/
│   ├── GlobalExceptionHandler.java # Tratamento global de exceções (400, 404, 500)
│   └── PontoController.java   # Endpoints REST com @CrossOrigin e OpenAPI tags
├── dto/
│   ├── PontoRequestDTO.java   # DTO com Bean Validation (@NotBlank)
│   └── PontoResponseDTO.java  # Record imutável retornado pelo controller
├── entity/
│   └── Ponto.java             # Entidade JPA mapeada para tb_ponto com UUID
├── repository/
│   └── PontoRepository.java   # Repositório Spring Data JPA
└── service/
    ├── PontoService.java      # Regras de negócio e conversões de DTO
    └── exception/
        └── ResourceNotFoundException.java # Exceção customizada para 404
```

### Integridade das doações

O cadastro e a atualização de doações recebem `tipoItem`, `quantidade` e
`pontoDestinoId` (UUID de um ponto existente). A resposta inclui `pontoDestinoId`
e `pontoDestino` com o nome atual do ponto. Um destino inexistente retorna 404;
a exclusão de um ponto com doações retorna 409. Os tipos de ponto aceitos são
`coleta` e `distribuição`, e os campos de texto aceitam até 255 caracteres.

Para bancos antigos com o destino salvo como texto, faça backup e execute
[scripts/migrate-doacao-destino.sql](scripts/migrate-doacao-destino.sql) com a
aplicação parada, antes de iniciar esta versão. Confira primeiro a consulta de
diagnóstico: nomes ausentes ou duplicados precisam ser resolvidos explicitamente.
Bancos novos recebem a associação pelo Hibernate. O script não é executado
automaticamente e mantém o texto antigo como histórico.

Os testes usam exclusivamente H2 em memória, configurado em
`src/test/resources/application.properties`; o banco local em arquivo não é usado.