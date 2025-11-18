# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory in the container
WORKDIR /backend

# Copy the build.gradle and settings.gradle files
COPY build.gradle settings.gradle ./

# Copy the source code into the container
COPY src ./src

# Copy the Gradle wrapper files
COPY gradlew ./
COPY gradle ./gradle

# Make the Gradle wrapper executable
RUN chmod +x gradlew

# Build the application
RUN ./gradlew build --no-daemon -x test

# Expose the port the app runs on
EXPOSE 8080

# Run the application
CMD ["./gradlew", "bootRun"]