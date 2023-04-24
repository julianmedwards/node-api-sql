ARG NODE_VERSION

FROM node:$NODE_VERSION

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

WORKDIR /usr/src/api

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "start-prod" ]