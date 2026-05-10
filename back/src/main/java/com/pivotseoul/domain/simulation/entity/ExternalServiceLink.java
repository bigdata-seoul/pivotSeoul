package com.pivotseoul.domain.simulation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "external_service_link")
public class ExternalServiceLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_link_id")
    private Long serviceLinkId;

    @Column(name = "link_type", length = 64)
    private String linkType;

    @Column(name = "title", length = 512)
    private String title;

    @Column(name = "url", nullable = false, length = 2048)
    private String url;

    @Column(name = "provider", length = 128)
    private String provider;

    protected ExternalServiceLink() {
    }

    public Long getServiceLinkId() {
        return serviceLinkId;
    }

    public void setServiceLinkId(Long serviceLinkId) {
        this.serviceLinkId = serviceLinkId;
    }

    public String getLinkType() {
        return linkType;
    }

    public void setLinkType(String linkType) {
        this.linkType = linkType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }
}
