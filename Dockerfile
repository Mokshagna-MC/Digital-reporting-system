# Multi-stage Dockerfile for Spring Boot + PostgreSQL Digital Reporting System
# Stage 1: Build JAR using Maven with Eclipse Temurin JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the executable jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime image using minimal JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add a non-privileged user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy built artifact from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose Spring Boot server port (matches PORT environment variable provided by Render/Railway)
ENV PORT=8080
EXPOSE 8080

# Run Spring Boot with container-aware JVM settings
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT} -jar app.jar"]
