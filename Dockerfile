FROM node:alpine
WORKDIR /code
COPY package*.json ./
RUN npm i
COPY . .
CMD [ "node", "index.js" ]