package com.pivotseoul.global.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AiRestTemplateConfig {

    @Bean
    @Qualifier("aiRestTemplate")
    public RestTemplate aiRestTemplate(
            @Value("${pivotseoul.ai.connect-timeout-ms:5000}") int connectMs,
            @Value("${pivotseoul.ai.read-timeout-ms:120000}") int readMs) {

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(connectMs);
        factory.setReadTimeout(readMs);
        return new RestTemplate(factory);
    }
}
