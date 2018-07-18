FROM node:8.11.3

RUN mkdir /src
WORKDIR /src

COPY package.json /src/
COPY mocks/ /src/mocks/
COPY src/ /src/src/

RUN npm install
