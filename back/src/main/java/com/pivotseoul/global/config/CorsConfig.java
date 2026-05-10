package com.pivotseoul.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

/**
 * Browser에서 Next.js 등으로 Spring API를 호출할 때 CORS 허용.
 * 프로덕션에서는 {@code pivotseoul.cors.allowed-origins} 로 도메인 제한 권장.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter(
            @Value("${pivotseoul.cors.allowed-origins:http://localhost:3000,http://127.0.0.1:3000}") String rawOrigins) {

        List<String> origins = Arrays.stream(rawOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(origins);
        config.addAllowedHeader(CorsConfiguration.ALL);
        config.addAllowedMethod(CorsConfiguration.ALL);
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
