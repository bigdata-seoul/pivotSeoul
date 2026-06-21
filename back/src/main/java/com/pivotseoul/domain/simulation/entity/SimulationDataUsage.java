package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "simulation_data_usage")
public class SimulationDataUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usage_id")
    private Long usageId;

    @Column(name = "simulation_run_id", nullable = false)
    private Long simulationRunId;

    @Column(name = "data_snapshot_id", nullable = false)
    private Long dataSnapshotId;

    @Column(name = "used_for", length = 128)
    private String usedFor;

    @Column(name = "used_field_list", columnDefinition = "TEXT")
    private String usedFieldList;

    @Column(name = "source_weight", precision = 14, scale = 6)
    private BigDecimal sourceWeight;

    protected SimulationDataUsage() {
    }

    public Long getUsageId() {
        return usageId;
    }

    public void setUsageId(Long usageId) {
        this.usageId = usageId;
    }

    public Long getSimulationRunId() {
        return simulationRunId;
    }

    public void setSimulationRunId(Long simulationRunId) {
        this.simulationRunId = simulationRunId;
    }

    public Long getDataSnapshotId() {
        return dataSnapshotId;
    }

    public void setDataSnapshotId(Long dataSnapshotId) {
        this.dataSnapshotId = dataSnapshotId;
    }

    public String getUsedFor() {
        return usedFor;
    }

    public void setUsedFor(String usedFor) {
        this.usedFor = usedFor;
    }

    public String getUsedFieldList() {
        return usedFieldList;
    }

    public void setUsedFieldList(String usedFieldList) {
        this.usedFieldList = usedFieldList;
    }

    public BigDecimal getSourceWeight() {
        return sourceWeight;
    }

    public void setSourceWeight(BigDecimal sourceWeight) {
        this.sourceWeight = sourceWeight;
    }
}
