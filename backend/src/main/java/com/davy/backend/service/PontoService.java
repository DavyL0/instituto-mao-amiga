package com.davy.backend.service;

import com.davy.backend.dto.PontoRequestDTO;
import com.davy.backend.dto.PontoResponseDTO;
import com.davy.backend.entity.Ponto;
import com.davy.backend.repository.PontoRepository;
import com.davy.backend.service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PontoService {

    private final PontoRepository pontoRepository;

    @Transactional(readOnly = true)
    public List<PontoResponseDTO> findAll() {
        return pontoRepository.findAll()
                .stream()
                .map(PontoResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<PontoResponseDTO> findByFiltro(String filtro, Pageable pageable) {
        String termoFiltro = (filtro != null && !filtro.isBlank()) ? filtro.trim() : null;
        Page<Ponto> page = pontoRepository.findByFiltro(termoFiltro, pageable);
        return page.map(PontoResponseDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public PontoResponseDTO findById(UUID id) {
        Ponto ponto = pontoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ponto não encontrado com o ID: " + id));
        return PontoResponseDTO.fromEntity(ponto);
    }

    @Transactional
    public PontoResponseDTO create(PontoRequestDTO dto) {
        Ponto ponto = dto.toEntity();
        Ponto savedPonto = pontoRepository.save(ponto);
        return PontoResponseDTO.fromEntity(savedPonto);
    }

    @Transactional
    public PontoResponseDTO update(UUID id, PontoRequestDTO dto) {
        Ponto ponto = pontoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ponto não encontrado com o ID: " + id));

        ponto.setNome(dto.nome());
        ponto.setEndereco(dto.endereco());
        ponto.setBairro(dto.bairro());
        ponto.setHorario(dto.horario());
        ponto.setTipo(dto.tipo());

        Ponto updatedPonto = pontoRepository.save(ponto);
        return PontoResponseDTO.fromEntity(updatedPonto);
    }

    @Transactional
    public void delete(UUID id) {
        if (!pontoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ponto não encontrado com o ID: " + id);
        }
        pontoRepository.deleteById(id);
    }
}
