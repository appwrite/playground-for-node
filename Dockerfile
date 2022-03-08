FROM node:16.0-alpine
WORKDIR /app
COPY . .
CMD npm install
CMD node src/app.js