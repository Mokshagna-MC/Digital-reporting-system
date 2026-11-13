# Stage 1: Build the JAR from source using Maven with Eclipse Temurin JDK 21
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy pom.xml and source files
COPY pom.xml .
COPY src ./src

# Build the executable jar (skipping unit tests for fast deployment)
RUN mvn clean package -DskipTests

# Stage 2: Lightweight official Java 21 JRE runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the compiled JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Support dynamic cloud port (Render sets $PORT, defaults to 8081 locally)
ENV PORT=8081
EXPOSE 8081

# Command to run the application
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -Dserver.port=${PORT} -jar app.jar"]
