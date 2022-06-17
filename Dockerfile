FROM openjdk:11-jre-slim
COPY target/bookstore.jar bookstore.jar
ENTRYPOINT ["java","-jar","/bookstore.jar"]