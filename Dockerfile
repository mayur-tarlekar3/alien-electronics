# Stage 1: Build the React Frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Java Backend
FROM maven:3.9-eclipse-temurin-21-alpine as backend-builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY WebContent ./WebContent
COPY frontend ./frontend
# Copy the built frontend to Tomcat's webapps directory during the war creation
COPY --from=frontend-builder /app/frontend/dist ./WebContent
RUN mvn clean package -DskipTests

# Stage 3: Run the application in Tomcat
FROM tomcat:9.0-jdk21-openjdk-slim
WORKDIR /usr/local/tomcat/webapps/
# Remove default Tomcat apps and disable shutdown port to fix Render health checks
RUN rm -rf ./ROOT ./examples ./docs ./manager ./host-manager && \
    sed -i 's/port="8005" shutdown="SHUTDOWN"/port="-1" shutdown="SHUTDOWN"/g' /usr/local/tomcat/conf/server.xml
# Copy the built WAR file as ROOT.war so it serves at the base URL
COPY --from=backend-builder /app/target/*.war ./ROOT.war

EXPOSE 8080
ENV PORT=8080
CMD ["catalina.sh", "run"]
