package com.pivotseoul.domain.data.controller;

import com.pivotseoul.domain.data.dto.DataSourceResponse;
import com.pivotseoul.domain.data.dto.DatasetResponse;
import com.pivotseoul.domain.data.dto.ValidationResultResponse;
import com.pivotseoul.domain.data.service.DataSourceService;
import com.pivotseoul.domain.data.service.DataValidationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/data")
public class DataSourceController {

    private final DataSourceService dataSourceService;
    private final DataValidationService dataValidationService;

    public DataSourceController(
            DataSourceService dataSourceService,
            DataValidationService dataValidationService
    ) {
        this.dataSourceService = dataSourceService;
        this.dataValidationService = dataValidationService;
    }

    @GetMapping("/sources")
    public List<DataSourceResponse> getDataSources() {
        return dataSourceService.getDataSources();
    }

    @GetMapping("/datasets")
    public List<DatasetResponse> getDatasetStatuses() {
        return dataSourceService.getDatasetStatuses();
    }

    @GetMapping("/validations")
    public List<ValidationResultResponse> getValidationResults() {
        return dataValidationService.getValidationResults();
    }

    @GetMapping("/validations/{dataSnapshotId}")
    public List<ValidationResultResponse> getValidationResults(@PathVariable Long dataSnapshotId) {
        return dataValidationService.getValidationResults(dataSnapshotId);
    }
}
