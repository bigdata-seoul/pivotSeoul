FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /workspace

COPY gradlew gradlew.bat ./
COPY gradle gradle
COPY build.gradle settings.gradle ./
RUN ./gradlew dependencies --no-daemon -q 2>/dev/null || true

COPY src src
RUN ./gradlew bootJar --no-daemon -x test

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S pivotseoul && adduser -S pivotseoul -G pivotseoul

COPY --from=build /workspace/build/libs/*.jar app.jar
RUN chown pivotseoul:pivotseoul app.jar

USER pivotseoul

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
