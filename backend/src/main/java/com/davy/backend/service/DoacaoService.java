package com.davy.backend.service;

import com.davy.backend.dto.DoacaoRequestDTO;
import com.davy.backend.dto.DoacaoResponseDTO;
import com.davy.backend.entity.Doacao;
import com.davy.backend.entity.Ponto;
import com.davy.backend.repository.PontoRepository;
import com.davy.backend.repository.DoacaoRepository;
import com.davy.backend.service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoacaoService {

    private final DoacaoRepository doacaoRepository;
    private final PontoRepository pontoRepository;

    @Transactional(readOnly = true)
    public List<DoacaoResponseDTO> findAll() {
        return doacaoRepository.findAll()
                .stream()
                .map(DoacaoResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<DoacaoResponseDTO> findByFiltro(String filtro, Pageable pageable) {
        String termoFiltro = (filtro != null && !filtro.isBlank()) ? filtro.trim() : null;
        Page<Doacao> page = doacaoRepository.findByFiltro(termoFiltro, pageable);
        return page.map(DoacaoResponseDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public DoacaoResponseDTO findById(UUID id) {
        Doacao doacao = doacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doação não encontrada com o ID: " + id));
        return DoacaoResponseDTO.fromEntity(doacao);
    }

    @Transactional
    public DoacaoResponseDTO create(DoacaoRequestDTO dto) {
        Doacao doacao = dto.toEntity();
        doacao.setPontoDestino(findPonto(dto.pontoDestinoId()));
        doacao.setCriadoEm(LocalDateTime.now());
        Doacao savedDoacao = doacaoRepository.save(doacao);
        return DoacaoResponseDTO.fromEntity(savedDoacao);
    }

    @Transactional
    public DoacaoResponseDTO update(UUID id, DoacaoRequestDTO dto) {
        Doacao doacao = doacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doação não encontrada com o ID: " + id));

        doacao.setTipoItem(dto.tipoItem());
        doacao.setQuantidade(dto.quantidade());
        doacao.setPontoDestino(findPonto(dto.pontoDestinoId()));
        // criadoEm não muda na edição

        Doacao updatedDoacao = doacaoRepository.save(doacao);
        return DoacaoResponseDTO.fromEntity(updatedDoacao);
    }

    private Ponto findPonto(UUID id) {
        return pontoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ponto não encontrado com o ID: " + id));
    }

    @Transactional
    public void delete(UUID id) {
        if (!doacaoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doação não encontrada com o ID: " + id);
        }
        doacaoRepository.deleteById(id);
    }
}
