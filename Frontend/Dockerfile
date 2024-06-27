FROM node:20.14.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm run build
RUN npm run build --configuration=production

FROM nginx:latest
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80