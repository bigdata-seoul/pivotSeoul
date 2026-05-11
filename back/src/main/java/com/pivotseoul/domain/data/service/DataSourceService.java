package com.pivotseoul.domain.data.service;

import com.pivotseoul.domain.data.dto.DataSourceResponse;
import com.pivotseoul.domain.data.dto.DatasetResponse;
import com.pivotseoul.domain.data.entity.DataSnapshot;
import com.pivotseoul.domain.data.entity.DataSourceMeta;
import com.pivotseoul.domain.data.entity.DatasetRegistry;
import com.pivotseoul.domain.data.repository.DataSnapshotRepository;
import com.pivotseoul.domain.data.repository.DataSourceMetaRepository;
import com.pivotseoul.domain.data.repository.DatasetRegistryRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class DataSourceService {

    private static final String STATUS_ACTIVE = "active";
    private static final String STATUS_WARNING = "warning";
    private static final String STATUS_OUTDATED = "outdated";
    private static final String VALIDATION_SUCCESS = "SUCCESS";
    private static final BigDecimal RELIABILITY_WARNING = new BigDecimal("0.70");
    private static final BigDecimal RELIABILITY_ACTIVE = new BigDecimal("0.85");

    private final DataSourceMetaRepository dataSourceMetaRepository;
    private final DatasetRegistryRepository datasetRegistryRepository;
    private final DataSnapshotRepository dataSnapshotRepository;
    private final DataValidationService dataValidationService;

    public DataSourceService(
            DataSourceMetaRepository dataSourceMetaRepository,
            DatasetRegistryRepository datasetRegistryRepository,
            DataSnapshotRepository dataSnapshotRepository,
            DataValidationService dataValidationService
    ) {
        this.dataSourceMetaRepository = dataSourceMetaRepository;
        this.datasetRegistryRepository = datasetRegistryRepository;
        this.dataSnapshotRepository = dataSnapshotRepository;
        this.dataValidationService = dataValidationService;
    }

    public List<DataSourceResponse> getDataSources() {
        Map<Long, DatasetRegistry> datasets = datasetRegistryRepository.findAll().stream()
                .collect(Collectors.toMap(DatasetRegistry::getDatasetId, Function.identity()));
        List<DataSourceResponse> responses = dataSourceMetaRepository.findAll().stream()
                .map(source -> toDataSourceResponse(source, datasets.get(source.getDatasetId())))
                .toList();
        if (responses.isEmpty()) {
            return placeholderSources();
        }
        return responses;
    }

    public List<DatasetResponse> getDatasetStatuses() {
        List<DatasetResponse> responses = datasetRegistryRepository.findAll().stream()
                .map(this::toDatasetResponse)
                .toList();
        if (responses.isEmpty()) {
            return placeholderDatasets();
        }
        return responses;
    }

    private DataSourceResponse toDataSourceResponse(DataSourceMeta source, DatasetRegistry dataset) {
        Optional<DataSnapshot> latestSnapshot = dataSnapshotRepository
                .findTopByDataSourceIdOrderByCollectedAtDescDataSnapshotIdDesc(source.getDataSourceId());
        BigDecimal reliabilityScore = latestSnapshot
                .map(this::calculateReliabilityScore)
                .orElse(RELIABILITY_WARNING);
        String validationStatus = latestSnapshot
                .map(snapshot -> dataValidationService.getLatestStatus(snapshot.getDataSnapshotId()))
                .orElse(STATUS_WARNING);

        return new DataSourceResponse(
                source.getDataSourceId(),
                source.getDatasetId(),
                source.getSourceName(),
                dataset == null ? null : dataset.getProvider(),
                source.getSourceType(),
                source.getBaseDate(),
                latestSnapshot.map(DataSnapshot::getCollectedAt).orElse(null),
                resolveDatasetStatus(source.getBaseDate(), validationStatus),
                reliabilityScore,
                resolveReliabilityStatus(reliabilityScore),
                validationStatus
        );
    }

    private DatasetResponse toDatasetResponse(DatasetRegistry dataset) {
        Optional<DataSourceMeta> source = dataSourceMetaRepository.findAll().stream()
                .filter(item -> dataset.getDatasetId().equals(item.getDatasetId()))
                .findFirst();
        Optional<DataSnapshot> latestSnapshot = source
                .flatMap(item -> dataSnapshotRepository.findTopByDataSourceIdOrderByCollectedAtDescDataSnapshotIdDesc(item.getDataSourceId()));
        String validationStatus = latestSnapshot
                .map(snapshot -> dataValidationService.getLatestStatus(snapshot.getDataSnapshotId()))
                .orElse(STATUS_WARNING);
        BigDecimal reliabilityScore = latestSnapshot
                .map(this::calculateReliabilityScore)
                .orElse(RELIABILITY_WARNING);

        return new DatasetResponse(
                dataset.getDatasetId(),
                dataset.getDatasetCode(),
                dataset.getDatasetName(),
                dataset.getProvider(),
                dataset.getSourceUrl(),
                dataset.getUpdateCycle(),
                resolveDatasetStatus(source.map(DataSourceMeta::getBaseDate).orElse(null), validationStatus),
                latestSnapshot.map(DataSnapshot::getCollectedAt).orElse(null),
                latestSnapshot.map(DataSnapshot::getSnapshotVersion).orElse(null),
                latestSnapshot.map(DataSnapshot::getRowCount).orElse(null),
                resolveReliabilityStatus(reliabilityScore),
                validationStatus
        );
    }

    private BigDecimal calculateReliabilityScore(DataSnapshot snapshot) {
        if (snapshot.getDataQualityScore() != null) {
            return snapshot.getDataQualityScore();
        }
        if (snapshot.getCoverageRate() != null) {
            return snapshot.getCoverageRate();
        }
        return RELIABILITY_WARNING;
    }

    private String resolveReliabilityStatus(BigDecimal score) {
        if (score.compareTo(RELIABILITY_ACTIVE) >= 0) {
            return STATUS_ACTIVE;
        }
        if (score.compareTo(RELIABILITY_WARNING) >= 0) {
            return STATUS_WARNING;
        }
        return STATUS_OUTDATED;
    }

    private String resolveDatasetStatus(LocalDate baseDate, String validationStatus) {
        if (!VALIDATION_SUCCESS.equalsIgnoreCase(validationStatus)) {
            return STATUS_WARNING;
        }
        if (baseDate != null && baseDate.isBefore(LocalDate.now().minusYears(1))) {
            return STATUS_OUTDATED;
        }
        return STATUS_ACTIVE;
    }

    private List<DataSourceResponse> placeholderSources() {
        return List.of(new DataSourceResponse(
                null,
                null,
                "데이터 출처 미연결",
                "Pivot Seoul",
                "PLACEHOLDER",
                null,
                Instant.now(),
                STATUS_WARNING,
                RELIABILITY_WARNING,
                STATUS_WARNING,
                STATUS_WARNING
        ));
    }

    private List<DatasetResponse> placeholderDatasets() {
        return List.of(new DatasetResponse(
                null,
                "PLACEHOLDER",
                "데이터셋 상태 미연결",
                "Pivot Seoul",
                null,
                "수동",
                STATUS_WARNING,
                Instant.now(),
                "placeholder",
                0,
                STATUS_WARNING,
                STATUS_WARNING
        ));
    }
}
