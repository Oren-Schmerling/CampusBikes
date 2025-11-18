# ------------ 1) Build Stage ------------------
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy Gradle files first (cache dependencies)
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew ./
RUN chmod +x gradlew

# Download dependencies (cached unless build.gradle changes)
RUN ./gradlew dependencies --no-daemon || true

# Copy source code
COPY src ./src

# Build the JAR
RUN ./gradlew bootJar --no-daemon

# ------------ 2) Runtime Stage ------------------
FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app

# Copy only the JAR file from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

# Run Spring Boot JAR
CMD ["java", "-jar", "app.jar"]
