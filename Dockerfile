FROM eclipse-temurin:17-jre
COPY target/*.jar app.jar
COPY . /app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
