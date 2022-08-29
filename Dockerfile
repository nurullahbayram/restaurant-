# Use image: Linux and Java
FROM openjdk:16-jdk-alpine
# Out Spring Boot jar
COPY target/app.jar /app.jar
ENTRYPOINT ["java","-jar","/app.jar"]