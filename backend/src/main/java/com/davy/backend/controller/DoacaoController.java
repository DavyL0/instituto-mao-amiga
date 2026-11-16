package com.davy.backend.controller;

import com.davy.backend.dto.DoacaoRequestDTO;
import com.davy.backend.dto.DoacaoResponseDTO;
import com.davy.backend.service.DoacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doacoes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Doações", description = "Endpoints para gerenciamento de doações")
public class DoacaoController {

    private final DoacaoService doacaoService;

    @Operation(summary = "Listar todas as doações", description = "Retorna a lista completa de doações cadastradas")
    @ApiResponse(responseCode = "200", description = "Lista de doações retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<DoacaoResponseDTO>> getAllDoacoes() {
        return ResponseEntity.ok(doacaoService.findAll());
    }

    @Operation(summary = "Buscar doações paginadas com filtro", description = "Retorna uma página de doações filtradas pelo tipo de item (sem diferenciar maiúsculas/minúsculas), ordenadas da mais nova para a mais antiga por padrão")
    @ApiResponse(responseCode = "200", description = "Página de doações retornada com sucesso")
    @GetMapping("/filtro")
    public ResponseEntity<Page<DoacaoResponseDTO>> getDoacoesComFiltro(
            @Parameter(description = "Termo de busca para tipo de item")
            @RequestParam(required = false) String filtro,
            @PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(doacaoService.findByFiltro(filtro, pageable));
    }

    @Operation(summary = "Buscar doação por ID", description = "Retorna os detalhes de uma doação específica a partir do seu UUID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Doação encontrada com sucesso",
                    content = @Content(schema = @Schema(implementation = DoacaoResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Doação não encontrada", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<DoacaoResponseDTO> getDoacaoById(
            @Parameter(description = "UUID da doação", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok(doacaoService.findById(id));
    }

    @Operation(summary = "Cadastrar nova doação", description = "Cria um novo registro de doação")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Doação cadastrada com sucesso",
                    content = @Content(schema = @Schema(implementation = DoacaoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos no corpo da requisição", content = @Content)
    })
    @PostMapping
    public ResponseEntity<DoacaoResponseDTO> createDoacao(
            @Parameter(description = "Dados para cadastro da doação", required = true)
            @Valid @RequestBody DoacaoRequestDTO doacaoRequestDTO) {
        DoacaoResponseDTO created = doacaoService.create(doacaoRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Atualizar doação existente", description = "Atualiza os dados de uma doação existente a partir do seu UUID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Doação atualizada com sucesso",
                    content = @Content(schema = @Schema(implementation = DoacaoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos no corpo da requisição", content = @Content),
            @ApiResponse(responseCode = "404", description = "Doação não encontrada para atualização", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<DoacaoResponseDTO> updateDoacao(
            @Parameter(description = "UUID da doação", required = true)
            @PathVariable UUID id,
            @Parameter(description = "Novos dados da doação", required = true)
            @Valid @RequestBody DoacaoRequestDTO doacaoRequestDTO) {
        return ResponseEntity.ok(doacaoService.update(id, doacaoRequestDTO));
    }

    @Operation(summary = "Excluir doação", description = "Remove um registro de doação a partir do seu UUID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Doação removida com sucesso"),
            @ApiResponse(responseCode = "404", description = "Doação não encontrada", content = @Content)
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteDoacao(
            @Parameter(description = "UUID da doação", required = true)
            @PathVariable UUID id) {
        doacaoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
