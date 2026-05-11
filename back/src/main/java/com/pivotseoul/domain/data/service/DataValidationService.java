package com.pivotseoul.domain.data.service;

import com.pivotseoul.domain.data.dto.ValidationResultResponse;
import com.pivotseoul.domain.data.entity.DatasetValidationResult;
import com.pivotseoul.domain.data.repository.DatasetValidationResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataValidationService {

    private static final String STATUS_SUCCESS = "SUCCESS";
    private static final String STATUS_WARNING = "WARNING";
    private static final String STATUS_ERROR = "ERROR";
    private static final String LEVEL_SUCCESS = "success";
    private static final String LEVEL_WARN = "warn";
    private static final String LEVEL_ERROR = "error";
    private static final String LEVEL_INFO = "info";

    private final DatasetValidationResultRepository validationResultRepository;

    public DataValidationService(DatasetValidationResultRepository validationResultRepository) {
        this.validationResultRepository = validationResultRepository;
    }

    public List<ValidationResultResponse> getValidationResults() {
        List<ValidationResultResponse> results = validationResultRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
        if (results.isEmpty()) {
            return placeholderResults();
        }
        return results;
    }

    public List<ValidationResultResponse> getValidationResults(Long dataSnapshotId) {
        List<ValidationResultResponse> results = validationResultRepository
                .findByDataSnapshotIdOrderByValidationResultIdDesc(dataSnapshotId)
                .stream()
                .map(this::toResponse)
                .toList();
        if (results.isEmpty()) {
            return placeholderResults();
        }
        return results;
    }

    public String getLatestStatus(Long dataSnapshotId) {
        return validationResultRepository.findTopByDataSnapshotIdOrderByValidationResultIdDesc(dataSnapshotId)
                .map(DatasetValidationResult::getValidationStatus)
                .orElse(STATUS_WARNING);
    }

    private ValidationResultResponse toResponse(DatasetValidationResult result) {
        String status = normalizeStatus(result.getValidationStatus());
        return new ValidationResultResponse(
                result.getValidationResultId(),
                result.getDataSnapshotId(),
                status,
                result.getMissingCount(),
                result.getInvalidCount(),
                result.getDuplicateCount(),
                result.getValidationMessage(),
                resolveLevel(status)
        );
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return STATUS_WARNING;
        }
        return status.toUpperCase();
    }

    private String resolveLevel(String status) {
        return switch (status) {
            case STATUS_SUCCESS -> LEVEL_SUCCESS;
            case STATUS_ERROR -> LEVEL_ERROR;
            case STATUS_WARNING -> LEVEL_WARN;
            default -> LEVEL_INFO;
        };
    }

    private List<ValidationResultResponse> placeholderResults() {
        return List.of(new ValidationResultResponse(
                null,
                null,
                STATUS_WARNING,
                0,
                0,
                0,
                "검증 결과가 아직 연결되지 않았습니다.",
                LEVEL_WARN
        ));
    }
}
