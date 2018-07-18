FROM node:8.11.3

RUN mkdir /src
WORKDIR /src

RUN npm install -g serve

COPY package.json /src/
COPY .env.production /src/
COPY src/ /src/src/
COPY public/ /src/public/

RUN npm install && npm run build
