package com.pivotseoul;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 이 파일은 백엔드(메인 서버) 시스템의 심장부이자 시작점입니다.
 * 
 * 비전공자를 위한 설명:
 * 이 프로그램은 'Pivot Seoul' 서비스의 모든 데이터를 관리하고, 
 * 사용자들의 요청(로그인, 데이터 조회 등)을 처리하는 중심 역할을 합니다.
 * 
 * @SpringBootApplication: 이 클래스가 스프링 부트라는 강력한 도구를 사용하여 
 * 서버를 실행할 준비가 되었음을 나타냅니다. 
 * scanBasePackages를 통해 'com.pivotseoul' 폴더 안의 모든 부품을 찾아내어 조립합니다.
 */
@SpringBootApplication(scanBasePackages = "com.pivotseoul")
public class PivotSeoulApplication {

    /**
     * 메인 메서드: 프로그램이 실행될 때 가장 먼저 호출되는 곳입니다.
     * 컴퓨터로 치면 전원 버튼을 누르는 것과 같습니다.
     */
    public static void main(String[] args) {
        // 이 한 줄이 실행되면서 내장된 웹 서버가 켜지고, 전체 시스템이 동작하기 시작합니다.
        SpringApplication.run(PivotSeoulApplication.class, args);
    }
}
