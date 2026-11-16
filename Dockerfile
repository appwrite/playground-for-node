FROM node:16.20-alpine@sha256:a1f9d027912b58a7c75be7716c97cfbc6d3099f3a97ed84aa490be9dee20e787
WORKDIR /app
COPY . .
CMD npm install
CMD node src/app.js