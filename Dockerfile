# Start your image with a node base image
FROM node:18-alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Copy local directories to the current local directory of our docker image (/app)
COPY ./src ./src
COPY ./target ./target
COPY ./lib ./lib
COPY ./frontend ./frontend
COPY ./mvn ./mvn
COPY ./idea ./idea
COPY ./github ./github

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN .\mvnw

EXPOSE 8080

# Start the app using serve command
CMD [ "serve", "-s", "build" ]