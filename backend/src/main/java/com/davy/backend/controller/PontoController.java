package com.davy.backend.controller;

import com.davy.backend.dto.PontoRequestDTO;
import com.davy.backend.dto.PontoResponseDTO;
import com.davy.backend.service.PontoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pontos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Pontos de Coleta e Distribuição", description = "Endpoints para gerenciamento dos pontos de coleta e distribuição")
public class PontoController {

    private final PontoService pontoService;

    @Operation(summary = "Listar todos os pontos", description = "Retorna a lista completa de pontos de coleta e distribuição cadastrados")
    @ApiResponse(responseCode = "200", description = "Lista de pontos retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<PontoResponseDTO>> getAllPontos() {
        return ResponseEntity.ok(pontoService.findAll());
    }

    @Operation(summary = "Buscar ponto por ID", description = "Retorna os detalhes de um ponto específico a partir do seu UUID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ponto encontrado com sucesso",
                    content = @Content(schema = @Schema(implementation = PontoResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Ponto não encontrado", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<PontoResponseDTO> getPontoById(
            @Parameter(description = "UUID do ponto", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok(pontoService.findById(id));
    }

    @Operation(summary = "Cadastrar novo ponto", description = "Cria um novo ponto de coleta ou distribuição")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Ponto cadastrado com sucesso",
                    content = @Content(schema = @Schema(implementation = PontoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos no corpo da requisição", content = @Content)
    })
    @PostMapping
    public ResponseEntity<PontoResponseDTO> createPonto(
            @Parameter(description = "Dados para cadastro do ponto", required = true)
            @Valid @RequestBody PontoRequestDTO pontoRequestDTO) {
        PontoResponseDTO created = pontoService.create(pontoRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Atualizar ponto existente", description = "Atualiza os dados de um ponto existente a partir do seu UUID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ponto atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = PontoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos no corpo da requisição", content = @Content),
            @ApiResponse(responseCode = "404", description = "Ponto não encontrado para atualização", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<PontoResponseDTO> updatePonto(
            @Parameter(description = "UUID do ponto", required = true)
            @PathVariable UUID id,
            @Parameter(description = "Novos dados do ponto", required = true)
            @Valid @RequestBody PontoRequestDTO pontoRequestDTO) {
        return ResponseEntity.ok(pontoService.update(id, pontoRequestDTO));
    }

    @Operation(summary = "Excluir ponto", description = "Remove um ponto de coleta ou distribuição a partir do seu UUID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Ponto removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Ponto não encontrado", content = @Content)
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deletePonto(
            @Parameter(description = "UUID do ponto", required = true)
            @PathVariable UUID id) {
        pontoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
