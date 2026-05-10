package com.pivotseoul;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.pivotseoul")
public class PivotSeoulApplication {

    public static void main(String[] args) {
        SpringApplication.run(PivotSeoulApplication.class, args);
    }
}
