# Stage 1: Build the Angular application
FROM node:20.14.0 AS build

RUN mkdir /usr/src/app 

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Run a clean install of the dependencies
RUN npm ci

# Install the dependencies
RUN npm install -g @angular/cli 

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular application in production mode
RUN npm run build --configuration=production

# Stage 2: Serve the Angular application using Nginx
FROM nginx:alpine 

# Copy the build output from the previous stage to the Nginx html folder
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
