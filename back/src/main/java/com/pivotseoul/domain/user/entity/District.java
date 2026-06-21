package com.pivotseoul.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "district")
public class District {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "district_id")
    private Long districtId;

    @Column(name = "district_code", nullable = false, unique = true, length = 16)
    private String districtCode;

    @Column(name = "district_name", nullable = false, length = 64)
    private String districtName;

    @Column(name = "region_group", length = 64)
    private String regionGroup;

    protected District() {
    }

    public Long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(Long districtId) {
        this.districtId = districtId;
    }

    public String getDistrictCode() {
        return districtCode;
    }

    public void setDistrictCode(String districtCode) {
        this.districtCode = districtCode;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public String getRegionGroup() {
        return regionGroup;
    }

    public void setRegionGroup(String regionGroup) {
        this.regionGroup = regionGroup;
    }
}
