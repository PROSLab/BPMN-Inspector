FROM eclipse-temurin:17-jre

RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install --upgrade pip
RUN pip3 install numpy matplotlib pandas
ENV PATH="/usr/bin/python3:${PATH}"
ENV PYTHONPATH="/usr/bin/python3"
RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app
COPY target/*.jar /app/app.jar
COPY . .
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "./app.jar"]
