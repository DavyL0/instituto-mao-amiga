# Instituto Mão Amiga - API de Pontos de Coleta e Distribuição

Projeto Spring Boot com operações CRUD completas para gerenciamento de pontos de coleta e distribuição de doações em Goiânia, utilizando banco de dados H2 gravado em arquivo e documentado com Swagger / OpenAPI.

---

## 📋 Critérios de Aceite Atendidos

- [x] **Dependências**: Spring Web, Spring Data JPA, H2 Database, Lombok, Swagger (springdoc-openapi) e Spring Boot Starter Validation.
- [x] **Estrutura de Pacotes**: `entity`, `repository`, `service`, `controller`, `dto` e `config`.
- [x] **Entidade Ponto**: `id` (UUID), `nome`, `endereco`, `bairro`, `horario` (texto, ex: "Seg a Sex, 8h às 17h") e `tipo` ("coleta" ou "distribuição").
- [x] **Banco H2 em Arquivo**: persistência configurada via `jdbc:h2:file:./data/pontosdb`.
- [x] **Carga Inicial**: 10 pontos em Goiânia carregados automaticamente sem duplicação a cada reinício.
- [x] **Bean Validation e @Valid**: DTO com validação de campos obrigatórios e não vazios (`@NotBlank`).
- [x] **PontoResponseDTO (record)**: Controller retorna apenas DTOs imutáveis, nunca a entidade diretamente.
- [x] **Endpoints CRUD**:
  - `GET /api/v1/pontos`
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

### 1. `GET /api/v1/pontos` - Listar todos os pontos
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
