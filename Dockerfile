# Use an official, lightweight Java 21 runtime
FROM eclipse-temurin:21-jre-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled JAR file from your target folder into the container
# (Change the .jar name to match whatever was generated in Step 1.1)
COPY target/drs-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8081 as specified in your architecture
EXPOSE 8081

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
