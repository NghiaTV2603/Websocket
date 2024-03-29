# Docker file for Nodejs
# Version 1.0
FROM node:16.15.0

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
