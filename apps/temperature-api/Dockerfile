# Build stage
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./server.js
EXPOSE 8081
ENV NODE_ENV=production
USER node
CMD ["node", "server.js"]


