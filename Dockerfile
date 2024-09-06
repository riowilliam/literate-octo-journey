FROM node:18.19.1 AS build

ARG API_URL

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

RUN sed -i "s|API_URL_PLACEHOLDER|${API_URL}|g" src/environments/environment.ts

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/fision-web /usr/share/nginx/html
